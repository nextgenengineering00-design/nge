(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.NGE_CONFIG || {};
  const consentKey = 'nge-cookie-consent-v2';
  const leadRateKey = 'nge-lead-submit-times';
  const privacyVersion = '2026-08-30';
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }

  function safeJson(value, fallback) {
    try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
  }

  function normalizePhone(value) {
    return String(value || '').replace(/[^0-9+]/g, '');
  }

  function setContactLinks() {
    const phone = normalizePhone(config.phone);
    const phoneDisplay = config.phoneDisplay || config.phone || '098-279-9145';
    const phoneSecondary = normalizePhone(config.phoneSecondary);
    const phoneSecondaryDisplay = config.phoneSecondaryDisplay || config.phoneSecondary || '096-881-4033';
    const lineUrl = String(config.lineUrl || '').trim();
    const lineDisplay = config.lineDisplay || '@522magc';
    const facebookUrl = String(config.facebookUrl || '').trim();
    const facebookReviewsUrl = String(config.facebookReviewsUrl || '').trim();
    const googleBusinessUrl = String(config.googleBusinessUrl || '').trim();

    $$('.js-phone-text').forEach(node => { node.textContent = phoneDisplay; });
    $$('.js-phone-secondary-text').forEach(node => { node.textContent = phoneSecondaryDisplay; });
    $$('.js-line-text').forEach(node => { node.textContent = lineDisplay; });
    $$('.js-phone-link').forEach(link => {
      if (phone) {
        link.href = `tel:${phone}`;
        link.addEventListener('click', () => {
          if (window.gtag) window.gtag('event', 'click_phone', { contact_method: 'phone' });
          if (window.fbq) window.fbq('track', 'Contact', { contact_method: 'phone' });
        });
      }
      else link.addEventListener('click', event => {
        if (link.getAttribute('href') !== '#contact') return;
        showToast('กรุณาตั้งค่าเบอร์โทรจริงในไฟล์ site-config.js');
      });
    });
    $$('.js-phone-secondary-link').forEach(link => {
      if (phoneSecondary) {
        link.href = `tel:${phoneSecondary}`;
        link.addEventListener('click', () => {
          if (window.gtag) window.gtag('event', 'click_phone', { contact_method: 'phone_secondary' });
          if (window.fbq) window.fbq('track', 'Contact', { contact_method: 'phone_secondary' });
        });
      }
    });
    $$('.js-line-link').forEach(link => {
      if (lineUrl) {
        link.href = lineUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', () => {
          if (window.gtag) window.gtag('event', 'click_line', { contact_method: 'line' });
          if (window.fbq) window.fbq('track', 'Contact', { contact_method: 'line' });
        });
      } else link.addEventListener('click', () => showToast('กรุณาตั้งค่า LINE URL จริงในไฟล์ site-config.js'));
    });
    $$('.js-facebook-link').forEach(link => {
      if (facebookUrl) {
        link.href = facebookUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', () => {
          if (window.gtag) window.gtag('event', 'click_facebook', { contact_method: 'facebook' });
          if (window.fbq) window.fbq('track', 'Contact', { contact_method: 'facebook' });
        });
      } else link.href = '/reviews';
    });
    $$('.js-facebook-reviews-link').forEach(link => {
      if (!facebookReviewsUrl) return;
      link.href = facebookReviewsUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', () => {
        if (window.gtag) window.gtag('event', 'click_facebook_reviews');
      });
    });
    $$('.js-google-business-link').forEach(link => {
      if (!googleBusinessUrl) return;
      link.href = googleBusinessUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', () => {
        if (window.gtag) window.gtag('event', 'click_google_business');
      });
    });
  }

  // Header and mobile navigation
  const menuToggle = $('.menu-toggle');
  const mobilePanel = $('#mobilePanel');
  let menuHideTimer;
  let menuOpenFrame;

  function setMenuState(opening) {
    if (!menuToggle || !mobilePanel) return;
    clearTimeout(menuHideTimer);
    cancelAnimationFrame(menuOpenFrame);
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'ปิดเมนู' : 'เปิดเมนู');
    mobilePanel.setAttribute('aria-hidden', String(!opening));
    document.body.classList.toggle('menu-open', opening);

    if (opening) {
      mobilePanel.hidden = false;
      menuOpenFrame = requestAnimationFrame(() => mobilePanel.classList.add('is-open'));
      return;
    }

    mobilePanel.classList.remove('is-open');
    const finishClosing = () => {
      if (menuToggle.getAttribute('aria-expanded') === 'false') mobilePanel.hidden = true;
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishClosing();
    else menuHideTimer = setTimeout(finishClosing, 320);
  }

  function closeMenu() {
    setMenuState(false);
  }
  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenuState(opening);
    });
    $$('a', mobilePanel).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menuToggle.getAttribute('aria-expanded') !== 'true') return;
      closeMenu();
      menuToggle.focus();
    });
    window.addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); });
  }

  // Reveal content without blocking content when IntersectionObserver is unavailable.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -45px', threshold: .08 });
    revealNodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
      observer.observe(node);
    });
  } else revealNodes.forEach(node => node.classList.add('is-visible'));

  // FAQ accordion
  $$('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const opening = !item.classList.contains('open');
      $$('.faq-item').forEach(other => {
        other.classList.remove('open');
        $('button', other).setAttribute('aria-expanded', 'false');
      });
      if (opening) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Back to top
  const backTop = $('.back-top');
  if (backTop) {
    const updateBackTop = () => backTop.classList.toggle('show', scrollY > 650);
    addEventListener('scroll', updateBackTop, { passive: true });
    backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    updateBackTop();
  }

  // Privacy dialog
  const privacyDialog = $('#privacyDialog');
  $$('[data-open-privacy]').forEach(button => button.addEventListener('click', () => {
    if (privacyDialog?.showModal) privacyDialog.showModal();
    else location.href = '/privacy';
  }));
  $$('[data-close-privacy]').forEach(button => button.addEventListener('click', () => privacyDialog?.close()));
  privacyDialog?.addEventListener('click', event => { if (event.target === privacyDialog) privacyDialog.close(); });

  // Cookie consent: only essential storage is active before a choice is made.
  const cookieBanner = $('#cookieBanner');
  let loadedAnalytics = false;
  let loadedMarketing = false;

  function loadAnalytics() {
    if (loadedAnalytics || !config.googleAnalyticsId) return;
    loadedAnalytics = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.googleAnalyticsId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.googleAnalyticsId, { anonymize_ip: true });
  }

  function loadMarketing() {
    if (loadedMarketing || !config.metaPixelId) return;
    loadedMarketing = true;
    /* Meta Pixel loader, executed only after marketing consent. */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
  }

  function applyConsent(consent) {
    if (consent.analytics) loadAnalytics();
    if (consent.marketing) loadMarketing();
  }

  function saveConsent(consent) {
    const record = { necessary: true, analytics: !!consent.analytics, marketing: !!consent.marketing, updatedAt: new Date().toISOString(), version: privacyVersion };
    localStorage.setItem(consentKey, JSON.stringify(record));
    if (cookieBanner) cookieBanner.hidden = true;
    applyConsent(record);
    showToast('ยอมรับการใช้คุกกี้แล้ว');
  }

  const savedConsent = safeJson(localStorage.getItem(consentKey), null);
  if (savedConsent) applyConsent(savedConsent);
  else if (cookieBanner) cookieBanner.hidden = false;
  $('[data-cookie-accept]')?.addEventListener('click', () => saveConsent({ analytics: true, marketing: true }));


  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const phone = href.startsWith('tel:');
    const line = /^(https?:\/\/)(lin\.ee|line\.me)\//.test(href);
    if (phone && link.matches('.js-phone-link, .js-phone-secondary-link')) return;
    if (line && link.matches('.js-line-link')) return;
    if (!phone && !line) return;
    const method = phone ? 'phone' : 'line';
    if (window.gtag) window.gtag('event', phone ? 'click_phone' : 'click_line', { contact_method: method });
    if (window.fbq) window.fbq('track', 'Contact', { contact_method: method });
  });

  // Project lightbox
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCount = $('#lightboxCount');
  let gallery = [];
  let galleryIndex = 0;
  function showLightboxImage() {
    if (!gallery.length || !lightboxImage) return;
    lightboxImage.src = gallery[galleryIndex];
    lightboxCount.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }
  function moveLightbox(amount) {
    galleryIndex = (galleryIndex + amount + gallery.length) % gallery.length;
    showLightboxImage();
  }
  $$('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    gallery = button.dataset.lightbox.split('|').filter(Boolean);
    galleryIndex = 0;
    showLightboxImage();
    lightbox?.showModal();
  }));
  $('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  $('.lightbox-prev')?.addEventListener('click', () => moveLightbox(-1));
  $('.lightbox-next')?.addEventListener('click', () => moveLightbox(1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  addEventListener('keydown', event => {
    if (!lightbox?.open) return;
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });

  // Supabase contact and consultation booking forms
  const leadForms = $$('[data-lead-form], #leadForm');
  function setFormStatus(form, message, type = '') {
    const formStatus = $('.form-status', form) || $('#formStatus');
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`.trim();
  }

  const localToday = new Date();
  const minDate = [localToday.getFullYear(), String(localToday.getMonth() + 1).padStart(2, '0'), String(localToday.getDate()).padStart(2, '0')].join('-');
  $$('[data-min-today]').forEach(input => { input.min = minDate; });

  function canSubmitLead() {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const submissions = safeJson(localStorage.getItem(leadRateKey), []).filter(time => now - time < windowMs);
    if (submissions.length >= 4) return false;
    submissions.push(now);
    localStorage.setItem(leadRateKey, JSON.stringify(submissions));
    return true;
  }

  function campaignData() {
    const params = new URLSearchParams(location.search);
    const referrerHost = (() => { try { return document.referrer ? new URL(document.referrer).hostname : null; } catch { return null; } })();
    return {
      page_path: `${location.pathname}${location.search}`.slice(0, 500),
      referrer_host: referrerHost,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term')
    };
  }

  leadForms.forEach(leadForm => leadForm.addEventListener('submit', async event => {
      event.preventDefault();
      setFormStatus(leadForm, '');
      if (!leadForm.reportValidity()) return;
      const formData = new FormData(leadForm);
      if (formData.get('company_website')) return;
      const cleanPhone = normalizePhone(formData.get('phone'));
      if (!/^(?:\+66|0)[0-9]{8,9}$/.test(cleanPhone)) {
        setFormStatus(leadForm, 'กรุณาตรวจสอบเบอร์โทรให้ถูกต้อง', 'error');
        $('input[name="phone"]', leadForm)?.focus();
        return;
      }
      if (!canSubmitLead()) {
        setFormStatus(leadForm, 'ส่งข้อมูลบ่อยเกินไป กรุณารอประมาณ 10 นาทีแล้วลองใหม่', 'error');
        return;
      }

      const submitButton = $('button[type="submit"]', leadForm);
      const isBooking = leadForm.id === 'bookingForm';
      submitButton.disabled = true;
      setFormStatus(leadForm, isBooking ? 'กำลังจองเวลา…' : 'กำลังส่งข้อมูล…');
      const appointment = [formData.get('preferred_date'), formData.get('preferred_time')].filter(Boolean).join(' ');
      const messageParts = [];
      if (appointment) messageParts.push(`วันและเวลาที่สะดวก: ${appointment}`);
      if (formData.get('message')) messageParts.push(String(formData.get('message')).trim());
      const payload = {
        name: String(formData.get('name') || '').trim(),
        phone: cleanPhone,
        email: String(formData.get('email') || '').trim() || null,
        service: String(formData.get('service') || '').trim(),
        location: String(formData.get('location') || '').trim(),
        budget: String(formData.get('budget') || '').trim() || null,
        message: messageParts.join(' | ') || null,
        privacy_consent: formData.get('privacy_consent') === 'on',
        marketing_consent: formData.get('marketing_consent') === 'on',
        consent_version: privacyVersion,
        website: String(formData.get('company_website') || ''),
        ...campaignData()
      };

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          const requestError = new Error(result.error || `Lead API ${response.status}`);
          requestError.status = response.status;
          throw requestError;
        }
        leadForm.reset();
        $$('[data-min-today]', leadForm).forEach(input => { input.min = minDate; });
        setFormStatus(leadForm, isBooking ? 'รับคำขอจองแล้ว ทีมงานจะโทรกลับเพื่อยืนยันนัดหมาย' : 'ส่งข้อมูลสำเร็จ ทีมงานจะติดต่อกลับโดยเร็วที่สุด', 'success');
        if (window.gtag) window.gtag('event', 'generate_lead', { service: payload.service, form_id: leadForm.id || 'leadForm', lead_type: isBooking ? 'consultation_booking' : 'callback_request' });
        if (window.fbq) window.fbq('track', 'Lead');
      } catch (error) {
        console.error('Lead submission failed:', error);
        setFormStatus(
          leadForm,
          error?.status === 429
            ? 'ส่งข้อมูลครบจำนวนชั่วคราว กรุณารอ 10 นาที หรือติดต่อทางโทรศัพท์/LINE'
            : 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่หรือติดต่อทางโทรศัพท์/LINE',
          'error'
        );
      } finally {
        submitButton.disabled = false;
      }
    }));


  // Projects category filter: simple for customers, shareable for ad/marketing links.
  const projectFilter = $('[data-project-filter]');
  if (projectFilter) {
    const filterButtons = $$('.project-filter-btn', projectFilter);
    const projectCards = $$('[data-project-grid] .project-card[data-category]');
    const emptyState = $('[data-project-empty]');
    const filterStatus = $('#projectFilterStatus');
    const allowedFilters = new Set(['all', ...filterButtons.map(button => button.dataset.filter).filter(Boolean)]);
    const labels = {
      all: 'ทั้งหมด',
      renovation: 'รีโนเวท / ปรับปรุง',
      building: 'ก่อสร้างอาคาร',
      civil: 'งานถนน / งานโยธา',
      house: 'สร้างบ้าน',
      repair: 'ซ่อม / ต่อเติม'
    };

    // Keep category counts in the buttons synced with the actual cards.
    filterButtons.forEach(button => {
      const badge = $('span', button);
      if (!badge) return;
      const filter = button.dataset.filter;
      badge.textContent = String(filter === 'all' ? projectCards.length : projectCards.filter(card => card.dataset.category === filter).length);
    });

    function applyProjectFilter(filter, updateUrl = true) {
      const activeFilter = allowedFilters.has(filter) ? filter : 'all';
      let visibleCount = 0;
      projectCards.forEach(card => {
        const visible = activeFilter === 'all' || card.dataset.category === activeFilter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
      if (emptyState) emptyState.hidden = visibleCount !== 0;
      if (filterStatus) {
        filterStatus.textContent = activeFilter === 'all'
          ? `แสดงทั้งหมด ${visibleCount} โครงการ`
          : `หมวด ${labels[activeFilter]} • ${visibleCount} โครงการ`;
      }
      if (updateUrl) {
        const url = new URL(location.href);
        if (activeFilter === 'all') url.searchParams.delete('category');
        else url.searchParams.set('category', activeFilter);
        history.replaceState({ projectCategory: activeFilter }, '', `${url.pathname}${url.search}${url.hash}`);
      }
      if (window.gtag) window.gtag('event', 'project_category_filter', { category: activeFilter, result_count: visibleCount });
    }

    filterButtons.forEach(button => button.addEventListener('click', () => applyProjectFilter(button.dataset.filter)));
    applyProjectFilter(new URLSearchParams(location.search).get('category') || 'all', false);
  }

  // Homepage project story slider: autoplay every 4 seconds, controls and swipe.
  $$('[data-story-slider]').forEach(slider => {
    const track = $('.story-slider-track', slider);
    const slides = $$('.story-slide', slider);
    const dotsHost = $('.story-slider-dots', slider);
    const previous = $('.story-slider-prev', slider);
    const next = $('.story-slider-next', slider);
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = 0;
    let timer = null;
    let pointerStart = null;

    const dots = slides.map((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `${index + 1} จาก ${slides.length}`);
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `ดูภาพที่ ${index + 1}`);
      button.addEventListener('click', () => show(index));
      dotsHost?.appendChild(button);
      return button;
    });

    function pause() {
      clearTimeout(timer);
      timer = null;
      slider.classList.remove('is-running');
    }

    function schedule() {
      pause();
      if (reduceMotion || document.hidden) return;
      void slider.offsetWidth;
      slider.classList.add('is-running');
      timer = setTimeout(() => show(active + 1), 4000);
    }

    function show(index) {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translateX(${-active * 100}%)`;
      slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== active)));
      dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === active)));
      schedule();
    }

    previous?.addEventListener('click', () => show(active - 1));
    next?.addEventListener('click', () => show(active + 1));
    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', schedule);
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', event => { if (!slider.contains(event.relatedTarget)) schedule(); });
    slider.addEventListener('pointerdown', event => { pointerStart = event.clientX; });
    slider.addEventListener('pointerup', event => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 45) show(active + (distance < 0 ? 1 : -1));
    });
    addEventListener('visibilitychange', () => document.hidden ? pause() : schedule());
    show(0);
  });

  setContactLinks();
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
