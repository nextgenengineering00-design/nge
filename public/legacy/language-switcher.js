(() => {
  'use strict';

  const STORAGE_KEY = 'nge-language-v1';
  const SUPPORTED = ['th', 'en', 'zh-CN'];
  const host = window.location.hostname;
  let enginePromise = null;

  function safeStorageGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function safeStorageSet(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function cookieLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/th\/([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function currentLanguage() {
    const saved = safeStorageGet();
    if (SUPPORTED.includes(saved)) return saved;
    const cookie = cookieLanguage();
    return SUPPORTED.includes(cookie) ? cookie : 'th';
  }

  function setTranslateCookie(language) {
    const value = `/th/${language}`;
    document.cookie = `googtrans=${value};path=/;SameSite=Lax`;
    if (host === 'ngebuild.com' || host.endsWith('.ngebuild.com')) {
      document.cookie = `googtrans=${value};path=/;domain=.ngebuild.com;SameSite=Lax`;
    }
  }

  function clearTranslateCookie() {
    const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `googtrans=;expires=${expired};path=/;SameSite=Lax`;
    if (host === 'ngebuild.com' || host.endsWith('.ngebuild.com')) {
      document.cookie = `googtrans=;expires=${expired};path=/;domain=.ngebuild.com;SameSite=Lax`;
    }
  }

  function updateButtons(language) {
    document.querySelectorAll('[data-nge-language]').forEach(button => {
      const active = button.getAttribute('data-nge-language') === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function injectTranslateRoot() {
    if (document.getElementById('nge-google-translate')) return;
    const root = document.createElement('div');
    root.id = 'nge-google-translate';
    root.className = 'nge-google-translate-root notranslate';
    root.setAttribute('aria-hidden', 'true');
    document.body.appendChild(root);
  }

  function ensureEngine() {
    if (window.google?.translate?.TranslateElement) {
      injectTranslateRoot();
      if (!document.querySelector('#nge-google-translate .goog-te-combo')) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'th',
          includedLanguages: 'en,zh-CN',
          autoDisplay: false,
          multilanguagePage: true,
        }, 'nge-google-translate');
      }
      return Promise.resolve();
    }
    if (enginePromise) return enginePromise;
    enginePromise = new Promise((resolve, reject) => {
      injectTranslateRoot();
      window.ngeGoogleTranslateInit = () => {
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'th',
            includedLanguages: 'en,zh-CN',
            autoDisplay: false,
            multilanguagePage: true,
          }, 'nge-google-translate');
          resolve();
        } catch (error) { reject(error); }
      };
      const existing = document.getElementById('nge-google-translate-script');
      if (existing) return;
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
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = language;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    if (attempts < 24) setTimeout(() => applyCombo(language, attempts + 1), 120);
  }

  async function selectLanguage(language) {
    if (!SUPPORTED.includes(language)) return;
    safeStorageSet(language);
    updateButtons(language);
    document.documentElement.lang = language === 'zh-CN' ? 'zh-CN' : language;

    if (language === 'th') {
      clearTranslateCookie();
      window.location.reload();
      return;
    }

    setTranslateCookie(language);
    try {
      await ensureEngine();
      applyCombo(language);
    } catch (error) {
      console.warn('[NGE language]', error);
      window.location.reload();
    }
  }

  function languageMarkup(mobile = false) {
    return `<div class="nge-language-switch${mobile ? ' nge-language-switch--mobile' : ''} notranslate" role="group" aria-label="เลือกภาษา">
      <span class="nge-language-label">${mobile ? 'ภาษา' : 'LANG'}</span>
      <button type="button" data-nge-language="th" lang="th" aria-label="ภาษาไทย">TH</button>
      <button type="button" data-nge-language="en" lang="en" aria-label="English">EN</button>
      <button type="button" data-nge-language="zh-CN" lang="zh-CN" aria-label="简体中文">中文</button>
    </div>`;
  }

  function injectSwitchers() {
    const header = document.querySelector('.site-header');
    if (!header) return false;

    const inner = header.querySelector('.header-inner');
    if (inner && !inner.querySelector('.nge-language-switch:not(.nge-language-switch--mobile)')) {
      const call = inner.querySelector('.header-call');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = languageMarkup(false);
      const switcher = wrapper.firstElementChild;
      if (call) inner.insertBefore(switcher, call);
      else inner.appendChild(switcher);
    }

    const panel = header.querySelector('.mobile-panel');
    if (panel && !panel.querySelector('.nge-language-switch--mobile')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = languageMarkup(true);
      const switcher = wrapper.firstElementChild;
      const actions = panel.querySelector('.mobile-panel-actions');
      if (actions) panel.insertBefore(switcher, actions);
      else panel.appendChild(switcher);
    }

    header.querySelectorAll('.brand, .js-phone-text, .js-phone-secondary-text, .js-line-text').forEach(node => node.classList.add('notranslate'));
    return true;
  }

  function bind() {
    document.addEventListener('click', event => {
      const button = event.target.closest?.('[data-nge-language]');
      if (!button) return;
      event.preventDefault();
      selectLanguage(button.getAttribute('data-nge-language'));
    });
  }

  function init() {
    bind();
    if (!injectSwitchers()) {
      const observer = new MutationObserver(() => {
        if (injectSwitchers()) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 6000);
    }

    const selected = currentLanguage();
    updateButtons(selected);
    document.documentElement.lang = selected === 'zh-CN' ? 'zh-CN' : selected;
    if (selected !== 'th') {
      setTranslateCookie(selected);
      ensureEngine().then(() => applyCombo(selected)).catch(error => console.warn('[NGE language]', error));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
