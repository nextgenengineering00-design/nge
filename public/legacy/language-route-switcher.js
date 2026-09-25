(() => {
  'use strict';

  const FLAGS = {
    th: `<svg viewBox="0 0 36 24" aria-hidden="true" focusable="false"><rect width="36" height="24" fill="#A51931"/><rect y="4" width="36" height="16" fill="#F4F5F8"/><rect y="8" width="36" height="8" fill="#2D2A4A"/></svg>`,
    en: `<svg viewBox="0 0 60 36" aria-hidden="true" focusable="false"><rect width="60" height="36" fill="#012169"/><path d="M0 0 60 36M60 0 0 36" stroke="#fff" stroke-width="8"/><path d="M0 0 60 36M60 0 0 36" stroke="#C8102E" stroke-width="4"/><path d="M30 0v36M0 18h60" stroke="#fff" stroke-width="12"/><path d="M30 0v36M0 18h60" stroke="#C8102E" stroke-width="7"/></svg>`,
    zh: `<svg viewBox="0 0 36 24" aria-hidden="true" focusable="false"><rect width="36" height="24" fill="#DE2910"/><path d="m7 4 1.1 2.2 2.4.35-1.75 1.7.4 2.4L7 9.55l-2.15 1.1.4-2.4L3.5 6.55l2.4-.35zM13 3.2l.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm2.4 3.5.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm-.3 4.4.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15zm-2.8 3.1.45.9 1 .15-.72.7.17 1-.9-.47-.9.47.17-1-.72-.7 1-.15z" fill="#FFDE00"/></svg>`
  };
  const TITLES = { th: 'ภาษาไทย', en: 'English', zh: '简体中文' };

  function localeFromPath(pathname) {
    if (/^\/en(?:\/|$)/.test(pathname)) return 'en';
    if (/^\/zh(?:\/|$)/.test(pathname)) return 'zh';
    return 'th';
  }

  function stripLocale(pathname) {
    return (pathname || '/').replace(/^\/(?:en|zh)(?=\/|$)/, '') || '/';
  }

  function pathFor(locale) {
    const base = stripLocale(location.pathname);
    const prefix = locale === 'th' ? '' : `/${locale}`;
    const pathname = locale === 'th' ? base : (base === '/' ? prefix : `${prefix}${base}`);
    return `${pathname}${location.search}${location.hash}`;
  }

  function markup(mode) {
    const active = localeFromPath(location.pathname);
    return `<div class="nge-language-switch nge-language-switch--${mode}" role="group" aria-label="Language selector">${['th','en','zh'].map(locale => `<a class="nge-language-flag${active === locale ? ' is-active' : ''}" href="${pathFor(locale)}" hreflang="${locale === 'zh' ? 'zh-CN' : locale}" aria-label="${TITLES[locale]}" title="${TITLES[locale]}"${active === locale ? ' aria-current="true"' : ''}><span class="nge-flag-frame">${FLAGS[locale]}</span></a>`).join('')}</div>`;
  }

  function prefetchLocales() {
    ['th','en','zh'].forEach(locale => {
      const href = pathFor(locale);
      if (href === `${location.pathname}${location.search}${location.hash}`) return;
      const key = `nge-prefetch-${locale}`;
      if (document.querySelector(`link[data-nge-prefetch="${key}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      link.dataset.ngePrefetch = key;
      document.head.appendChild(link);
    });
  }

  function inject() {
    const header = document.querySelector('.site-header');
    const inner = header?.querySelector('.header-inner');
    if (!header || !inner) return false;
    header.querySelectorAll('.mobile-panel .nge-language-switch').forEach(node => node.remove());
    if (!inner.querySelector('.nge-language-switch--desktop')) {
      const holder = document.createElement('div');
      holder.innerHTML = markup('desktop');
      const switcher = holder.firstElementChild;
      const call = inner.querySelector('.header-call');
      if (call) inner.insertBefore(switcher, call); else inner.appendChild(switcher);
    }
    if (!inner.querySelector('.nge-language-switch--mobile-header')) {
      const holder = document.createElement('div');
      holder.innerHTML = markup('mobile-header');
      const switcher = holder.firstElementChild;
      const menu = inner.querySelector('.menu-toggle');
      if (menu) inner.insertBefore(switcher, menu); else inner.appendChild(switcher);
    }
    return true;
  }

  function init() {
    prefetchLocales();
    if (inject()) return;
    const observer = new MutationObserver(() => {
      if (!inject()) return;
      observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
