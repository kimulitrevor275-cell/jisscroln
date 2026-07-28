showSkeleton('content', 3);
fetch(API + '/articles?category=newpage')
fetch(API + '/').catch(function() {});

//  RENDER ENGINE
function renderPosts(posts) {
  var content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = '';

  posts.forEach(function(post) {
    var postId = post.id;
    var card   = document.createElement('div');
    card.className = 'post-card';

    card.innerHTML =
      '<b id="label">' + (post.label || '') + '</b>' +
      '<h3>' + post.headline + '</h3>' +
      '<img src="' + post.img + '" alt="' + (post.label || '') + '">' +
      (post.img2 ? '<img src="' + post.img2 + '" alt="' + (post.label || '') + '">' : '') +
      (post.body ? '<p>' + post.body + '</p>' : '') +

      '<div class="rate-box">' +
        '<div class="rate-btns">' +
          '<button class="btn-good" id="bg-' + postId + '">' +
            '<img src="pics/iconsthumbsup.png" alt="good"> Like' +
          '</button>' +
          '<button class="btn-bad" id="bb-' + postId + '">' +
            '<img src="pics/iconsthumbsdown.png" alt="bad"> Dislike' +
          '</button>' +
        '</div>' +
        '<div class="rate-bar-wrap">' +
          '<div class="rate-bar-good" id="rg-' + postId + '" style="width:50%"></div>' +
          '<div class="rate-bar-bad"  id="rbd-' + postId + '" style="width:50%"></div>' +
        '</div>' +
        '<div class="rate-counts">' +
          '<span id="rgp-' + postId + '">0 (50%)</span>' +
          '<span id="rbp-' + postId + '">(50%) 0</span>' +
        '</div>' +
      '</div>' +

      '<button class="btn-engage" id="bte-' + postId + '">' +
        '<img id="commentbtn" src="pics/commentbtn.png"> Comment <span>▾</span>' +
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

      '<div id="dlinks">' +
        (post.read_link ? '<a id="a" href="' + post.read_link + '" target="_blank">' + (post.read_text || 'Read more') + '</a>' : '') +
        '<a id="a" href="index.html">Back to Home</a>' +
      '</div>' +
      (post.time ? '<b id="time">' + post.time + '</b>' : '') +
      '<hr><br>';

    content.appendChild(card);
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


// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

fetch(API + '/articles?category=newpage')
  .then(function(r) { return r.json(); })
  .then(function(data) { renderPosts(data); })
  .catch(function() { renderPosts([]); });
