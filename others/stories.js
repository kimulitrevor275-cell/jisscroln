// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

const likedMap = {};
const API = 'https://jisscrol-opinions.onrender.com';

function render(DATA) {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';

  DATA.forEach(function(s) {

    const card = document.createElement('div');
    card.className = 'scard';

    // body can be a string or array
    var bodyHtml = '';
    if (Array.isArray(s.body)) {
      bodyHtml = s.body.map(function(p) { return '<p>' + p + '</p>'; }).join('');
    } else if (s.body) {
      bodyHtml = s.body.split('\n').filter(Boolean).map(function(p) { return '<p>' + p + '</p>'; }).join('');
    }

    card.innerHTML =
      '<div class="scard-thumb">' +
        '<img src="' + (s.img || '') + '" alt="' + s.title + '">' +
        '<div class="thumb-badge">' + (s.badge || '') + '</div>' +
        '<div class="thumb-overlay">' +
          '<div class="thumb-cat ' + (s.cc || '') + '">' + (s.cat || '') + '</div>' +
          '<div class="thumb-title">' + s.title + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="scard-preview">' +
        '<div class="preview-snippet">' + (s.snippet || '') + '</div>' +
        '<div class="preview-meta">' +
          '<div class="meta-left">' +
            '<div class="mini-av">' + (s.initials || 'AN') + '</div>' +
            '<span class="meta-author">' + (s.author || 'Anonymous') + '</span>' +
            '<span class="dot">·</span>' +
            '<span>' + (s.read_time || s.read || '') + ' read</span>' +
            '<span class="dot">·</span>' +
            '<span>' + (s.time || '') + '</span>' +
          '</div>' +
          '<div class="read-more">see more<span class="read-arrow">⌄</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="scard-article">' +
        '<div class="article-body">' + bodyHtml + '</div>' +
        '<div class="reactions">' +
          '<button class="like-btn" data-id="' + s.id + '">' +
            '<img id="btn-good" src="pics/iconsthumbsup.png">' +
            '<span class="lcount">0</span>' +
          '</button>' +
          '<button class="show-less" data-id="' + s.id + '">Show less</button>' +
        '</div>' +
      '</div>';

    feed.appendChild(card);
  });

  // expand / collapse
  feed.querySelectorAll('.scard').forEach(function(card) {
    var thumb   = card.querySelector('.scard-thumb');
    var preview = card.querySelector('.scard-preview');

    function toggleOpen() {
      var isOpen = card.classList.contains('open');
      feed.querySelectorAll('.scard').forEach(function(c) { c.classList.remove('open'); });
      if (!isOpen) {
        card.classList.add('open');
        setTimeout(function() {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
    }

    thumb.addEventListener('click', toggleOpen);
    preview.addEventListener('click', toggleOpen);
  });

  // show less
  feed.querySelectorAll('.show-less').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var card = btn.closest('.scard');
      card.classList.remove('open');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // load like counts
  feed.querySelectorAll('.like-btn').forEach(function(btn) {
    var storyId = btn.dataset.id;
    fetch(API + '/ratings/' + storyId)
    .then(function(r) { return r.json(); })
    .then(function(data) { btn.querySelector('.lcount').textContent = data.good || 0; })
    .catch(function() {});
  });

  // like click
  feed.querySelectorAll('.like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var storyId = btn.dataset.id;
      if (likedMap[storyId]) return;
      likedMap[storyId] = true;
      btn.classList.add('liked');
      fetch(API + '/ratings', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ post_id: storyId, vote: 'good' })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) { btn.querySelector('.lcount').textContent = data.good || 0; })
      .catch(function() { likedMap[storyId] = false; btn.classList.remove('liked'); });
    });
  });
}

// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

fetch(API + '/stories')
  .then(function(r) { return r.json(); })
  .then(function(data) { render(data); })
  .catch(function() { render([]); });
