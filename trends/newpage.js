showSkeleton('content', 3);
fetch(API + '/articles?category=newpage')
fetch(API + '/').catch(function() {});

//  RENDER ENGINE
var content = document.getElementById("content");

if (typeof showSkeleton === "function") {
  showSkeleton("content", 3);
}

function renderPost(post) {
  var postId = post.id;
  var singleImg = !post.img2;

  return `
    <b id="label">${post.label || ""}</b>
    <h2>${post.headline || ""}${
      post.link
        ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view</a>`
        : ""
    }</h2>
    ${post.img ? `<img src="${post.img}" alt="photo"${singleImg ? ' id="p1"' : ""}>` : ""}
    ${post.img2 ? `<img src="${post.img2}" alt="photo">` : ""}
    ${renderBody(post)}
    ${renderRateboxAndEngagement(postId)}
    ${post.time ? `<br><b id="time">${post.time}</b>` : ""}
    <hr>
  `;
}

function renderPosts(posts) {
  if (!content) return;

  content.innerHTML = "";

  if (!Array.isArray(posts) || posts.length === 0) {
    content.textContent = "No trends found.";
    return;
  }

  posts.forEach(function (post) {
    var article = document.createElement("article");
    article.innerHTML = renderPost(post);
    content.appendChild(article);

    if (typeof attachSeeMore === "function") {
      attachSeeMore(post.id);
    }
    if (typeof initEngagement === "function") {
      initEngagement(post.id);
    }
  });
}

fetch(API + "/articles?category=newpage")
  .then(function (response) {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(renderPosts)
  .catch(function (error) {
    console.error("Failed to load trends:", error);
    if (content) content.textContent = "Could not load trends. Please try again later.";
  });
function attachEvents(postId) {
  var seeMore = document.getElementById('sm-' + postId);
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
  if (seeMore) {
    seeMore.addEventListener('click', function() {
        toggleBody(postId, seeMore.getAttribute('data-body'));
    });
}
}


// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

