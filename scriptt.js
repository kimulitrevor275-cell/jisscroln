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

function getHomeNewsSafeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    var url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch (error) {
    console.warn("Invalid Uganda news URL:", error);
    return "";
  }
}

function getHomeNewsCommentsUrl(article) {
  var sourceUrl = getHomeNewsSafeUrl(article.link || article.url);
  var imageUrl = getHomeNewsSafeUrl(article.image || article.urlToImage);
  var title = String(article.title || article.headline || "Untitled");
  var value = sourceUrl + "|" + title;
  var first = 0x811c9dc5;
  var second = 0x9e3779b9;

  for (var index = 0; index < value.length; index += 1) {
    var code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b);
  }

  var postId = "uganda-news-" +
    (first >>> 0).toString(16).padStart(8, "0") +
    (second >>> 0).toString(16).padStart(8, "0");
  var source = article.source && typeof article.source === "object"
    ? article.source.name
    : article.source;
  var content = String(
    article.description || article.summary || article.content || article.popularity || ""
  ).replace(/\s*\[\+\d+\s+chars\]\s*$/, "");
  var params = new URLSearchParams({
    news: "uganda",
    post_id: postId,
    headline: title,
    source: String(source || "Unknown"),
    image: imageUrl,
    source_url: sourceUrl,
    content: content
  });
  return "/comments/?" + params.toString();
}

function renderHomeUgandaNews(anchor) {
  var backend = "https://jisscrol-opinions.onrender.com";
  var section = document.createElement("section");
  section.className = "home-uganda-news news-section-permanent";
  section.setAttribute("aria-label", "Uganda headlines");
  section.innerHTML = `
    <h2>Uganda Headlines</h2>
    <div class="news-module" aria-busy="true">
      ${Array.from({ length: 3 }, function () {
        return `<div class="news-headline-skeleton" aria-hidden="true">
          <div class="news-skeleton-image"></div>
          <div class="news-skeleton-content">
            <div class="news-skeleton-line"></div>
            <div class="news-skeleton-line news-skeleton-line-short"></div>
            <div class="news-skeleton-meta"></div>
          </div>
        </div>`;
      }).join("")}
    </div>`;

  if (anchor && anchor.parentNode) {
    anchor.insertAdjacentElement("afterend", section);
  } else {
    var trends = document.getElementById("trends");
    if (trends) trends.appendChild(section);
  }

  fetch(backend + "/news/uganda")
    .then(function (response) {
      if (!response.ok) throw new Error("News request failed: " + response.status);
      return response.json();
    })
    .then(function (data) {
      var articles = Array.isArray(data.articles) ? data.articles.slice(0, 6) : [];
      var newsModule = section.querySelector(".news-module");
      if (!newsModule) return;
      if (!articles.length) {
        newsModule.textContent = "No Uganda headlines available.";
        newsModule.setAttribute("aria-busy", "false");
        return;
      }

      newsModule.innerHTML = articles.map(function (article) {
        var imageUrl = getHomeNewsSafeUrl(article.image || article.urlToImage);
        var sourceUrl = getHomeNewsSafeUrl(article.link || article.url);
        var source = article.source && typeof article.source === "object"
          ? article.source.name
          : article.source;
        source = String(source || "Unknown").trim();
        var meta = [
          "Category: Uganda",
          "Source: " + (sourceUrl
            ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a>`
            : escapeHtml(source))
        ].filter(Boolean);
        return `<article class="news-headline-card" role="link" tabindex="0" data-comments-url="${escapeHtml(getHomeNewsCommentsUrl(article))}">
          ${imageUrl ? `<img class="news-headline-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy">` : ""}
          <div class="news-headline-content">
            <h3 class="news-headline-title">${escapeHtml(article.title || article.headline || "Untitled")}</h3>
            <div class="news-headline-meta">
              ${meta.map(function (label) {
                return "<span>" + label + "</span>";
              }).join("")}
            </div>
          </div>
        </article>`;
      }).join("");
      newsModule.setAttribute("aria-busy", "false");
    })
    .catch(function (error) {
      console.error("Failed to load Uganda headlines:", error);
      var newsModule = section.querySelector(".news-module");
      if (newsModule) {
        newsModule.textContent = "Could not load Uganda headlines. Please try again later.";
        newsModule.setAttribute("aria-busy", "false");
      }
    });
}

document.addEventListener("click", function (event) {
  var target = event.target;
  if (!(target instanceof Element) || target.closest("a")) return;
  var card = target.closest(".news-headline-card");
  if (card && card.dataset.commentsUrl) {
    window.location.href = card.dataset.commentsUrl;
  }
});

document.addEventListener("keydown", function (event) {
  if ((event.key !== "Enter" && event.key !== " ") || !(event.target instanceof Element)) return;
  var card = event.target.closest(".news-headline-card");
  if (!card || event.target.closest("a")) return;
  event.preventDefault();
  window.location.href = card.dataset.commentsUrl;
});

function renderPost(post) {
  var postId = post.id;

  return `
    ${post.label && String(post.label).trim() ? `<b id="label">${post.label}</b>` : ""}
    <h2>${post.headline}${post.link ? ` <a href="${post.link}" target="_blank" rel="noopener">view↗</a>` : ""}</h2>
    ${renderArticleImages(post)}
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

  var newsPosition = Math.min(trends.length, 2);
  var newsInserted = false;
  var newsAnchor = null;
  trends.forEach(function (post, index) {
    var div = document.createElement("div");
    div.setAttribute("data-comments-post-id", post.id);
    div.innerHTML = renderPost(post);
    trendsEl.appendChild(div);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions

    if (index + 1 === newsPosition) {
      newsAnchor = div;
      renderHomeUgandaNews(newsAnchor);
      newsInserted = true;
    }
  });

  if (!newsInserted) {
    renderHomeUgandaNews(newsAnchor);
  }
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