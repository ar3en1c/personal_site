// Static-site CSV renderer.
// Reads the CSVs in /data (editable in Excel) and renders the pages.
(function () {
  'use strict';

  // --- tiny RFC-4180-ish CSV parser (handles quoted fields, commas, quotes) ---
  function parseCSV(text) {
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
    const rows = [];
    let field = '', row = [], inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field); field = '';
      } else if (ch === '\n') {
        row.push(field); field = ''; rows.push(row); row = [];
      } else if (ch !== '\r') {
        field += ch;
      }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function toObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map(function (h) { return h.trim(); });
    return rows.slice(1)
      .filter(function (r) { return r.some(function (c) { return c !== undefined && c !== null && c !== ''; }); })
      .map(function (r) {
        const o = {};
        headers.forEach(function (h, i) { o[h] = (r[i] !== undefined ? r[i] : '').trim(); });
        return o;
      });
  }

  async function load(name) {
    const res = await fetch('data/' + name);
    if (!res.ok) throw new Error('failed to load ' + name);
    const text = await res.text();
    return toObjects(parseCSV(text));
  }

  function $(id) { return document.getElementById(id); }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function withSrc(tag, src) {
    const e = el(tag);
    e.src = src || '';
    e.alt = '';
    return e;
  }

  function escapeHtml(s) {
    return (s === null || s === undefined ? '' : String(s))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Home page ---
  function fillHome() {
    load('person.csv').then(function (rows) {
      const p = rows[0] || {};
      if ($('js-hello')) $('js-hello').innerHTML = 'سلام ' + escapeHtml(p.name) + '<br/> هستم.';
      if ($('js-occupations')) $('js-occupations').textContent = p.occupations;
      if ($('js-about')) $('js-about').textContent = p.about;
      if ($('js-profile')) {
        const img = $('js-profile').querySelector('img');
        if (p.image && img) img.src = p.image;
      }
    }).catch(console.error);

    load('skills.csv').then(function (rows) {
      const box = $('js-skills'); if (!box) return;
      rows.forEach(function (s) {
        const pct = parseInt(s.percent, 10) || 0;
        const d = el('div', 'skill');
        const bar = el('div', 'skill-bar');
        const fill = el('div', 'skill-bar-fill');
        fill.style.width = pct + '%';
        bar.appendChild(fill);
        d.appendChild(bar);
        d.appendChild(el('h3', '', escapeHtml(s.name)));
        box.appendChild(d);
      });
    }).catch(console.error);

    load('samples.csv').then(function (rows) {
      const box = $('js-samples'); if (!box) return;
      rows.filter(function (s) { return String(s.is_active) === '1'; }).slice(0, 6).forEach(function (s) {
        const d = el('div', 'sample');
        const img = withSrc('img', s.image); img.alt = s.name;
        const a = el('a', '', escapeHtml(s.name)); a.href = s.link; a.target = '_blank';
        d.appendChild(img); d.appendChild(a);
        d.appendChild(el('p', '', escapeHtml(s.description)));
        box.appendChild(d);
      });
    }).catch(console.error);

    load('contact.csv').then(function (rows) {
      const c = rows[0] || {};
      if ($('js-email')) { $('js-email').href = 'mailto:' + c.mail; $('js-email').querySelector('span').textContent = c.mail; }
      if ($('js-telegram')) $('js-telegram').href = c.telegram;
    }).catch(console.error);
  }

  // --- Resume page ---
  function renderItemList(boxId, csvName, mapRow, onDone) {
    load(csvName).then(function (rows) {
      const box = $(boxId); if (!box) return;
      rows.forEach(function (r) {
        const node = mapRow(r);
        if (node !== null && node !== undefined) box.appendChild(node);
      });
      if (onDone) onDone();
    }).catch(console.error);
  }

  function fillResume() {
    load('person.csv').then(function (rows) {
      const p = rows[0] || {};
      if ($('js-rname')) $('js-rname').textContent = p.name;
      if ($('js-rocc')) $('js-rocc').textContent = p.occupations;
      if ($('js-rprofile')) {
        const img = $('js-rprofile').querySelector('img');
        if (p.image && img) img.src = p.image;
      }
    }).catch(console.error);

    load('contact.csv').then(function (rows) {
      const c = rows[0] || {};
      if ($('js-remail')) { $('js-remail').href = 'mailto:' + c.mail; $('js-remail').querySelector('span').textContent = c.mail; }
      if ($('js-rtelegram')) $('js-rtelegram').href = c.telegram;
    }).catch(console.error);

    renderItemList('js-education', 'education.csv', function (r) {
      const d = el('div', 'details-tahsilat');
      const right = el('div', 'right-tahsilat');
      right.appendChild(el('h3', '', escapeHtml(r.reshte)));
      right.appendChild(el('p', '', escapeHtml(r.university)));
      right.appendChild(el('span', '', escapeHtml(r.zaman)));
      const left = el('div', 'left-tahsilat'); left.appendChild(withSrc('img', r.image));
      d.appendChild(right); d.appendChild(left);
      return d;
    });

    renderItemList('js-work', 'work.csv', function (r) {
      const d = el('div', 'details-tahsilat');
      const right = el('div', 'right-tahsilat');
      right.appendChild(el('h3', '', escapeHtml(r.title)));
      right.appendChild(el('p', '', escapeHtml(r.place)));
      right.appendChild(el('span', '', escapeHtml(r.zaman)));
      const left = el('div', 'left-tahsilat'); left.appendChild(withSrc('img', r.image));
      d.appendChild(right); d.appendChild(left);
      return d;
    });

    renderItemList('js-languages', 'languages.csv', function (r) {
      const pct = parseInt(r.percent, 10) || 0;
      const d = el('div', 'skill');
      const bar = el('div', 'skill-bar');
      const fill = el('div', 'skill-bar-fill'); fill.style.width = pct + '%';
      bar.appendChild(fill);
      d.appendChild(bar);
      d.appendChild(el('h3', '', escapeHtml(r.name)));
      return d;
    });

    renderItemList('js-certificates', 'certificates.csv', function (r) {
      const d = el('div', 'madarek-tekrar-pazir');
      d.appendChild(el('h3', '', escapeHtml(r.name)));
      d.appendChild(el('b', '', escapeHtml(r.issuer)));
      d.appendChild(el('span', '', escapeHtml(r.date)));
      const a = el('a', '', escapeHtml(r.link)); a.href = r.link; a.target = '_blank';
      d.appendChild(a);
      return d;
    });
  }

  // --- Sample page ---
  function setupSampleCards() {
    document.querySelectorAll('.sample-card').forEach(function (card) {
      const content = card.querySelector('.sample-content');
      const description = card.querySelector('.sample-description');
      if (!content || !description) return;
      const descriptionHeight = description.scrollHeight;
      card.addEventListener('mouseenter', function () {
        content.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        content.style.height = (60 + descriptionHeight) + 'px';
      });
      card.addEventListener('mouseleave', function () {
        setTimeout(function () {
          content.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          content.style.height = '60px';
        }, 200);
      });
    });
  }

  function fillSample() {
    renderItemList('js-samples-grid', 'samples.csv', function (r) {
      if (String(r.is_active) !== '1') return null;
      const a = el('a', 'sample-card'); a.href = r.link; a.target = '_blank';
      const imgDiv = el('div', 'sample-image'); imgDiv.appendChild(withSrc('img', r.image));
      const content = el('div', 'sample-content');
      content.appendChild(el('h3', '', escapeHtml(r.name)));
      const desc = el('div', 'sample-description'); desc.appendChild(el('p', '', escapeHtml(r.description)));
      content.appendChild(desc);
      a.appendChild(imgDiv); a.appendChild(content);
      return a;
    }, function () { setupSampleCards(); });
  }

  function fillYear() {
    document.querySelectorAll('.js-year').forEach(function (n) {
      n.textContent = new Date().getFullYear();
    });
  }

  const page = document.body.dataset.page || 'home';
  document.addEventListener('DOMContentLoaded', function () {
    fillYear();
    if (page === 'resume') fillResume();
    else if (page === 'sample') fillSample();
    else fillHome();
  });
})();
