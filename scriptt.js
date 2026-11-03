
fetch(API + "/").catch(function () {});
setInterval(
  function () {
    fetch(API + "/").catch(function () {});
  },
  5 * 60 * 1000,
);
function renderTicker(tickers) {
  var tickerEl = document.getElementById("ticker");
  if (!tickerEl) return;
  tickerEl.innerHTML = "";
  if (!Array.isArray(tickers) || !tickers.length) return;

  var wrap = tickerEl.parentElement;

  function buildGroup() {
    var group = document.createElement("div");
    group.className = "ticker-group";
    tickers.forEach(function (t) {
      var span = document.createElement("span");
      span.textContent = t;
      group.appendChild(span);
    });
    return group;
  }

  var group = buildGroup();
  tickerEl.appendChild(group);

  
  var guard = 0;
  while (group.offsetWidth < wrap.offsetWidth && guard++ < 10) {
    tickers.forEach(function (t) {
      var span = document.createElement("span");
      span.textContent = t;
      group.appendChild(span);
    });
  }

  var copy = group.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  tickerEl.appendChild(copy);

  
  var seconds = Math.max(15, group.offsetWidth / 60);
  tickerEl.style.setProperty("--ticker-duration", seconds + "s");
}

function renderPolls(polls) {
  var wrap = document.getElementById("polls");
  var dots = document.getElementById("pDots");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (dots) dots.innerHTML = "";

  if (!Array.isArray(polls) || !polls.length) {
    var box = wrap.closest(".jisscrolpolls");
    if (box) box.hidden = true;          
    return;
  }

  polls.forEach(function (poll, i) {
    var card = document.createElement(poll.link ? "a" : "div");
    card.className = "poll-card";
    if (poll.link) card.href = poll.link;

    if (poll.img) {
      var img = document.createElement("img");
      img.src = poll.img;
      img.alt = "";
      img.loading = "lazy";
      card.appendChild(img);
    }
    if (poll.text) {
      var h5 = document.createElement("h5");
      h5.className = "polltext";
      h5.textContent = poll.text;
      card.appendChild(h5);
    }
    wrap.appendChild(card);

    if (dots) {
      var dot = document.createElement("div");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dots.appendChild(dot);
    }
  });

  // connect the dots AFTER the cards exist
  bindDots(
    document.querySelector(".jisscrolpolls"),
    ".poll-card",
    document.querySelectorAll("#pDots .dot")
  );
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
    <h2 class="news-story-section-title">Today - What's happening</h2>
    <div class="news-module is-loading" aria-busy="true">
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

  var trends = document.getElementById("trends");
  var mainHeading = trends && trends.querySelector("h1");
  if (anchor && anchor.parentNode) anchor.insertAdjacentElement("afterend", section);
  else if (mainHeading) mainHeading.insertAdjacentElement("afterend", section);
  else if (trends) trends.prepend(section);

  fetch(backend + "/news/uganda")
    .then(function (response) {
      if (!response.ok) throw new Error("News request failed: " + response.status);
      return response.json();
    })
    .then(function (data) {
      var articles = Array.isArray(data.articles) ? data.articles.filter(function (article) {
        return Boolean(getHomeNewsSafeUrl(article.image || article.urlToImage));
      }) : [];
      var newsModule = section.querySelector(".news-module");
      if (!newsModule) return;
      if (!articles.length) {
        newsModule.textContent = "No image headlines available.";
        newsModule.classList.remove("is-loading");
        newsModule.setAttribute("aria-busy", "false");
        return;
      }

      function renderHeadlineCard(article, isDuplicate) {
        var imageUrl = getHomeNewsSafeUrl(article.image || article.urlToImage);
        var sourceUrl = getHomeNewsSafeUrl(article.link || article.url);
        var source = article.source && typeof article.source === "object"
          ? article.source.name
          : article.source;
        source = String(source || "Unknown").trim();
        return `<article class="news-headline-card" role="link" tabindex="${isDuplicate ? "-1" : "0"}" ${isDuplicate ? 'aria-hidden="true"' : ""} data-comments-url="${escapeHtml(getHomeNewsCommentsUrl(article))}">
          <img class="news-headline-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy">
          <div class="news-headline-content">
            <h3 class="news-headline-title">${escapeHtml(article.title || article.headline || "Untitled")}</h3>
            <div class="news-headline-meta"><span>Source: ${sourceUrl
              ? `<a href="${escapeHtml(sourceUrl)}" tabindex="${isDuplicate ? "-1" : "0"}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a>`
              : escapeHtml(source)}</span></div>
          </div>
        </article>`;
      }

      var pages = [];
      for (var index = 0; index < articles.length; index += 3) {
        pages.push(articles.slice(index, index + 3));
      }
      var renderPage = function (page, isDuplicate) {
        return `<div class="news-page"${isDuplicate ? ' aria-hidden="true"' : ""}>` +
          page.map(function (article) { return renderHeadlineCard(article, isDuplicate); }).join("") +
          "</div>";
      };
      newsModule.classList.remove("is-loading");
      newsModule.outerHTML = `<div class="news-module" role="region" aria-label="Uganda news headlines" tabindex="0"><div class="news-track">${pages.map(function (page) { return renderPage(page, false); }).join("")}${pages.length > 1 ? pages.map(function (page) { return renderPage(page, true); }).join("") : ""}</div></div>`;
      newsModule = section.querySelector(".news-module");
      newsModule.setAttribute("aria-busy", "false");
      if (pages.length > 1) {
        var headlinePages = Array.from(newsModule.querySelectorAll(".news-page"));
        var paused = false;
        var timer = window.setInterval(function () {
          if (paused || document.hidden) return;
          var moduleLeft = newsModule.getBoundingClientRect().left + newsModule.clientLeft;
          var getPageLeft = function (page) {
            return newsModule.scrollLeft + page.getBoundingClientRect().left - moduleLeft;
          };
          var current = headlinePages.reduce(function (closest, page, pageIndex) {
            return Math.abs(getPageLeft(page) - newsModule.scrollLeft) <
              Math.abs(getPageLeft(headlinePages[closest]) - newsModule.scrollLeft)
              ? pageIndex : closest;
          }, 0);
          if (current >= pages.length - 1) newsModule.scrollTo({ left: 0, behavior: "auto" });
          else newsModule.scrollTo({ left: getPageLeft(headlinePages[current + 1]), behavior: "smooth" });
        }, 8000);
        newsModule.addEventListener("pointerenter", function () { paused = true; });
        newsModule.addEventListener("pointerleave", function () { paused = false; });
        newsModule.addEventListener("focusin", function () { paused = true; });
        newsModule.addEventListener("focusout", function (event) {
          if (!newsModule.contains(event.relatedTarget)) paused = false;
        });
        window.addEventListener("pagehide", function () { window.clearInterval(timer); }, { once: true });
      }

      renderHomeNewsInFeed(articles);
    })
    .catch(function (error) {
      console.error("Failed to load Uganda headlines:", error);
      var newsModule = section.querySelector(".news-module");
      if (newsModule) {
        newsModule.textContent = "Could not load Uganda headlines. Please try again later.";
        newsModule.classList.remove("is-loading");
        newsModule.setAttribute("aria-busy", "false");
      }
    });
}

function renderHomeNewsInFeed(articles) {
  var trends = document.getElementById("trends");
  if (!trends) return;

  trends.querySelectorAll("[data-news-feed-item]").forEach(function (item) { item.remove(); });
  var posts = Array.from(trends.querySelectorAll("[data-comments-post-id]:not([data-news-feed-item])"));
  var newsIndex = 0;
  posts.forEach(function (post, index) {
    if (index % 2 !== 0 || newsIndex >= articles.length) return;
    post.insertAdjacentElement("afterend", createHomeNewsCard(articles[newsIndex++]));
  });
  while (newsIndex < articles.length) trends.appendChild(createHomeNewsCard(articles[newsIndex++]));
}

function createHomeNewsCard(article) {
  var imageUrl = getHomeNewsSafeUrl(article.image || article.urlToImage);
  var sourceUrl = getHomeNewsSafeUrl(article.link || article.url);
  var source = article.source && typeof article.source === "object" ? article.source.name : article.source;
  var commentsUrl = getHomeNewsCommentsUrl(article);
  var card = document.createElement("article");
  card.className = "post-card news-story-card";
  card.setAttribute("role", "link");
  card.tabIndex = 0;
  card.setAttribute("data-news-feed-item", "");
  card.setAttribute("data-comments-post-id", new URL(commentsUrl, window.location.origin).searchParams.get("post_id"));
  card.setAttribute("data-comments-url", commentsUrl);
  var title = document.createElement("h2");
  title.className = "news-story-title";
  title.textContent = String(article.title || article.headline || "Untitled");
  card.appendChild(title);
  if (imageUrl) {
    var image = document.createElement("img");
    image.className = "news-story-image";
    image.src = imageUrl;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", function () { image.remove(); }, { once: true });
    card.appendChild(image);
  }
  var summaryText = String(
    article.description || article.summary || article.content || article.popularity || ""
  ).replace(/\s*\[\+\d+\s+chars\]\s*$/, "").trim();
  if (summaryText) {
    var summary = document.createElement("p");
    summary.className = "news-story-summary";
    summary.textContent = summaryText;
    card.appendChild(summary);
  }
  var sourceRow = document.createElement("p");
  sourceRow.className = "news-story-source";
  sourceRow.appendChild(document.createTextNode("Source: " + String(source || "Unknown")));
  if (sourceUrl) {
    var sourceLink = document.createElement("a");
    sourceLink.href = sourceUrl;
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = "Read full story";
    sourceRow.append(" · ", sourceLink);
  }
  card.appendChild(sourceRow);
  return card;
}

document.addEventListener("click", function (event) {
  var target = event.target;
  if (!(target instanceof Element) || target.closest("a")) return;
  var card = target.closest(".news-headline-card, .news-story-card");
  if (card && card.dataset.commentsUrl) {
    window.location.href = card.dataset.commentsUrl;
  }
});

document.addEventListener("keydown", function (event) {
  if ((event.key !== "Enter" && event.key !== " ") || !(event.target instanceof Element)) return;
  var card = event.target.closest(".news-headline-card, .news-story-card");
  if (!card || event.target.closest("a")) return;
  event.preventDefault();
  window.location.href = card.dataset.commentsUrl;
});

function renderPost(post) {
  var postId = post.id;

  return `
    ${post.label && String(post.label).trim() ? `<b id="label">${post.label}</b>` : ""}
    <h2 class ="headlines">${post.headline}${post.link ? ` <a href="${post.link}" target="_blank" rel="noopener">view↗</a>` : ""}</h2>
    ${renderArticleImages(post)}
    ${renderBody(post)}
    ${renderRateboxAndEngagement(postId)}
    <b id="time">${post.time}</b>
    <hr>
  `;
}



function renderTrends(trends, tickers, polls) {
  renderTicker(tickers);
  renderPolls(polls);

  var trendsEl = document.getElementById("trends");
  if (!trendsEl) return;

  trendsEl.innerHTML =
    `<h1 id="forup">
    Updates<a href="/trends/">
    <img id="nxtp-icon" src="pics/nxtpage.png"></a>
    </h1>`;

  var newsAnchor = null;
  trends.forEach(function (post, index) {
    var div = document.createElement("div");
    div.setAttribute("data-comments-post-id", post.id);
    div.innerHTML = renderPost(post);
    trendsEl.appendChild(div);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
    if (index === 1) newsAnchor = div;
  });

  renderHomeUgandaNews(newsAnchor);
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

  function bindDots(scroller, itemSelector, dots) {
  if (!scroller || !dots.length) return;

  const items = () => Array.from(scroller.querySelectorAll(itemSelector));
  let waiting = false;

  function update() {
    waiting = false;
    const left = scroller.getBoundingClientRect().left;
    let best = 0;
    let bestDist = Infinity;
    items().forEach((el, i) => {
      const dist = Math.abs(el.getBoundingClientRect().left - left);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === best));
  }

  scroller.addEventListener('scroll', () => {
    if (!waiting) { waiting = true; requestAnimationFrame(update); }
  }, { passive: true });

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    const el = items()[i];
    if (!el) return;
    const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
if (atEnd) best = items().length - 1;
  }));
}

bindDots(
  document.querySelector('.polls'),
  '.polls',
  document.querySelectorAll('#pDots .dot')
);

bindDots(
  document.querySelector('.polls'),
  '[id^="polli"]',
  document.querySelectorAll('#pDots .dot')
);
bindDots(
  document.querySelector('.jisscrolpolls'),
  '[id^="poll"]',
  document.querySelectorAll('#pDots .dot')
);