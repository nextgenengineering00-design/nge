(() => {
  'use strict';
  if (window.NGE_ANALYTICS) { window.NGE_ANALYTICS.page(); return; }
  const config = window.NGE_CONFIG || {};
  const consentKey = 'nge-cookie-consent-v2';
  let consent = {}, loaded = false, lastPage = '';
  const privatePage = () => !/^(?:www\.)?ngebuild\.com$/.test(new URL(location.origin).hostname) || /^\/(?:crm|ai-agent|ai-marketing|api)(?:\/|$)/.test(location.pathname);
  const allowed = new Set(['contact_method','service','form_id','lead_type','photo_count','utm_source','utm_medium','utm_campaign','utm_content','utm_term','request_type','category','result_count','cta_source','form_source']);
  const clean = value => String(value ?? '').replace(/[<>@]/g, '').slice(0, 120);
  function readConsent() { try { consent = JSON.parse(localStorage.getItem(consentKey)) || {}; } catch { consent = {}; } }
  function locationForAnalytics() {
    const url = new URL(location.origin + location.pathname);
    const params = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value = params.get(key);
      if (value && /^[\p{L}\p{N} _.-]{1,120}$/u.test(value)) url.searchParams.set(key, value);
    }
    return url.href;
  }
  function load() {
    if (loaded || privatePage() || !consent.analytics || !/^G-[A-Z0-9]+$/.test(config.googleAnalyticsId || '')) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.googleAnalyticsId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    if (!document.querySelector('script[data-nge-analytics]')) {
      const script = document.createElement('script');
      script.async = true; script.dataset.ngeAnalytics = 'true';
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.googleAnalyticsId);
      document.head.appendChild(script);
    }
  }
  function track(name, params = {}) {
    readConsent();
    if (!consent.analytics || privatePage()) return;
    load();
    if (!window.gtag) return;
    const safe = { page_path: location.pathname, page_location: locationForAnalytics() };
    for (const [key, value] of Object.entries(params)) {
      const mapped = key === 'source' ? 'cta_source' : key;
      if (allowed.has(mapped)) safe[mapped] = typeof value === 'number' ? value : clean(value);
    }
    window.gtag('event', name, safe);
  }
  function page() {
    readConsent(); load();
    const banner = document.querySelector('#cookieBanner');
    if (banner) banner.hidden = !!consent.necessary;
    if (!consent.analytics || privatePage() || !window.gtag || lastPage === location.pathname) return;
    lastPage = location.pathname;
    let referrer = '';
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch {}
    window.gtag('event', 'page_view', { page_title: document.title, page_location: locationForAnalytics(), page_path: location.pathname, page_referrer: referrer });
  }
  function choose(analytics) {
    try { localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics, marketing: false, updatedAt: new Date().toISOString(), version: '2026-10-17' })); } catch {}
    const banner = document.querySelector('#cookieBanner');
    if (banner) banner.hidden = true;
    page();
  }
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-cookie-accept]')) { choose(true); return; }
    if (event.target.closest?.('[data-cookie-essential]')) { choose(false); return; }
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (/^tel:/i.test(href)) track('click_phone', { contact_method: link.classList.contains('js-phone-secondary-link') ? 'phone_secondary' : 'phone' });
    else if (/^https?:\/\/(?:lin\.ee|line\.me)\//i.test(href)) track('click_line', { contact_method: 'line' });
    else if (/^mailto:/i.test(href)) track('click_email', { contact_method: 'email' });
    else if (/google\.(?:com|co\.th)\/maps|maps\.app\.goo\.gl/i.test(href)) track('click_map', { contact_method: 'map' });
    else if (/facebook\.com\/.+\/reviews/i.test(href)) track('click_facebook_reviews');
    else if (/facebook\.com\//i.test(href)) track('click_facebook', { contact_method: 'facebook' });
    if (/NGE-Company-Profile\.pdf/i.test(href)) track('company_profile_download');
    if (/^\/projects(?:\/|$)/.test(href)) track('project_click');
    if (link.matches('.js-estimate-link,[data-estimate-source],.mobile-estimate-link')) {
      const source = link.dataset.estimateSource || link.closest('[data-estimate-cta]')?.dataset.estimateCta || 'website';
      track('photo_estimate_cta', { cta_source: source });
      track('request_survey', { cta_source: source, request_type: 'photo_estimate' });
    }
  });
  window.addEventListener('storage', event => { if (event.key === consentKey) { lastPage = ''; page(); } });
  window.NGE_ANALYTICS = { track, page };
  readConsent(); page();
})();
