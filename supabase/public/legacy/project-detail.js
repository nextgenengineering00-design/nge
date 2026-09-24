(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.NGE_CONFIG || {};
  const phone = String(config.phone || '0982799145').replace(/[^0-9+]/g, '');
  const phoneDisplay = config.phoneDisplay || '098-279-9145';
  const lineUrl = config.lineUrl || 'https://lin.ee/u45yvnc';
  const lineDisplay = config.lineDisplay || '@522magc';

  const iconPhone = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"/></svg>';
  const iconLine = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10.7c0-4-4-7.2-9-7.2s-9 3.2-9 7.2c0 3.6 3.2 6.6 7.5 7.1.3.07.7.22.8.5.1.27.07.7.03.97l-.16.92c-.05.27-.22 1.06.78.58 1-.48 5.43-3.2 7.4-5.48A6.4 6.4 0 0 0 21 10.7Z"/></svg>';
  const iconClock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  const main = $('#project-content');
  if (main && !$('.project-mobile-back')) {
    const back = document.createElement('a');
    back.className = 'project-mobile-back';
    back.href = '/projects';
    back.setAttribute('aria-label', 'กลับไปหน้าผลงาน');
    back.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>กลับหน้าผลงาน</span>';
    main.prepend(back);
  }

  const mobileDock = $('.mobile-dock');
  const dockLinks = mobileDock ? $$('a', mobileDock) : [];
  if (dockLinks[0]) {
    dockLinks[0].setAttribute('aria-label', 'โทรหา Next Gen Engineering');
    dockLinks[0].innerHTML = `${iconPhone}<span>โทรเลย</span>`;
  }
  if (dockLinks[1]) {
    dockLinks[1].setAttribute('aria-label', 'ติดต่อทาง LINE');
    dockLinks[1].innerHTML = `${iconLine}<span>LINE</span>`;
  }
  if (dockLinks[2]) {
    dockLinks[2].href = '/#booking';
    dockLinks[2].setAttribute('aria-label', 'จองคิวปรึกษา');
    dockLinks[2].innerHTML = `${iconClock}<span>จองคิว</span>`;
  }

  $$('.js-phone-text').forEach(node => node.textContent = phoneDisplay);
  $$('.js-line-text').forEach(node => node.textContent = lineDisplay);
  $$('.js-phone-link').forEach(link => link.href = `tel:${phone}`);
  $$('.js-line-link').forEach(link => { link.href = lineUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; });
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = $('.menu-toggle');
  const panel = $('#mobilePanel');
  function closeMenu() {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'เปิดเมนู');
    panel.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setTimeout(() => {
      if (!panel.classList.contains('is-open')) panel.hidden = true;
    }, 280);
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (!open) {
      closeMenu();
      return;
    }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'ปิดเมนู');
    panel.hidden = false;
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => panel.classList.add('is-open'));
  });
  $$('a', panel || document).forEach(link => link.addEventListener('click', closeMenu));

  const cookieBanner = $('#cookieBanner');
  const consentKey = 'nge-cookie-consent-v2';
  let hasConsent = false;
  try { hasConsent = !!JSON.parse(localStorage.getItem(consentKey)); } catch (_) {}
  if (cookieBanner && !hasConsent) cookieBanner.hidden = false;
  $('[data-cookie-accept]')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics: true, marketing: true, updatedAt: new Date().toISOString(), version: '2026-08-30' }));
    cookieBanner.hidden = true;
  });

  const reveal = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -35px', threshold: .06 });
    reveal.forEach(node => observer.observe(node));
  } else reveal.forEach(node => node.classList.add('is-visible'));

  const dialog = $('#projectLightbox');
  const image = $('#projectLightboxImage');
  const count = $('#projectLightboxCount');
  const items = $$('.gallery-item');
  let current = 0;
  function render() {
    const item = items[current];
    if (!item || !image) return;
    image.src = item.dataset.full || $('img', item).src;
    image.alt = $('img', item).alt;
    image.className = item.dataset.rotation ? `rotate-${item.dataset.rotation}` : '';
    count.textContent = `${current + 1} / ${items.length}`;
  }
  function move(step) { current = (current + step + items.length) % items.length; render(); }
  items.forEach((item, index) => item.addEventListener('click', () => { current = index; render(); dialog?.showModal(); }));
  $('.detail-lightbox-close')?.addEventListener('click', () => dialog?.close());
  $('.detail-lightbox-prev')?.addEventListener('click', () => move(-1));
  $('.detail-lightbox-next')?.addEventListener('click', () => move(1));
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog?.addEventListener('cancel', event => { event.preventDefault(); dialog.close(); });
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
    if (!dialog?.open) return;
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });

})();
