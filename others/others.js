// Explore page: chart images, music charts, scroll dots.
// Needs auth.js loaded first (API, escapeHtml). Pair it with the new style.css.

const TREND_ICON = { up: '⌃', down: '⌄', neutral: '●' };
const POLL_IDS = ['polli1', 'polli2', 'polli3', 'polli4'];
const SONGS_PER_POLL = 4;

// ── helpers ──
const esc = (v) => escapeHtml(v == null ? '' : String(v));

function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch (error) {
    return '';
  }
}

// ── charts ──
function renderCharts(charts) {
  (charts || []).forEach((chart) => {
    const el = document.getElementById(chart.id);
    const img = safeUrl(chart.img);
    if (!el || !img) return;

    const image = `<img src="${esc(img)}" alt="chart" class="chart-img" loading="lazy">`;
    const link = safeUrl(chart.link);

    const wrap = document.createElement('div');
    wrap.innerHTML = link
      ? `<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${image}</a>`
      : image;
    el.appendChild(wrap);
  });
}

// ── songs ──
function songRow(song) {
  const trend = TREND_ICON[song.trend] ? song.trend : 'neutral';
  const img = safeUrl(song.img);

  return `
    <div class="song">
      <span class="rank">${esc(song.rank)}<b class="trend ${trend}">${TREND_ICON[trend]}</b></span>
      ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : '<span class="song-art"></span>'}
      <span class="song-name">${esc(song.name)}</span>
      <span class="song-artist">${esc(song.artist)}</span>
      <span class="days">${esc(song.days)}d</span>
    </div>`;
}

function renderSongs(songs) {
  POLL_IDS.forEach((pollId, pollIndex) => {
    const el = document.getElementById(pollId);
    if (!el) return;

    const slice = (songs || []).slice(pollIndex * SONGS_PER_POLL, (pollIndex + 1) * SONGS_PER_POLL);
    el.insertAdjacentHTML('beforeend', slice.map(songRow).join('<hr>'));
  });
}

// ── load (charts and songs load separately, so one failing doesn't block the other) ──
function loadJson(path) {
  return fetch(API + path).then((r) => {
    if (!r.ok) throw new Error(path + ' failed: ' + r.status);
    return r.json();
  });
}

loadJson('/charts').then(renderCharts).catch((e) => console.error('Charts error:', e));
loadJson('/songs').then(renderSongs).catch((e) => console.error('Songs error:', e));

// ── scroll dots ──
// Highlights the dot of the item closest to the left edge; clicking a dot scrolls to that item.
function bindDots(scroller, itemSelector, dots) {
  if (!scroller || !dots.length) return;

  const items = () => Array.from(scroller.querySelectorAll(itemSelector));
  let waiting = false;

  function update() {
    waiting = false;
    const left = scroller.getBoundingClientRect().left;
    let best = 0;
    let bestDist = Infinity;
    items().forEach((el, i) => {
      const dist = Math.abs(el.getBoundingClientRect().left - left);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === best));
  }

  scroller.addEventListener('scroll', () => {
    if (!waiting) { waiting = true; requestAnimationFrame(update); }
  }, { passive: true });

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    const el = items()[i];
    if (!el) return;
    const delta = el.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
    scroller.scrollTo({ left: scroller.scrollLeft + delta, behavior: 'smooth' });
  }));
}

bindDots(
  document.querySelector('.charts-scroll'),
  '.chart-card',
  document.querySelectorAll('#chartDots .dot')
);

bindDots(
  document.querySelector('.musiccharts'),
  '[id^="polli"]',
  document.querySelectorAll('#musicDots .dot')
);