(() => {
  'use strict';

  const STORAGE_KEY = 'nge-language-v3';
  const LEGACY_KEYS = ['nge-language-v1', 'nge-language-v2'];
  const SUPPORTED = ['th', 'en', 'zh-CN'];
  const host = window.location.hostname;
  let enginePromise = null;
  let switching = false;
  let layoutTimer = 0;

  const FLAGS = {
    th: `<svg viewBox="0 0 36 24" aria-hidden="true" focusable="false"><rect width="36" height="24" fill="#A51931"/><rect y="4" width="36" height="16" fill="#F4F5F8"/><rect y="8" width="36" height="8" fill="#2D2A4A"/></svg>`,
    en: `<svg viewBox="0 0 60 36" aria-hidden="true" focusable="false"><rect width="60" height="36" fill="#012169"/><path d="M0 0 60 36M60 0 0 36" stroke="#fff" stroke-width="8"/><path d="M0 0 60 36M60 0 0 36" stroke="#C8102E" stroke-width="4"/><path d="M30 0v36M0 18h60" stroke="#fff" stroke-width="12"/><path d="M30 0v36M0 18h60" stroke="#C8102E" stroke-width="7"/></svg>`,
    'zh-CN': `<svg viewBox="0 0 36 24" aria-hidden="true" focusable="false"><rect width="36" height="24" fill="#DE2910"/><path d="m7 4 1.1 2.2 2.4.35-1.75 1.7.4 2.4L7 9.55l-2.15 1.1.4-2.4L3.5 6.55l2.4-.35zM13 3.2l.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm2.4 3.5.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm-.3 4.4.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm-2.8 3.1.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15z" fill="#FFDE00"/></svg>`
  };

  function safeStorageGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function safeStorageSet(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function migrateLegacyStorage() {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        for (const key of LEGACY_KEYS) {
          const value = localStorage.getItem(key);
          if (SUPPORTED.includes(value)) {
            localStorage.setItem(STORAGE_KEY, value);
            break;
          }
        }
      }
      LEGACY_KEYS.forEach(key => localStorage.removeItem(key));
    } catch (_) {}
  }

  function cookieLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/th\/([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function clearTranslateCookie() {
    const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
    const domains = ['', `domain=${host};`, 'domain=.ngebuild.com;'];
    domains.forEach(domain => {
      document.cookie = `googtrans=;expires=${expired};path=/;${domain}SameSite=Lax`;
    });
  }

  function setTranslateCookie(language) {
    clearTranslateCookie();
    const value = `/th/${language}`;
    document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
    if (host === 'ngebuild.com' || host.endsWith('.ngebuild.com')) {
      document.cookie = `googtrans=${value};path=/;domain=.ngebuild.com;SameSite=Lax`;
    }
  }

  function currentLanguage() {
    const saved = safeStorageGet();
    if (SUPPORTED.includes(saved)) return saved;
    const cookie = cookieLanguage();
    if (SUPPORTED.includes(cookie)) return cookie;
    clearTranslateCookie();
    return 'th';
  }

  function flagButton(language, label) {
    return `<button type="button" class="nge-language-flag" data-nge-language="${language}" lang="${language}" aria-label="${label}" title="${label}"><span class="nge-flag-frame">${FLAGS[language]}</span></button>`;
  }

  function languageMarkup(mode = 'desktop') {
    return `<div class="nge-language-switch nge-language-switch--${mode} notranslate" role="group" aria-label="เลือกภาษา" translate="no">
      ${flagButton('th', 'ภาษาไทย')}
      ${flagButton('en', 'English')}
      ${flagButton('zh-CN', '简体中文')}
    </div>`;
  }

  const UI_COPY = {
    th: {
      nav: { home: 'หน้าหลัก', about: 'ประวัติบริษัท', services: 'บริการ', projects: 'ผลงาน', knowledge: 'ความรู้', faq: 'คำถามที่พบบ่อย', contact: 'ติดต่อเรา', reviews: 'รีวิว' },
      consult: 'คุยกับทีมงาน', menu: 'เมนู', estimate: 'เริ่มส่งข้อมูล', linePhotos: 'ส่งรูปทาง LINE'
    },
    en: {
      nav: { home: 'Home', about: 'Company', services: 'Services', projects: 'Projects', knowledge: 'Knowledge', faq: 'FAQ', contact: 'Contact', reviews: 'Reviews' },
      consult: 'Talk to us', menu: 'MENU', estimate: 'Start estimate', linePhotos: 'Send photos via LINE'
    },
    'zh-CN': {
      nav: { home: '首页', about: '公司简介', services: '服务', projects: '项目案例', knowledge: '知识中心', faq: '常见问题', contact: '联系我们', reviews: '客户评价' },
      consult: '咨询团队', menu: '菜单', estimate: '开始提交资料', linePhotos: '通过 LINE 发送照片'
    }
  };

  function setTextKeepingChildren(element, text) {
    if (!element) return;
    const keep = Array.from(element.children);
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
      else if (node.nodeType === Node.ELEMENT_NODE && !keep.includes(node)) node.remove();
    });
    element.insertBefore(document.createTextNode(`${text} `), element.firstChild);
  }

  function applyStableUiCopy(language) {
    const copy = UI_COPY[language] || UI_COPY.th;
    const navKey = link => {
      const explicit = link.getAttribute('data-nav');
      if (explicit) return explicit;
      let path = '';
      try { path = new URL(link.getAttribute('href') || '', window.location.href).pathname; } catch (_) {}
      const raw = link.getAttribute('href') || '';
      if (raw.includes('/projects#reviews')) return 'reviews';
      if (path === '/' || path === '') return 'home';
      if (path.startsWith('/about')) return 'about';
      if (path.startsWith('/services')) return 'services';
      if (path.startsWith('/projects')) return 'projects';
      if (path.startsWith('/knowledge')) return 'knowledge';
      if (path.startsWith('/faq')) return 'faq';
      if (path.startsWith('/contact')) return 'contact';
      return '';
    };
    document.querySelectorAll('.desktop-nav a[href], .mobile-panel nav a[href]').forEach(link => {
      const key = navKey(link);
      if (copy.nav[key]) link.textContent = copy.nav[key];
    });
    const consult = document.querySelector('.header-call small');
    if (consult) consult.textContent = copy.consult;
    const menuLabel = document.querySelector('.menu-toggle-label');
    if (menuLabel) menuLabel.textContent = copy.menu;

    document.querySelectorAll('.photo-estimate-actions .js-estimate-link').forEach(link => setTextKeepingChildren(link, copy.estimate));
    document.querySelectorAll('.photo-estimate-actions .js-line-link').forEach(link => { link.textContent = copy.linePhotos; });
  }

  function protectStableInteractiveUi() {
    document.querySelectorAll('.site-header, .photo-estimate-actions, .nge-language-switch, .menu-toggle, .mobile-dock, .floating-actions').forEach(node => {
      node.classList.add('notranslate');
      node.setAttribute('translate', 'no');
    });
  }

  function setState(language) {
    const translated = language !== 'th';
    document.documentElement.lang = language === 'zh-CN' ? 'zh-CN' : language;
    document.documentElement.classList.toggle('nge-translated', translated);
    document.documentElement.dataset.ngeLanguage = language;
    document.querySelectorAll('[data-nge-language]').forEach(button => {
      const active = button.getAttribute('data-nge-language') === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    protectStableInteractiveUi();
    applyStableUiCopy(language);
    scheduleLayoutRepair();
  }

  function injectTranslateRoot() {
    if (document.getElementById('nge-google-translate')) return;
    const root = document.createElement('div');
    root.id = 'nge-google-translate';
    root.className = 'nge-google-translate-root notranslate';
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('translate', 'no');
    document.body.appendChild(root);
  }

  function warmConnections() {
    ['https://translate.google.com', 'https://translate.googleapis.com', 'https://translate-pa.googleapis.com'].forEach(href => {
      if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  function createTranslateElement() {
    injectTranslateRoot();
    if (!document.querySelector('#nge-google-translate .goog-te-combo')) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'th',
        includedLanguages: 'en,zh-CN',
        autoDisplay: false,
        multilanguagePage: true,
      }, 'nge-google-translate');
    }
  }

  function ensureEngine() {
    warmConnections();
    if (window.google?.translate?.TranslateElement) {
      try { createTranslateElement(); } catch (_) {}
      return Promise.resolve();
    }
    if (enginePromise) return enginePromise;
    enginePromise = new Promise((resolve, reject) => {
      injectTranslateRoot();
      window.ngeGoogleTranslateInit = () => {
        try { createTranslateElement(); resolve(); }
        catch (error) { reject(error); }
      };
      const existing = document.getElementById('nge-google-translate-script');
      if (existing) {
        const wait = setInterval(() => {
          if (!window.google?.translate?.TranslateElement) return;
          clearInterval(wait);
          try { createTranslateElement(); resolve(); }
          catch (error) { reject(error); }
        }, 35);
        setTimeout(() => { clearInterval(wait); reject(new Error('Translation service timed out')); }, 6500);
        return;
      }
      const script = document.createElement('script');
      script.id = 'nge-google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=ngeGoogleTranslateInit';
      script.async = true;
      script.onerror = () => reject(new Error('Unable to load translation service'));
      document.head.appendChild(script);
    });
    return enginePromise;
  }

  function applyCombo(language, attempts = 0) {
    return new Promise((resolve, reject) => {
      const run = count => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          if (!['en', 'zh-CN'].includes(language)) return resolve(false);
          combo.value = language;
          combo.dispatchEvent(new Event('change', { bubbles: true }));
          resolve(true);
          return;
        }
        if (count >= 90) return reject(new Error('Translation selector unavailable'));
        setTimeout(() => run(count + 1), 30);
      };
      run(attempts);
    });
  }

  function beginSwitch(language) {
    switching = true;
    document.documentElement.classList.add('nge-language-switching');
    document.querySelectorAll('[data-nge-language]').forEach(button => { button.disabled = true; });
    setState(language);
  }

  function endSwitch() {
    switching = false;
    document.documentElement.classList.remove('nge-language-switching');
    document.querySelectorAll('[data-nge-language]').forEach(button => { button.disabled = false; });
    scheduleLayoutRepair();
  }

  async function selectLanguage(language) {
    if (!SUPPORTED.includes(language) || switching) return;
    const current = currentLanguage();
    if (current === language) {
      setState(language);
      return;
    }

    safeStorageSet(language);
    beginSwitch(language);

    if (language === 'th') {
      clearTranslateCookie();
      try { sessionStorage.setItem('nge-restore-scroll', String(window.scrollY || 0)); } catch (_) {}
      window.location.reload();
      return;
    }

    setTranslateCookie(language);
    try {
      await ensureEngine();
      await applyCombo(language);
      // Google Translate updates text in multiple short DOM batches. Repair after each likely batch.
      [40, 120, 260, 520, 900].forEach(delay => setTimeout(scheduleLayoutRepair, delay));
      setTimeout(endSwitch, 900);
    } catch (error) {
      console.warn('[NGE language]', error);
      // Cookie is already set, so a normal reload is the most reliable fallback.
      window.location.reload();
    }
  }

  function protectBrandContent(header) {
    header.classList.add('notranslate');
    header.setAttribute('translate', 'no');
    header.querySelectorAll('.brand, .js-phone-text, .js-phone-secondary-text, .js-line-text, .phone-glyph, .menu-toggle-label, .nge-language-switch').forEach(node => {
      node.classList.add('notranslate');
      node.setAttribute('translate', 'no');
    });
  }

  function injectSwitchers() {
    const header = document.querySelector('.site-header');
    if (!header) return false;
    const inner = header.querySelector('.header-inner');
    if (!inner) return false;

    header.querySelectorAll('.mobile-panel .nge-language-switch').forEach(node => node.remove());

    if (!inner.querySelector('.nge-language-switch--desktop')) {
      const holder = document.createElement('div');
      holder.innerHTML = languageMarkup('desktop');
      const switcher = holder.firstElementChild;
      const call = inner.querySelector('.header-call');
      if (call) inner.insertBefore(switcher, call);
      else inner.appendChild(switcher);
    }

    if (!inner.querySelector('.nge-language-switch--mobile-header')) {
      const holder = document.createElement('div');
      holder.innerHTML = languageMarkup('mobile-header');
      const switcher = holder.firstElementChild;
      const menu = inner.querySelector('.menu-toggle');
      if (menu) inner.insertBefore(switcher, menu);
      else inner.appendChild(switcher);
    }

    protectBrandContent(header);
    setState(currentLanguage());
    return true;
  }

  // Navigation intentionally uses native <a href> behavior.
  // Do not intercept same-origin links here: Google Translate mutates the DOM and a
  // global capture-phase click handler can make ordinary navigation unreliable.

  function bindFlags() {
    document.addEventListener('click', event => {
      const button = event.target.closest?.('[data-nge-language]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      selectLanguage(button.getAttribute('data-nge-language'));
    });
  }

  function repairTranslatedLayout() {
    layoutTimer = 0;
    if (currentLanguage() === 'th') return;

    const candidates = document.querySelectorAll([
      '.btn', '.submit-btn', '.desktop-nav a', '.mobile-panel nav a',
      '.quick-card', '.home-route-card', '.service-copy', '.project-body',
      '.knowledge-featured> a>div', '.knowledge-swnp-card> a>div', '.page-proof div',
      '.process-step', '.review-card', '.about-ref-service', '.about-swnp-services article',
      '.history-card', '.quote-proof', '.quote-proof-card span', '.footer-grid>*',
      '.footer-actions>a', '.ppm-side-actions>a', '.contact-method', '.seo-card', '.cluster-card'
    ].join(','));

    candidates.forEach(node => {
      node.classList.remove('nge-text-overflow');
      if (!(node instanceof HTMLElement) || node.offsetParent === null) return;
      const overflowX = node.scrollWidth > node.clientWidth + 3;
      const overflowY = node.scrollHeight > node.clientHeight + 3;
      if (overflowX || overflowY) node.classList.add('nge-text-overflow');
    });
  }

  function scheduleLayoutRepair() {
    if (layoutTimer) clearTimeout(layoutTimer);
    layoutTimer = window.setTimeout(repairTranslatedLayout, 45);
  }

  function observeTranslationChanges() {
    const observer = new MutationObserver(mutations => {
      if (currentLanguage() === 'th') return;
      // Ignore mutations inside the hidden Google control itself.
      if (mutations.every(m => m.target.closest?.('#nge-google-translate'))) return;
      scheduleLayoutRepair();
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    window.addEventListener('resize', scheduleLayoutRepair, { passive: true });
  }

  function restoreScroll() {
    try {
      const value = sessionStorage.getItem('nge-restore-scroll');
      if (value !== null) {
        sessionStorage.removeItem('nge-restore-scroll');
        requestAnimationFrame(() => window.scrollTo(0, Number(value) || 0));
      }
    } catch (_) {}
  }

  function init() {
    migrateLegacyStorage();
    bindFlags();
    protectStableInteractiveUi();
    restoreScroll();

    if (!injectSwitchers()) {
      const observer = new MutationObserver(() => {
        if (injectSwitchers()) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 5000);
    }

    const selected = currentLanguage();
    safeStorageSet(selected);
    setState(selected);
    observeTranslationChanges();

    const preload = () => ensureEngine().catch(error => console.warn('[NGE language preload]', error));
    if ('requestIdleCallback' in window) requestIdleCallback(preload, { timeout: 650 });
    else setTimeout(preload, 80);

    if (selected !== 'th') {
      setTranslateCookie(selected);
      ensureEngine()
        .then(() => applyCombo(selected))
        .then(() => [80, 220, 500, 900].forEach(delay => setTimeout(scheduleLayoutRepair, delay)))
        .catch(error => console.warn('[NGE language]', error));
    } else {
      clearTranslateCookie();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
