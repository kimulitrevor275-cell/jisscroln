// Needs jis.js loaded first (API, showSkeleton, formatBody, renderRateboxAndEngagement, initEngagement)

// Keep the Render backend awake
fetch(API + "/").catch(function () {});
setInterval(
  function () {
    fetch(API + "/").catch(function () {});
  },
  5 * 60 * 1000,
);



// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

function renderTicker(tickers) {
  var tickerEl = document.getElementById("ticker");
  if (!tickerEl) return;
  tickerEl.innerHTML = "";
  tickers.forEach(function (t) {
    var span = document.createElement("span");
    span.textContent = t;
    tickerEl.appendChild(span);
  });
}

function renderPolls(polls) {
  polls.forEach(function (poll) {
    var el = document.getElementById(poll.id);
    if (!el) return;
    el.innerHTML = "";
    if (poll.img) {
      var img = document.createElement("img");
      img.src = poll.img;
      img.alt = poll.text;
      el.appendChild(img);
    }
    if (poll.text) {
      var h4 = document.createElement("h4");
      h4.textContent = poll.text;
      el.appendChild(h4);
    }
  });
}

function renderPost(post) {
  var postId = post.id;
  var singleImg = !post.img2;

  return `
    <b id="label">${post.label || ""}</b>
    <h2>${post.headline}${post.link ? ` <a href="${post.link}" target="_blank" rel="noopener">view↗</a>` : ""}</h2>
    ${post.img ? `<img src="${post.img}" alt="photo"${singleImg ? ' id="p1"' : ""}>` : ""}
    ${post.img2 ? `<img src="${post.img2}" alt="photo">` : ""}
    ${renderBody(post)}
    ${renderRateboxAndEngagement(postId)}
    <br><b id="time">${post.time}</b>
    <hr>
  `;
}



function renderTrends(trends, tickers, polls) {
  renderTicker(tickers);
  renderPolls(polls);

  var trendsEl = document.getElementById("trends");
  if (!trendsEl) return;

  trendsEl.innerHTML =
    '<h1 id="forup">Updates<a href="/trends/"><img id="nxtp-icon" src="pics/nxtpage.png"></a></h1>';

  trends.forEach(function (post) {
    var div = document.createElement("div");
    div.innerHTML = renderPost(post);
    trendsEl.appendChild(div);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
  });
}

showSkeleton("trends", 3);

Promise.all([
  fetch(API + "/tickers").then(function (r) {
    return r.json();
  }),
  fetch(API + "/polls").then(function (r) {
    return r.json();
  }),
  fetch(API + "/articles?category=trends").then(function (r) {
    return r.json();
  }),
])
  .then(function (results) {
    var tickers = results[0].map(function (t) {
      return t.text;
    });
    var polls = results[1];
    var trends = results[2];
    renderTrends(trends, tickers, polls);
  })
  .catch(function (error) {
    console.error("Failed to load trends:", error);
    var trendsEl = document.getElementById("trends");
    if (trendsEl) trendsEl.textContent = "Could not load trends. Please try again later.";
  });