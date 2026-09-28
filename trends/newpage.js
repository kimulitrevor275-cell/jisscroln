// Needs jis.js loaded first
// (API, showSkeleton, renderBody, attachSeeMore, renderRateboxAndEngagement, initEngagement)

// ─────────────────────────────────────────
//  KEEP BACKEND AWAKE
// ─────────────────────────────────────────

fetch(API + "/").catch(function () {});

// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

function renderPost(post) {
  var postId = post.id;
  var singleImg = !post.img2;

  return `
    <b id="label">${post.label || ""}</b>
    <h2>${post.headline || ""}${
      post.link
        ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view ↗</a>`
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
  var content = document.getElementById("content");
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

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
  });
}

// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

showSkeleton("content", 3);

fetch(API + "/articles?category=newpage")
  .then(function (response) {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(renderPosts)
  .catch(function (error) {
    console.error("Failed to load trends:", error);
    var content = document.getElementById("content");
    if (content) content.textContent = "Could not load trends. Please try again later.";
  });