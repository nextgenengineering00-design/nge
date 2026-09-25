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

  class NGEHeader extends HTMLElement {
    connectedCallback() {
      const current = document.querySelector('[data-legacy-page]')?.dataset.legacyPage || 'home';
      this.innerHTML = `${icons}
        <header class="site-header" id="top">
          <div class="header-utility"><div><span>ทีมวิศวกรก่อสร้าง • จดทะเบียน พ.ศ. 2528 • ภาครัฐและเอกชน</span><span class="header-utility-links"><a href="/faq">ถาม–ตอบ</a><a href="/contact">นัดหมายปรึกษาฟรี</a></span></div></div>
          <div class="header-inner">
            <a class="brand" href="/" aria-label="NEXT GEN ENGINEERING หน้าหลัก"><img src="/assets/nge-9b58beeb765ab627-fast.webp" alt="" width="320" height="320"><span><b>NEXT GEN</b><small>ENGINEERING</small></span></a>
            <nav class="desktop-nav" aria-label="เมนูหลัก">
              <a data-nav="home" href="/">หน้าหลัก</a><a data-nav="about" href="/about">ประวัติบริษัท</a><a data-nav="services" href="/services">บริการ</a><a data-nav="why" href="/why-us">จุดเด่น</a><a data-nav="projects" href="/projects">ผลงาน</a><a data-nav="knowledge" href="/knowledge">ความรู้</a><a data-nav="contact" href="/contact">ติดต่อเรา</a>
            </nav>
            <a class="header-call js-phone-link" href="/contact" aria-label="โทรหา Next Gen Engineering"><svg><use href="#i-phone"/></svg><span><small>คุยกับทีมงาน</small><b class="js-phone-text">098-279-9145</b></span></a>
            <button class="menu-toggle" type="button" aria-label="เปิดเมนู" aria-controls="mobilePanel" aria-expanded="false"><i></i><i></i><i></i></button>
          </div>
          <div class="mobile-panel" id="mobilePanel" aria-hidden="true" hidden><nav aria-label="เมนูมือถือ"><a href="/">หน้าหลัก</a><a href="/about">ประวัติบริษัท</a><a href="/services">บริการ</a><a href="/why-us">จุดเด่น</a><a href="/projects">ผลงาน</a><a href="/knowledge">ความรู้</a><a href="/faq">คำถามที่พบบ่อย</a><a href="/contact">ติดต่อเรา</a></nav><div class="mobile-panel-actions"><a class="btn btn-dark js-phone-link" href="/contact">โทร <span class="js-phone-text">098-279-9145</span></a><a class="btn btn-dark js-phone-secondary-link" href="/contact">โทร <span class="js-phone-secondary-text">096-881-4033</span></a><a class="btn btn-line js-line-link" href="/contact">LINE: <span class="js-line-text">@522magc</span></a></div></div>
        </header>`;
      this.querySelector(`[data-nav="${current}"]`)?.setAttribute('aria-current', 'page');
    }
  }

  class NGEFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-grid">
            <div class="footer-brand footer-brand-light"><span class="footer-logo-disc"><img src="/assets/nge-9b58beeb765ab627-fast.webp" alt="Next Gen Engineering" width="320" height="320"></span></div>
            <div class="footer-about"><span>NEXT GEN ENGINEERING</span><h2>คุยกันให้ชัด<br>ก่อนเริ่มทุกหน้างาน</h2><p>ต่อยอดประสบการณ์งานภาครัฐกว่า 40 ปี สู่บ้าน อาคาร ต่อเติม รีโนเวท งานโยธา และงานระบบ โดยทีมวิศวกร</p><p class="legal-company">ดำเนินการภายใต้<br><b><a href="https://www.dataforthai.com/company/0103528028423/" target="_blank" rel="noopener noreferrer">ห้างหุ้นส่วนจำกัด รวมพลชัย เอ็นจิเนียริ่ง</a></b></p><a class="footer-profile-link" href="/about">รู้จักเรามากขึ้น</a></div>
            <div class="footer-links"><h3>เมนู</h3><a href="/about">ประวัติบริษัท</a><a href="/services">บริการทั้งหมด</a><a href="/why-us">มาตรฐานการทำงาน</a><a href="/projects">ผลงาน</a><a href="/knowledge">ความรู้ก่อสร้าง</a></div>
            <div class="footer-links"><h3>บริการใกล้คุณ</h3><a href="/renovation-near-me">รีโนเวทใกล้ฉัน</a><a href="/build-house-near-me">สร้างบ้านใกล้ฉัน</a><a href="/built-in-near-me">บิวท์อินใกล้ฉัน</a><a href="/construction-near-me">รับเหมาใกล้ฉัน</a><a href="/contact">ส่งข้อมูลติดต่อ</a></div>
            <div class="footer-contact"><h3>ติดต่อทีมงาน</h3><a class="js-phone-link" href="/contact"><small>โทรศัพท์ 1</small><b class="js-phone-text">098-279-9145</b></a><a class="js-phone-secondary-link" href="/contact"><small>โทรศัพท์ 2</small><b class="js-phone-secondary-text">096-881-4033</b></a><a class="js-line-link" href="/contact"><small>LINE Official</small><b class="js-line-text">@522magc</b></a><p><strong>หจก. รวมพลชัย เอ็นจิเนียริ่ง</strong><br>98/72 หมู่บ้านกฤษดาลากูน นนทบุรี 11130<br><a class="footer-map-link" href="https://maps.app.goo.gl/jKKSr42Ax6v7HqWRA" target="_blank" rel="noopener noreferrer">เปิดแผนที่ Google</a></p></div>
          </div>
          <div class="container footer-bottom"><p>© <span id="year"></span> Next Gen Engineering. All rights reserved.</p><div class="footer-bottom-meta"><span class="footer-license">เลข ภย. 60575</span><a href="/privacy">นโยบายความเป็นส่วนตัว</a></div></div>
        </footer>
        <div class="floating-actions"><a class="float-line js-line-link" href="/contact" aria-label="ติดต่อผ่าน LINE"><svg><use href="#i-line"/></svg></a><a class="float-phone js-phone-link" href="/contact" aria-label="โทรหาเรา"><svg><use href="#i-phone"/></svg></a></div>
        <nav class="mobile-dock" aria-label="ติดต่อด่วนบนมือถือ"><a class="js-phone-link" href="/contact" aria-label="โทรหา Next Gen Engineering"><span class="mobile-dock-icon"><svg><use href="#i-phone"/></svg></span><span class="mobile-dock-label">โทรเลย</span></a><a class="js-line-link" href="/contact" aria-label="ติดต่อ Next Gen Engineering ผ่าน LINE"><span class="mobile-dock-icon"><svg><use href="#i-line"/></svg></span><span class="mobile-dock-label">LINE</span></a><a class="mobile-dock-book" href="/#booking" aria-label="จองคิวประเมินหน้างาน"><span class="mobile-dock-icon"><svg><use href="#i-clock"/></svg></span><span class="mobile-dock-label">จองคิว</span></a></nav>
        <button class="back-top" type="button" aria-label="กลับด้านบน">↑</button><div class="toast" id="toast" role="status" aria-live="polite"></div>
        <section class="cookie-banner cookie-simple" id="cookieBanner" role="dialog" aria-modal="false" aria-labelledby="cookieTitle" hidden><div class="cookie-icon" aria-hidden="true">🍪</div><div><h2 id="cookieTitle">เว็บไซต์นี้ใช้คุกกี้</h2><p>เราใช้คุกกี้เพื่อให้เว็บไซต์ทำงานและวัดผลการใช้งาน อ่าน <a href="/privacy">นโยบายความเป็นส่วนตัว</a></p><div class="cookie-actions"><button type="button" class="cookie-accept" data-cookie-accept>ยอมรับทั้งหมด</button></div></div></section>`;
    }
  }

  if (!customElements.get('nge-header')) customElements.define('nge-header', NGEHeader);
  if (!customElements.get('nge-footer')) customElements.define('nge-footer', NGEFooter);
})();
