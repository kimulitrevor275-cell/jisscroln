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

  return `
    ${post.label && String(post.label).trim() ? `<b id="label">${post.label}</b>` : ""}
    <h2>${post.headline || ""}${
      post.link
        ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view ↗</a>`
        : ""
    }</h2>
    ${renderArticleImages(post)}
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
    article.setAttribute("data-comments-post-id", post.id);
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
  const BACKEND = 'https://jisscrol-opinions.onrender.com';

function getSafeNewsUrl(link) {
  if (typeof link !== 'string' || !link.trim()) return '#';
  try {
    const url = new URL(link);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '#';
  } catch (error) {
    console.warn('Invalid Uganda news link:', error);
    return '#';
  }
}

function getNewsDiscussionId(article, sourceUrl) {
  const value = sourceUrl + '|' + String(article.title || '');
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193);
    second = Math.imul(second ^ code, 0x85ebca6b);
  }
  return 'uganda-news-' +
    (first >>> 0).toString(16).padStart(8, '0') +
    (second >>> 0).toString(16).padStart(8, '0');
}

function getNewsTitle(article) {
  return String(article.title || article.headline || 'Untitled');
}

function getNewsSource(article) {
  const source = article.source;
  if (source && typeof source === 'object') {
    return String(source.name || 'Unknown').trim();
  }
  return String(source || 'Unknown').trim();
}

function getNewsContent(article) {
  return String(
    article.description ||
    article.summary ||
    article.content ||
    article.popularity ||
    ''
  ).replace(/\s*\[\+\d+\s+chars\]\s*$/, '');
}

function getNewsCommentsUrl(article) {
  const sourceUrl = getSafeNewsUrl(article.link || article.url);
  const imageUrl = getSafeNewsUrl(article.image || article.urlToImage);
  const params = new URLSearchParams({
    news: 'uganda',
    post_id: getNewsDiscussionId(article, sourceUrl),
    headline: getNewsTitle(article),
    source: getNewsSource(article) || 'Unknown',
    image: imageUrl === '#' ? '' : imageUrl,
    source_url: sourceUrl === '#' ? '' : sourceUrl,
    content: getNewsContent(article)
  });
  return '/comments/?' + params.toString();
}

document.addEventListener('click', function (event) {
  if (!(event.target instanceof Element) || event.target.closest('a')) return;
  const card = event.target.closest('.news-headline-card, .news-card-compact');
  if (!card || !card.dataset.commentsUrl) return;
  window.location.href = card.dataset.commentsUrl;
});

document.addEventListener('keydown', function (event) {
  if ((event.key !== 'Enter' && event.key !== ' ') || !(event.target instanceof Element)) return;
  const card = event.target.closest('.news-headline-card, .news-card-compact');
  if (!card || event.target.closest('a')) return;
  event.preventDefault();
  card.click();
});

// Permanent section at top
async function renderNewsModulePermanent() {
  const container = document.getElementById('uganda-news');
  if (!container) return;
  container.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(`${BACKEND}/news/uganda`);
    if (!response.ok) throw new Error(`News request failed: ${response.status}`);
    const { articles } = await response.json();
    
    if (!Array.isArray(articles) || articles.length === 0) {
      container.textContent = 'No news';
      container.setAttribute('aria-busy', 'false');
      return;
    }

    container.innerHTML = `
      <div class="news-module">
        ${articles.slice(0, 6)
          .map(article => {
            const imageUrl = getSafeNewsUrl(article.image || article.urlToImage);
            const sourceUrl = getSafeNewsUrl(article.link || article.url);
            const source = getNewsSource(article);
            const meta = [
              'Category: Uganda',
              `Source: ${sourceUrl !== '#'
                ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a>`
                : escapeHtml(source)}`
            ].filter(Boolean);
            return `
            <article class="news-headline-card" role="link" tabindex="0" data-comments-url="${escapeHtml(getNewsCommentsUrl(article))}">
              ${imageUrl !== '#' ? `<img class="news-headline-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy">` : ''}
              <div class="news-headline-content">
                <h3 class="news-headline-title">${escapeHtml(getNewsTitle(article))}</h3>
                <div class="news-headline-meta">
                  ${meta.map(label => `<span>${label}</span>`).join('')}
                </div>
              </div>
            </article>
          `;
          }).join('')}
      </div>
    `;
    container.setAttribute('aria-busy', 'false');
  } catch (error) {
    console.error('News fetch error:', error);
    container.textContent = 'Could not load Uganda headlines. Please try again later.';
    container.setAttribute('aria-busy', 'false');
  }
}

// Compact card for interrupting articles
async function getNewsCardsForInterrupt() {
  try {
    const response = await fetch(`${BACKEND}/news/uganda`);
    const { articles } = await response.json();
    
    return articles.filter(a => a.image || a.urlToImage).slice(0, 3).map(article => `
      <article class="news-card-compact" role="link" tabindex="0" data-comments-url="${escapeHtml(getNewsCommentsUrl(article))}">
        <img src="${escapeHtml(getSafeNewsUrl(article.image || article.urlToImage))}" alt="">
        <div class="news-card-compact-detail">
        <div class="news-card-compact-title">${escapeHtml(getNewsTitle(article))}</div>
        <div class="news-card-compact-source">Source: ${getSafeNewsUrl(article.link || article.url) !== '#'
          ? `<a href="${escapeHtml(getSafeNewsUrl(article.link || article.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(getNewsSource(article))}</a>`
          : escapeHtml(getNewsSource(article))}</div>
        </div>
      </article>
    `);
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}

// When rendering articles
async function renderArticlesFeed(articles) {
  const container = document.getElementById('articles-container');
  const newsCards = await getNewsCardsForInterrupt();
  let newsIndex = 0;

  let html = '';
  articles.forEach((article, index) => {
    html += `<!-- your article card HTML -->`;
    
    // Insert news card every 3 articles
    if ((index + 1) % 3 === 0 && newsIndex < newsCards.length) {
      html += newsCards[newsIndex];
      newsIndex++;
    }
  });

  container.innerHTML = html;
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
  renderNewsModulePermanent();
  // renderArticlesFeed(articles); // Call with your articles data
});