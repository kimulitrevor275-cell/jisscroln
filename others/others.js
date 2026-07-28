// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

const trendIcon = { up: '⌃', down: '⌄', neutral: '●' };
const trendId   = { up: 'up', down: 'down', neutral: 'neutral' };

const pollIds      = ['poll1', 'poll2', 'poll3', 'poll4'];
const songsPerPoll = 4;

function renderCharts(charts) {
  charts.forEach(function(chart) {
    var el = document.getElementById(chart.id);
    if (!el) return;
    var wrap = document.createElement('div');
    if (chart.link) {
      wrap.innerHTML = '<a href="' + chart.link + '" target="_blank"><img src="' + chart.img + '" alt="chart" class="chart-img"></a>';
    } else {
      wrap.innerHTML = '<img src="' + chart.img + '" alt="chart" class="chart-img">';
    }
    el.appendChild(wrap);
  });
}

function renderSongs(songs) {
  pollIds.forEach(function(pollId, pollIndex) {
    var el = document.getElementById(pollId);
    if (!el) return;
    var slice = songs.slice(pollIndex * songsPerPoll, pollIndex * songsPerPoll + songsPerPoll);
    slice.forEach(function(song) {
      var div = document.createElement('div');
      div.className = 'song';
      div.innerHTML =
        '<span id="rank">' + song.rank + '<b id="' + (trendId[song.trend] || 'neutral') + '">' + (trendIcon[song.trend] || '●') + '</b></span>' +
        '<img src="' + song.img + '" alt="' + song.name + '">' +
        '<span id="songname">' + song.name + '</span>' +
        '<b>' + song.artist + '</b>' +
        '<span class="days">' + song.days + '</span>';
      el.appendChild(div);
      el.insertAdjacentHTML('beforeend', '<hr>');
    });
  });
}

// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

Promise.all([
  fetch(API + '/charts').then(function(r) { return r.json(); }),
  fetch(API + '/songs').then(function(r) { return r.json(); })
])
.then(function(results) {
  renderCharts(results[0]);
  renderSongs(results[1]);
})
.catch(function() {});

// ─────────────────────────────────────────
//  SCROLL DOTS
// ─────────────────────────────────────────

var chartsScroll = document.querySelector('.charts-scroll');
var chartDots    = document.querySelectorAll('#chartDots .dot');

if (chartsScroll) {
  chartsScroll.addEventListener('scroll', function() {
    var idx = Math.round(chartsScroll.scrollLeft / chartsScroll.clientWidth);
    chartDots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  });
  chartDots.forEach(function(d, i) {
    d.addEventListener('click', function() {
      chartsScroll.scrollTo({ left: i * chartsScroll.clientWidth, behavior: 'smooth' });
    });
  });
}

var musiccharts = document.querySelector('.musiccharts');
var musicDots   = document.querySelectorAll('#musicDots .dot');

if (musiccharts) {
  musiccharts.addEventListener('scroll', function() {
    var idx = Math.round(musiccharts.scrollLeft / musiccharts.clientWidth);
    musicDots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  });
  musicDots.forEach(function(d, i) {
    d.addEventListener('click', function() {
      musiccharts.scrollTo({ left: i * musiccharts.clientWidth, behavior: 'smooth' });
    });
  });
}
// ─────────────────────────────────────────
//  search.js — JisScroL global search
//  Requires: jis.js loaded first (for API var)
// ─────────────────────────────────────────

