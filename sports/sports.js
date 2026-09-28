var sportsEl = document.getElementById("sports");

if (typeof showSkeleton === "function") {
  showSkeleton("sports", 3);
}

function renderSports(posts) {
  if (!sportsEl) return;

  sportsEl.innerHTML = "";

  if (!Array.isArray(posts) || posts.length === 0) {
    sportsEl.textContent = "No sports found.";
    return;
  }

  posts.forEach(function (post) {
    var postId = post.id;
    var singleImg = !post.img2;
    var card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = `
      <b id="label">${post.label || ""}</b>
      <h2>${post.headline || ""}${
        post.link
          ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view</a>`
          : ""
      }</h2>
      ${renderBody(post)}
      ${post.img ? `<img src="${post.img}" alt="photo"${singleImg ? ' id="p1"' : ""}>` : ""}
      ${post.img2 ? `<img src="${post.img2}" alt="photo">` : ""}
      ${renderRateboxAndEngagement(postId)}
      ${post.time ? `<br><b id="time">${post.time}</b>` : ""}
      <hr>
    `;

    sportsEl.appendChild(card);

    if (typeof attachSeeMore === "function") {
      attachSeeMore(postId);
    }
    if (typeof initEngagement === "function") {
      initEngagement(postId);
    }
  });
}

fetch(API + "/articles?category=sports")
  .then(function (response) {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(renderSports)
  .catch(function (error) {
    console.error("Failed to load sports:", error);
    if (sportsEl) {
      sportsEl.textContent = "Could not load sports. Please try again later.";
    }
  });

function keepSportsApiAwake() {
  fetch(API + "/").catch(function (error) {
    console.error("Failed to keep sports API awake:", error);
  });
}

keepSportsApiAwake();
setInterval(keepSportsApiAwake, 5 * 60 * 1000);
