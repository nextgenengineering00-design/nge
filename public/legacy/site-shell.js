(() => {
  'use strict';

  const icons = `
    <svg class="svg-sprite" aria-hidden="true">
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"/></symbol>
      <symbol id="i-line" viewBox="0 0 24 24"><path d="M21 10.7c0-4-4-7.2-9-7.2s-9 3.2-9 7.2c0 3.6 3.2 6.6 7.5 7.1.3.07.7.22.8.5.1.27.07.7.03.97l-.16.92c-.05.27-.22 1.06.78.58 1-.48 5.43-3.2 7.4-5.48A6.4 6.4 0 0 0 21 10.7Z"/></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="m8 4 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 20h16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2 4.5 5v5.2c0 5 3.1 9.6 7.5 11.3 4.4-1.7 7.5-6.3 7.5-11.3V5z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m8.5 11.5 2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
      <symbol id="i-plan" viewBox="0 0 24 24"><path d="M4 3h16v18H4zM8 3v5h8V3M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.7"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5"/></symbol>
      <symbol id="i-engineer" viewBox="0 0 24 24"><path d="M4 11a8 8 0 0 1 16 0M3 11h18v3H3zM8 11V7m8 4V7M7 20v-2c0-2 2.2-3 5-3s5 1 5 3v2" fill="none" stroke="currentColor" stroke-width="1.7"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9z"/></symbol>
    </svg>`;

  function currentLocale() {
    if (/^\/en(?:\/|$)/.test(location.pathname)) return 'en';
    if (/^\/zh(?:\/|$)/.test(location.pathname)) return 'zh';
    return 'th';
  }

  const shellCopy = {
    th: {
      utility: 'ทีมวิศวกรก่อสร้าง • จดทะเบียน พ.ศ. 2528 • ภาครัฐและเอกชน', faq: 'ถาม–ตอบ', consult: 'นัดหมายปรึกษาฟรี',
      home: 'หน้าหลัก', about: 'ประวัติบริษัท', services: 'บริการ', projects: 'ผลงาน', knowledge: 'ความรู้', contact: 'ติดต่อเรา', faqFull: 'คำถามที่พบบ่อย',
      team: 'คุยกับทีมงาน', openMenu: 'เปิดเมนู', phone: 'โทร',
      footerTitle: 'คุยกันให้ชัด<br>ก่อนเริ่มทุกหน้างาน', footerText: 'ต่อยอดประสบการณ์งานภาครัฐกว่า 40 ปี สู่บ้าน อาคาร ต่อเติม รีโนเวท งานโยธา และงานระบบ โดยทีมวิศวกร',
      under: 'ดำเนินการภายใต้', knowMore: 'รู้จักเรามากขึ้น', menu: 'เมนู', allServices: 'บริการทั้งหมด', constructionKnowledge: 'ความรู้ก่อสร้าง',
      near: 'บริการใกล้คุณ', renovationNear: 'รีโนเวทใกล้ฉัน', buildNear: 'สร้างบ้านใกล้ฉัน', builtinNear: 'บิวท์อินใกล้ฉัน', contractorNear: 'รับเหมาใกล้ฉัน', sendContact: 'ส่งข้อมูลติดต่อ',
      contactTeam: 'ติดต่อทีมงาน', phone1: 'โทรศัพท์ 1', phone2: 'โทรศัพท์ 2', openMap: 'เปิดแผนที่ Google', privacy: 'นโยบายความเป็นส่วนตัว',
      callNow: 'โทรเลย', book: 'จองคิว', backTop: 'กลับด้านบน', cookieTitle: 'เว็บไซต์นี้ใช้คุกกี้', cookieText: 'เราใช้คุกกี้เพื่อให้เว็บไซต์ทำงานและวัดผลการใช้งาน อ่าน', accept: 'ยอมรับทั้งหมด', legalCompany: 'ห้างหุ้นส่วนจำกัด รวมพลชัย เอ็นจิเนียริ่ง', address: '98/72 หมู่บ้านกฤษดาลากูน นนทบุรี 11130'
    },
    en: {
      utility: 'Construction engineering team • Registered since 1985 • Public & private projects', faq: 'FAQ', consult: 'Free consultation',
      home: 'Home', about: 'Company', services: 'Services', projects: 'Projects', knowledge: 'Knowledge', contact: 'Contact', faqFull: 'FAQ',
      team: 'Talk to our team', openMenu: 'Open menu', phone: 'Call',
      footerTitle: 'Clear scope.<br>Confident construction.', footerText: 'Building on more than 40 years of public-sector project experience across homes, buildings, extensions, renovation, civil works and MEP.',
      under: 'Operated by', knowMore: 'Learn more about us', menu: 'Menu', allServices: 'All services', constructionKnowledge: 'Construction knowledge',
      near: 'Services near you', renovationNear: 'Renovation near me', buildNear: 'Build a home near me', builtinNear: 'Built-in near me', contractorNear: 'Contractor near me', sendContact: 'Send project details',
      contactTeam: 'Contact our team', phone1: 'Phone 1', phone2: 'Phone 2', openMap: 'Open Google Maps', privacy: 'Privacy policy',
      callNow: 'Call', book: 'Book', backTop: 'Back to top', cookieTitle: 'This website uses cookies', cookieText: 'We use cookies to operate the website and measure usage. Read our', accept: 'Accept all', legalCompany: 'Ruampolchai Engineering Limited Partnership', address: '98/72 Krisda Lagoon Village, Nonthaburi 11130, Thailand'
    },
    zh: {
      utility: '建筑工程团队 • 1985年注册成立 • 公共和私人项目', faq: '常见问题', consult: '免费咨询',
      home: '首页', about: '公司简介', services: '服务', projects: '项目案例', knowledge: '建筑知识', contact: '联系我们', faqFull: '常见问题',
      team: '联系团队', openMenu: '打开菜单', phone: '电话',
      footerTitle: '先明确范围<br>再安心施工', footerText: '以40多年公共工程经验为基础，提供住宅、建筑、扩建、翻新、土木及机电工程服务。',
      under: '运营主体', knowMore: '了解更多', menu: '菜单', allServices: '全部服务', constructionKnowledge: '建筑知识',
      near: '附近服务', renovationNear: '附近翻新', buildNear: '附近建房', builtinNear: '附近定制装修', contractorNear: '附近承包商', sendContact: '提交项目资料',
      contactTeam: '联系团队', phone1: '电话 1', phone2: '电话 2', openMap: '打开 Google 地图', privacy: '隐私政策',
      callNow: '立即致电', book: '预约', backTop: '返回顶部', cookieTitle: '本网站使用 Cookie', cookieText: '我们使用 Cookie 以确保网站运行并分析使用情况。请阅读', accept: '全部接受', legalCompany: 'Ruampolchai Engineering Limited Partnership（รวมพลชัย เอ็นจิเนียริ่ง）', address: '泰国暖武里府 Krisda Lagoon Village 98/72，邮编 11130'
    }
  };

  function internalPath(href) {
    const locale = currentLocale();
    if (locale === 'th' || !href.startsWith('/') || href.startsWith('//')) return href;
    const prefix = `/${locale}`;
    if (href === '/') return prefix;
    return `${prefix}${href}`;
  }

  class NGEHeader extends HTMLElement {
    connectedCallback() {
      const current = document.querySelector('[data-legacy-page]')?.dataset.legacyPage || 'home';
      const locale = currentLocale();
      const c = shellCopy[locale];
      this.innerHTML = `${icons}
        <header class="site-header" id="top">
          <div class="header-utility"><div><span>${c.utility}</span><span class="header-utility-links"><a href="${internalPath('/faq')}">${c.faq}</a><a href="${internalPath('/contact')}">${c.consult}</a></span></div></div>
          <div class="header-inner">
            <a class="brand" href="${internalPath('/')}" aria-label="NEXT GEN ENGINEERING ${c.home}"><img src="/assets/nge-9b58beeb765ab627-fast.webp" alt="" width="320" height="320"><span><b>NEXT GEN</b><small>ENGINEERING</small></span></a>
            <nav class="desktop-nav" aria-label="${c.menu}">
              <a data-nav="home" href="${internalPath('/')}">${c.home}</a><a data-nav="about" href="${internalPath('/about')}">${c.about}</a><a data-nav="services" href="${internalPath('/services')}">${c.services}</a><a data-nav="projects" href="${internalPath('/projects')}">${c.projects}</a><a data-nav="knowledge" href="${internalPath('/knowledge')}">${c.knowledge}</a><a data-nav="contact" href="${internalPath('/contact')}">${c.contact}</a>
            </nav>
            <a class="header-call js-phone-link" href="${internalPath('/contact')}" aria-label="${c.team}"><svg><use href="#i-phone"/></svg><span><small>${c.team}</small><b class="js-phone-text">098-279-9145</b></span></a>
            <button class="menu-toggle" type="button" aria-label="${c.openMenu}" aria-controls="mobilePanel" aria-expanded="false"><span class="menu-toggle-lines" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-toggle-label">${locale === 'zh' ? '菜单' : 'MENU'}</span></button>
          </div>
          <div class="mobile-panel" id="mobilePanel" aria-hidden="true" hidden><nav aria-label="${c.menu}"><a data-nav="home" href="${internalPath('/')}">${c.home}</a><a data-nav="about" href="${internalPath('/about')}">${c.about}</a><a data-nav="services" href="${internalPath('/services')}">${c.services}</a><a data-nav="projects" href="${internalPath('/projects')}">${c.projects}</a><a data-nav="knowledge" href="${internalPath('/knowledge')}">${c.knowledge}</a><a data-nav="faq" href="${internalPath('/faq')}">${c.faqFull}</a><a data-nav="contact" href="${internalPath('/contact')}">${c.contact}</a></nav><div class="mobile-panel-actions"><a class="btn btn-dark js-phone-link" href="${internalPath('/contact')}">${c.phone} <span class="js-phone-text">098-279-9145</span></a><a class="btn btn-dark js-phone-secondary-link" href="${internalPath('/contact')}">${c.phone} <span class="js-phone-secondary-text">096-881-4033</span></a><a class="btn btn-line js-line-link" href="${internalPath('/contact')}">LINE: <span class="js-line-text">@522magc</span></a></div></div>
        </header>`;
      this.querySelector(`[data-nav="${current}"]`)?.setAttribute('aria-current', 'page');
    }
  }

  class NGEFooter extends HTMLElement {
    connectedCallback() {
      const locale = currentLocale();
      const c = shellCopy[locale];
      this.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-grid">
            <div class="footer-brand footer-brand-light"><span class="footer-logo-disc"><img src="/assets/nge-9b58beeb765ab627-fast.webp" alt="Next Gen Engineering" width="320" height="320"></span></div>
            <div class="footer-about"><span>NEXT GEN ENGINEERING</span><h2>${c.footerTitle}</h2><p>${c.footerText}</p><p class="legal-company">${c.under}<br><b><a href="https://www.dataforthai.com/company/0103528028423/" target="_blank" rel="noopener noreferrer">${c.legalCompany}</a></b></p><a class="footer-profile-link" href="${internalPath('/about')}">${c.knowMore}</a></div>
            <div class="footer-links"><h3>${c.menu}</h3><a href="${internalPath('/about')}">${c.about}</a><a href="${internalPath('/services')}">${c.allServices}</a><a href="${internalPath('/projects')}">${c.projects}</a><a href="${internalPath('/knowledge')}">${c.constructionKnowledge}</a></div>
            <div class="footer-links"><h3>${c.near}</h3><a href="${internalPath('/renovation-near-me')}">${c.renovationNear}</a><a href="${internalPath('/build-house-near-me')}">${c.buildNear}</a><a href="${internalPath('/built-in-near-me')}">${c.builtinNear}</a><a href="${internalPath('/construction-near-me')}">${c.contractorNear}</a><a href="${internalPath('/contact')}">${c.sendContact}</a></div>
            <div class="footer-contact"><h3>${c.contactTeam}</h3><a class="js-phone-link" href="${internalPath('/contact')}"><small>${c.phone1}</small><b class="js-phone-text">098-279-9145</b></a><a class="js-phone-secondary-link" href="${internalPath('/contact')}"><small>${c.phone2}</small><b class="js-phone-secondary-text">096-881-4033</b></a><a class="js-line-link" href="${internalPath('/contact')}"><small>LINE Official</small><b class="js-line-text">@522magc</b></a><p><strong>${c.legalCompany}</strong><br>${c.address}<br><a class="footer-map-link" href="https://maps.app.goo.gl/jKKSr42Ax6v7HqWRA" target="_blank" rel="noopener noreferrer">${c.openMap}</a></p></div>
          </div>
          <div class="container footer-bottom"><p>© <span id="year"></span> Next Gen Engineering. All rights reserved.</p><div class="footer-bottom-meta"><span class="footer-license">ภย. 60575</span><a href="${internalPath('/privacy')}">${c.privacy}</a></div></div>
        </footer>
        <div class="floating-actions"><a class="float-line js-line-link" href="${internalPath('/contact')}" aria-label="LINE"><svg><use href="#i-line"/></svg></a><a class="float-phone js-phone-link" href="${internalPath('/contact')}" aria-label="${c.phone}"><svg><use href="#i-phone"/></svg></a></div>
        <nav class="mobile-dock" aria-label="${c.contactTeam}"><a class="js-phone-link" href="${internalPath('/contact')}" aria-label="${c.phone}"><span class="mobile-dock-icon"><svg><use href="#i-phone"/></svg></span><span class="mobile-dock-label">${c.callNow}</span></a><a class="js-line-link" href="${internalPath('/contact')}" aria-label="LINE"><span class="mobile-dock-icon"><svg><use href="#i-line"/></svg></span><span class="mobile-dock-label">LINE</span></a><a class="mobile-dock-book" href="${internalPath('/#booking')}" aria-label="${c.book}"><span class="mobile-dock-icon"><svg><use href="#i-clock"/></svg></span><span class="mobile-dock-label">${c.book}</span></a></nav>
        <button class="back-top" type="button" aria-label="${c.backTop}">↑</button><div class="toast" id="toast" role="status" aria-live="polite"></div>
        <section class="cookie-banner cookie-simple" id="cookieBanner" role="dialog" aria-modal="false" aria-labelledby="cookieTitle" hidden><div class="cookie-icon" aria-hidden="true">🍪</div><div><h2 id="cookieTitle">${c.cookieTitle}</h2><p>${c.cookieText} <a href="${internalPath('/privacy')}">${c.privacy}</a></p><div class="cookie-actions"><button type="button" class="cookie-accept" data-cookie-accept>${c.accept}</button></div></div></section>`;
    }
  }

  if (!customElements.get('nge-header')) customElements.define('nge-header', NGEHeader);
  if (!customElements.get('nge-footer')) customElements.define('nge-footer', NGEFooter);
})();