(function() {
  // inject styles
  var style = document.createElement('style'); 
  style.textContent =
    '#jis-search-icon {' +
  'position:fixed;bottom:50px;right:20px;' +
  'width:78px;height:78px; border:none;' +
  'background :none;color:#000;' +
  'border-radius:50%; border:none; '  +
  '0display:flex;align-items:center;justify-content:center;' +
  'font-size:22px;cursor:pointer;' +
  'box-shadow:0 4px 16px rgba(0,0,0,0.5);' +
  'z-index:999;user-select:none;' +
'}' +
  
    '#jis-search-overlay {' +
      'position:fixed;top:0;left:0;right:0;' +
      'background:#0a0a0a;z-index:1000;' +
      'transform:translateY(-100%);transition:transform 0.3s ease;' +
      'padding:16px;border-bottom:1px solid #222;' +
    '}' +
  
    '#jis-search-overlay.open { transform:translateY(0); }' +
    '#jis-search-wrap { display:flex;align-items:center;gap:10px;margin-bottom:14px; }' +
  
    '#jis-search-input {' +
      'flex:1;background:#181818;border:1px solid #333;border-radius:8px;' +
      'padding:11px 14px;color:#e8e8e8;font-family:Outfit,sans-serif;' +
      'font-size:35px;outline:none;' +
    '}' +
    '#jis-search-input:focus { border-color: white; }' +
  
    '#jis-search-close { background:none;border:none;color: white ;font-size:35px;cursor:pointer;padding:4px 8px; }' +
  
    '#jis-search-results { max-height:70vh;overflow-y:auto; }' +
  
    '.jis-result-section { font-size:20px; text-transform:uppercase; letter-spacing:0.12em; color: white; margin:12px 0 6px; }' +
  
    '.jis-result-item { display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1a1a1a;cursor:pointer; }' +
  
    '.jis-result-item:active { opacity:0.7; }' +
  
    '.jis-result-img { width: 55px;height:55px;object-fit:cover;border-radius:5px;flex-shrink:0;background:#1a1a1a; }' +
    '.jis-result-info { flex:1;min-width:0; }' +
  
    '.jis-result-cat { font-size:20px;color:#c9a96e;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px; }' +
  
    '.jis-result-title { font-size:30px;color: white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }' +
  
    '.jis-no-results { text-align:center;color: white; font-size:30px;padding:32px 0; }';
  
  document.head.appendChild(style);

  
  var overlay = document.createElement('div');
  overlay.id = 'jis-search-overlay';
  overlay.innerHTML =
    '<div id="jis-search-wrap">' +
      '<input id="jis-search-input" type="text" placeholder="Search articles, stories, songs...">' +
      '<button id="jis-search-close">✕</button>' +
    '</div>' +
    '<div id="jis-search-results"></div>';
  document.body.appendChild(overlay);

  function openSearch() {
    overlay.classList.add('open');
    document.getElementById('jis-search-input').focus();
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.getElementById('jis-search-input').value = '';
    document.getElementById('jis-search-results').innerHTML = '';
  }

  document.getElementById('jis-search-close').addEventListener('click', closeSearch);

  var searchTimer;
  document.getElementById('jis-search-input').addEventListener('input', function() {
    clearTimeout(searchTimer);
    var q = this.value.trim();
    if (!q) { document.getElementById('jis-search-results').innerHTML = ''; return; }
    searchTimer = setTimeout(function() { doSearch(q); }, 350);
  });

  function doSearch(q) {
    var results = document.getElementById('jis-search-results');
    results.innerHTML = '<p class="jis-no-results">Searching...</p>';
    fetch('https://jisscrol-opinions.onrender.com/search?q=' + encodeURIComponent(q))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      results.innerHTML = '';
      var total = data.articles.length + data.stories.length + data.songs.length;
      if (total === 0) { results.innerHTML = '<p class="jis-no-results">No results for "' + q + '"</p>'; return; }

      if (data.articles.length) {
        results.innerHTML += '<div class="jis-result-section">Articles</div>';
        data.articles.forEach(function(a) {
          var page = a.category === 'trends' ? 'index.html' : a.category === 'newpage' ? 'newpage.html' : 'sports.html';
          results.innerHTML +=
            '<div class="jis-result-item" onclick="window.location.href=\'' + page + '\'">' +
              '<img class="jis-result-img" src="' + (a.img || '') + '" alt="">' +
              '<div class="jis-result-info">' +
                '<div class="jis-result-cat">' + a.category + '</div>' +
                '<div class="jis-result-title">' + a.headline + '</div>' +
              '</div>' +
            '</div>';
        });
      }

      if (data.stories.length) {
        results.innerHTML += '<div class="jis-result-section">Stories</div>';
        data.stories.forEach(function(s) {
          results.innerHTML +=
            '<div class="jis-result-item" onclick="window.location.href=\'others.html\'">' +
              '<img class="jis-result-img" src="' + (s.img || '') + '" alt="">' +
              '<div class="jis-result-info">' +
                '<div class="jis-result-cat">' + (s.cat || 'Story') + '</div>' +
                '<div class="jis-result-title">' + s.title + '</div>' +
              '</div>' +
            '</div>';
        });
      }

      if (data.songs.length) {
        results.innerHTML += '<div class="jis-result-section">Songs</div>';
        data.songs.forEach(function(s) {
          results.innerHTML +=
            '<div class="jis-result-item" onclick="window.location.href=\'others.html\'">' +
              '<img class="jis-result-img" src="' + (s.img || '') + '" alt="">' +
              '<div class="jis-result-info">' +
                '<div class="jis-result-cat">#' + s.rank + '</div>' +
                '<div class="jis-result-title">' + s.name + ' — ' + s.artist + '</div>' +
              '</div>' +
            '</div>';
        });
      }
    })
    .catch(function() { results.innerHTML = '<p class="jis-no-results">Could not connect</p>'; });
  }

// inject search icon
  var icon = document.createElement('span');
  icon.id = 'jis-search-icon';
  icon.innerHTML = '<img src="pics/search.svg" style="border:none;width:100px">';
  icon.addEventListener('click', openSearch);
  document.body.appendChild(icon);
})();



