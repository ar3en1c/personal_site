// Headless end-to-end test: runs js/app.js against a minimal DOM shim and a
// fetch() override that reads the real CSV files, then checks the rendered output.
// Run from static_site:  node test_render.mjs
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', 'data');

// ---------- minimal DOM shim ----------
class FakeEl {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.listeners = [];
    this._cls = ''; this._html = ''; this._text = '';
    this._src = ''; this._href = ''; this._target = ''; this._alt = '';
    this._id = null;
  }
  set className(v) { this._cls = v; } get className() { return this._cls; }
  set id(v) { this._id = v; } get id() { return this._id; }
  set innerHTML(v) { this._html = v; } get innerHTML() { return this._html; }
  set textContent(v) { this._text = v; } get textContent() { return this._text; }
  set src(v) { this._src = v; } get src() { return this._src; }
  set href(v) { this._href = v; } get href() { return this._href; }
  set target(v) { this._target = v; } get target() { return this._target; }
  set alt(v) { this._alt = v; } get alt() { return this._alt; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  addEventListener() { /* no-op */ }
  setAttribute() {}
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  querySelectorAll(sel) {
    const out = [];
    const match = (e) => {
      if (sel.startsWith('.')) return e._cls.split(' ').includes(sel.slice(1));
      return e.tagName === sel.toUpperCase();
    };
    const walk = (e) => { for (const c of e.children) { if (match(c)) out.push(c); walk(c); } };
    walk(this);
    return out;
  }
}

function makeBody(page) {
  const registry = {};
  function el(id, cls) { const e = new FakeEl('div'); e.id = id; if (cls) e.className = cls; registry[id] = e; return e; }
  const parent = new FakeEl('body'); parent.dataset = { page };

  if (page === 'home') {
    el('js-hello', ''); el('js-occupations', ''); el('js-about', '');
    const prof = el('js-profile', 'main-right-pic'); prof.appendChild(new FakeEl('img'));
    el('js-skills', ''); el('js-samples', 'samples');
    const em = el('js-email', 'contact-us-mail'); em.appendChild(new FakeEl('span'));
    const tg = el('js-telegram', 'contact-us-mail');
    parent.appendChild(prof);
  } else if (page === 'resume') {
    el('js-rname', ''); el('js-rocc', '');
    const prof = el('js-rprofile', 'main-right-pic'); prof.appendChild(new FakeEl('img'));
    const em = el('js-remail', 'contact-us-mail'); em.appendChild(new FakeEl('span'));
    const tg = el('js-rtelegram', 'contact-us-mail');
    el('js-education', 'tahsilat'); el('js-work', ''); el('js-languages', ''); el('js-certificates', '');
    parent.appendChild(prof);
  } else {
    el('js-samples-grid', 'samples-grid');
  }

  const handler = new FakeEl('wrapper');
  return {
    getElementById: (id) => registry[id] || null,
    createElement: (t) => new FakeEl(t),
    querySelectorAll: () => [],
    addEventListener: (ev, fn) => { if (ev === 'DOMContentLoaded') handler.domready = fn; },
    body: parent,
    domready: () => handler.domready && handler.domready(),
  };
}

// fetch() override -> read real CSV from disk (like the browser fetching /data/...)
global.fetch = async (url) => {
  const name = String(url).replace(/^data\//, '');
  const text = await readFile(join(dataDir, name), 'utf8');
  return { ok: true, text: async () => text };
};

const appSrc = await readFile(join(here, '..', 'js', 'app.js'), 'utf8');

let failures = 0;
async function scenario(page, checks) {
  const doc = makeBody(page);
  global.document = doc;
  // run app.js (module-scoped `const page` is read at this point)
  new Function(appSrc)();
  doc.domready();
  // allow async render to settle
  await new Promise(r => setTimeout(r, 150));
  console.log(`\n== ${page} ==`);
  for (const [id, expect, label] of checks) {
    const node = doc.getElementById(id);
    const actual = label === 'children' ? node.children.length : node._html || node._text || node._href || '';
    const pass = (label === 'children' ? actual === expect
      : (expect instanceof RegExp ? expect.test(actual) : String(actual).includes(String(expect))));
    console.log(`  ${id}: ${pass ? 'PASS' : 'FAIL'} (${label === 'children' ? actual + ' children' : JSON.stringify(actual)})`);
    if (!pass) failures++;
  }
}

await scenario('home', [
  ['js-hello', /سلام عرفان قندی/, 'html'],
  ['js-occupations', 'برنامه نویس فول استک', 'text'],
  ['js-about', /Django/, 'text'],
  ['js-skills', 15, 'children'],
  ['js-samples', 3, 'children'],                       // active samples only
  ['js-email', 'mailto:self@erfan-ghandi.ir', 'href'],
]);

await scenario('resume', [
  ['js-rname', 'عرفان قندی', 'text'],
  ['js-rocc', 'برنامه نویس فول استک', 'text'],
  ['js-education', 2, 'children'],
  ['js-work', 3, 'children'],
  ['js-languages', 1, 'children'],
  ['js-certificates', 3, 'children'],
  ['js-remail', 'mailto:self@erfan-ghandi.ir', 'href'],
]);

await scenario('sample', [
  ['js-samples-grid', 3, 'children'],                  // active samples only
]);

console.log(failures ? `\n${failures} RENDER FAILURES` : '\nALL RENDER CHECKS PASSED');
process.exit(failures ? 1 : 0);
