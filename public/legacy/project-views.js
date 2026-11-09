(() => {
  'use strict';
  if (window.__NGE_PROJECT_VIEWS__) return;
  window.__NGE_PROJECT_VIEWS__ = true;

  const number = new Intl.NumberFormat('th-TH');
  const slugFromHref = href => {
    try { return new URL(href, location.origin).pathname.match(/^\/projects\/([a-z0-9-]+)\/?$/)?.[1] || ''; }
    catch { return ''; }
  };
  const read = async (slug, increment = false) => {
    const response = await fetch(`/api/project-views?slug=${encodeURIComponent(slug)}${increment ? '&increment=1' : ''}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('view_count_unavailable');
    const data = await response.json();
    return Number.isFinite(data.value) ? data.value : 0;
  };
  const badge = (slug, extraClass = '') => {
    const el = document.createElement('span');
    el.className = `project-view-count ${extraClass}`.trim();
    el.dataset.projectView = slug;
    el.innerHTML = '<img src="/assets/google-material-icons/visibility.png" alt="" width="18" height="18"><span aria-label="ยอดเข้าชม">0</span>';
    return el;
  };

  const cards = [...document.querySelectorAll('.project-card')];
  const entries = new Map();
  cards.forEach(card => {
    const link = card.querySelector('a[href*="/projects/"]');
    const slug = slugFromHref(link?.getAttribute('href') || '');
    const body = card.querySelector('.project-body');
    if (!slug || !body || body.querySelector('[data-project-view]')) return;
    const el = badge(slug);
    const detailLink = body.querySelector(':scope > a:last-child');
    detailLink ? body.insertBefore(el, detailLink) : body.appendChild(el);
    if (!entries.has(slug)) entries.set(slug, []);
    entries.get(slug).push(el);
  });
  entries.forEach((elements, slug) => read(slug).then(value => {
    elements.forEach(el => { el.querySelector('span').textContent = number.format(value); });
  }).catch(() => {}));

  if (document.body.classList.contains('project-page')) {
    const slug = slugFromHref(location.href);
    const hero = document.querySelector('.project-hero-content');
    if (!slug || !hero) return;
    const el = badge(slug, 'project-view-count-detail');
    const kicker = hero.querySelector('.project-kicker');
    kicker ? kicker.insertAdjacentElement('afterend', el) : hero.appendChild(el);
    const key = `nge-project-viewed:${slug}`;
    let increment = true;
    try { increment = sessionStorage.getItem(key) !== '1'; if (increment) sessionStorage.setItem(key, '1'); } catch {}
    read(slug, increment).then(value => { el.querySelector('span').textContent = `${number.format(value)} ครั้ง`; }).catch(() => {});
  }
})();
