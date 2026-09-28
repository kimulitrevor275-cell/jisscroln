// Needs jis.js loaded first
// (API, showSkeleton, renderBody, attachSeeMore, renderRateboxAndEngagement, initEngagement)

// ─────────────────────────────────────────
//  KEEP BACKEND AWAKE
// ─────────────────────────────────────────

function keepSportsApiAwake() {
  fetch(API + "/").catch(function (error) {
    console.error("Failed to keep sports API awake:", error);
  });
}

keepSportsApiAwake();
setInterval(keepSportsApiAwake, 5 * 60 * 1000);

// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

function renderSportsPost(post) {
  var postId = post.id;
  var singleImg = !post.img2;

  return `
    <b id="label">${post.label || ""}</b>
    <h2>${post.headline || ""}${
      post.link
        ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view ↗</a>`
        : ""
    }</h2>
    ${renderBody(post)}
    ${post.img ? `<img src="${post.img}" alt="photo"${singleImg ? ' id="p1"' : ""}>` : ""}
    ${post.img2 ? `<img src="${post.img2}" alt="photo">` : ""}
    ${renderRateboxAndEngagement(postId)}
    ${post.time ? `<br><b id="time">${post.time}</b>` : ""}
    <hr>
  `;
}

function renderSports(posts) {
  var sportsEl = document.getElementById("sports");
  if (!sportsEl) return;

  sportsEl.innerHTML = "";

  if (!Array.isArray(posts) || posts.length === 0) {
    sportsEl.textContent = "No sports found.";
    return;
  }

  posts.forEach(function (post) {
    var card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = renderSportsPost(post);
    sportsEl.appendChild(card);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
  });
}

// ─────────────────────────────────────────
//  FETCH AND RENDER
// ─────────────────────────────────────────

showSkeleton("sports", 3);

fetch(API + "/articles?category=sports")
  .then(function (response) {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(renderSports)
  .catch(function (error) {
    console.error("Failed to load sports:", error);
    var sportsEl = document.getElementById("sports");
    if (sportsEl) sportsEl.textContent = "Could not load sports. Please try again later.";
  });