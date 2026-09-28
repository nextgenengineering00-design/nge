import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = (process.argv[2] || 'http://127.0.0.1:8791').replace(/\/$/, '');
const canonicalBase = 'https://ngebuild.com';
const primary = '/renovation-service-nonthaburi';
const articles = ['renovation-nonthaburi', 'renovation-budget-guide', 'renovation-structure-check-guide', 'renovation-mep-guide'];
const get = async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return response.text();
};
const text = await get(primary);
assert.match(text, /<title>รีโนเวท นนทบุรี รับปรับปรุงบ้านและอาคาร \| NGE<\/title>/);
assert.equal((text.match(/<h1\b/g) || []).length, 1, 'Exactly one H1');
assert.match(text, /<h1>รีโนเวท นนทบุรี/);
assert.match(text, /rel="canonical" href="https:\/\/ngebuild.com\/renovation-service-nonthaburi"/);
const robots = text.match(/<meta name="robots" content="([^"]+)"/)?.[1];
assert.ok(robots && !robots.includes('noindex'), 'Landing page must be indexable');
const schemas = [...text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => {
  const value = JSON.parse(match[1]);
  return value['@graph'] || (Array.isArray(value) ? value : [value]);
});
assert.ok(schemas.some(item => item['@type'] === 'Service' && item.url === `${canonicalBase}${primary}`));
assert.ok(schemas.some(item => item['@type'] === 'BreadcrumbList'));
assert.match(text, /id="renovationNonthaburiForm"/);
assert.match(text, /type="checkbox" name="privacy_consent" required/);
assert.match(text, /data-photo-estimate="true"/);
assert.match(text, /href="tel:0982799145"/);
assert.match(text, /href="https:\/\/lin.ee\/u45yvnc"/);
const internal = [...new Set([...text.matchAll(/(?:href|src)="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)].map(match => match[1]))];
for (let i = 0; i < internal.length; i += 5) {
  await Promise.all(internal.slice(i, i + 5).map(get));
}
for (const article of articles) {
  const body = await get(`/${article}`);
  assert.ok(body.includes(`href="${primary}"`), `${article}: supporting link`);
  assert.ok(body.includes(`${primary}#renovation-estimate`), `${article}: estimate link`);
}
for (const path of ['/', '/services']) assert.ok((await get(path)).includes(`href="${primary}"`), `${path}: primary landing link`);
const xml = await get('/sitemap.xml');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, new Set(urls).size, 'No duplicate sitemap entries');
assert.ok(urls.includes(`${canonicalBase}${primary}`));
assert.ok(!urls.some(url => /\/(crm|ai-agent|ai-marketing|renovation-quote)(?:$|\/)/.test(url)), 'Private/quote pages excluded');
for (let i = 0; i < urls.length; i += 5) {
  await Promise.all(urls.slice(i, i + 5).map(async url => {
    const path = new URL(url).pathname;
    const body = await get(path);
    assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(body), `${path}: sitemap URL must be indexable`);
    const canonical = body.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical, `${path}: canonical exists`);
    assert.equal(new URL(canonical).href, new URL(url).href, `${path}: self canonical`);
  }));
}
const robotsTxt = await get('/robots.txt');
assert.ok(robotsTxt.includes(`Sitemap: ${canonicalBase}/sitemap.xml`));
const old = await fetch(`${base}${primary}.html`, { redirect: 'manual' });
assert.ok([301, 308].includes(old.status), 'Old .html URL permanently redirects');
assert.equal(new URL(old.headers.get('location'), base).pathname, primary);
const report = { checkedAt: new Date().toISOString(), base, primary, passed: true, checks: ['Title/H1/canonical/indexability', 'Service and breadcrumb structured data', 'Form fields and contact destinations', `${internal.length} internal links and assets`, 'Four supporting article links', 'Homepage and services links', `${urls.length} unique indexable sitemap URLs`, 'Robots sitemap declaration', 'Permanent legacy URL redirect'] };
if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
