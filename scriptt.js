
fetch(API + '/').catch(function() {});
setInterval(function() { fetch(API + '/').catch(function() {}); }, 5 * 60 * 1000);

//  RENDER ENGINE

function renderTrends(trends, tickers, polls) {
  
  var tickerEl = document.getElementById('ticker');
  if (tickerEl) {
    tickerEl.innerHTML = '';
    tickers.forEach(function(t) {
      var span = document.createElement('span');
      span.textContent = t;
      tickerEl.appendChild(span);
    });
  }
  
  polls.forEach(function(poll) {
    var el = document.getElementById(poll.id);
    if (!el) return;
    el.innerHTML = '';
    if (poll.img) {
      var img = document.createElement('img');
      img.src = poll.img;
      img.alt = poll.text;
      el.appendChild(img);
    }
    if (poll.text) {
      var h4 = document.createElement('h4');
      h4.textContent = poll.text;
      el.appendChild(h4);
    }
  });

  
  var trendsEl = document.getElementById('trends');
  if (!trendsEl) return;
  trendsEl.innerHTML = '<h1 id="forup">JisScroL Updates<a href="/trends/"><img id="nxtp-icon" src="/pics/nxtpage.png"></a></h1>';

  trends.forEach(function(post) {
    var postId    = post.id;
    var singleImg = !post.img2;
    var div       = document.createElement('div');

    div.innerHTML =
      '<h2>' + post.headline +
        (post.link ? ' <a href="' + post.link + '" target="_blank">view</a>' : '') +
      '</h2>' +
      (post.img ? '<img src="' + post.img + '" alt="photo"' + (singleImg ? ' id="p1"' : '') + '>' : '') +
      
  (post.img2 ? '<img src="' + post.img2 + '" alt="photo">' : '') +
  (post.body ? '<p class="article-body">' + post.body.split('\n').join('<br>') + '</p>' : '') +

      '<div class="rate-box">' +
        '<div class="rate-btns">' +
          '<button class="btn-good" id="bg-' + postId + '">' +
            '<img src="/pics/iconsthumbsup.png" alt="good"> good' +
          '</button>' +
          '<button class="btn-bad" id="bb-' + postId + '">' +
            '<img src="/pics/iconsthumbsdown.png" alt="bad"> bad' +
          '</button>' +
        '</div>' +
        '<div class="rate-bar-wrap">' +
          '<div class="rate-bar-good" id="rg-'  + postId + '" style="width:50%"></div>' +
          '<div class="rate-bar-bad"  id="rbd-' + postId + '" style="width:50%"></div>' +
        '</div>' +
        '<div class="rate-counts">' +
          '<span id="rgp-' + postId + '">0 (50%)</span>' +
          '<span id="rbp-' + postId + '">(50%) 0</span>' +
        '</div>' +
      '</div>' +

      '<button class="btn-engage" id="bte-' + postId + '">' +
        '<img id="commentbtn" src="/pics/commentbtn.png"> Comment <span>▾</span>' +
      '</button>' +

      '<div class="engage-panel" id="ep-' + postId + '">' +
        '<div class="opinion-label">YOUR OPINION</div>' +
        '<textarea class="opinion-input" id="oi-' + postId + '" ' +
          'placeholder="What do you think? (max 300 chars)" maxlength="300"></textarea>' +
        '<div class="opinion-footer">' +
          '<span class="char-count" id="oc-' + postId + '">0 / 300</span>' +
          '<button class="btn-submit" id="ob-' + postId + '" disabled>Post</button>' +
        '</div>' +
        '<div class="opinions-list" id="ol-' + postId + '">' +
          '<div class="opinions-title">OPINIONS</div>' +
          '<div class="no-opinions" id="oe-' + postId + '">No opinions yet. Be the first.</div>' +
        '</div>' +
        '<button class="btn-show-more" id="osm-' + postId + '">Show more ▾</button>' +
      '</div>' +

      '<br><b id="time">' + post.time + '</b>' +
      '<hr>';

    trendsEl.appendChild(div);
    attachEvents(postId);
    loadRatings(postId);
    loadOpinions(postId);
  });
}

//  ATTACH EVENTS

function attachEvents(postId) {
  var engageBtn = document.getElementById('bte-' + postId);
  var panel     = document.getElementById('ep-'  + postId);
  var input     = document.getElementById('oi-'  + postId);
  var submitBtn = document.getElementById('ob-'  + postId);
  var goodBtn   = document.getElementById('bg-'  + postId);
  var badBtn    = document.getElementById('bb-'  + postId);
  var showMore  = document.getElementById('osm-' + postId);

  engageBtn.addEventListener('click', function() {
    var isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    engageBtn.querySelector('span').textContent = isOpen ? '▾' : '▴';
  });

  input.addEventListener('input', function() {
    var len = input.value.trim().length;
    document.getElementById('oc-' + postId).textContent = len + ' / 300';
    document.getElementById('oc-' + postId).style.color = len > 260 ? '#e07070' : '#444';
    submitBtn.disabled = len === 0;
  });

  submitBtn.addEventListener('click', function() { submitOpinion(postId); });
  goodBtn.addEventListener('click',   function() { submitRating(postId, 'good'); });
  badBtn.addEventListener('click',    function() { submitRating(postId, 'bad'); });

  showMore.addEventListener('click', function() {
    var hidden = panel.querySelectorAll('.opinion-card.hidden');
    hidden.forEach(function(c) {
      c.classList.remove('hidden');
      c.style.display = '';
    });
    showMore.classList.remove('visible');
  });
}

showSkeleton('trends', 3);

//  FETCH AND RENDER

Promise.all([
  fetch(API + '/tickers').then(function(r) { return r.json(); }),
  fetch(API + '/polls').then(function(r) { return r.json(); }),
  fetch(API + '/articles?category=trends').then(function(r) { return r.json(); })
])
.then(function(results) {
  var tickers = results[0].map(function(t) { return t.text; });
  var polls   = results[1];
  var trends  = results[2];
  renderTrends(trends, tickers, polls);
})
.catch(function() { renderTrends([], [], []); });
