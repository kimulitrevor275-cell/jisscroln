// Needs jis.js loaded first
// (API, showSkeleton, renderBody, attachSeeMore, renderRateboxAndEngagement, initEngagement)

fetch(API + "/").catch(function () {});
var trendsNewsArticles = [];

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
    ${post.time ? `<b id="time">${post.time}</b>` : ""}
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
  renderTrendsNewsInFeed();
}

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

function renderTrendsNewsInFeed() {
  const content = document.getElementById('content');
  if (!content) return;

  content.querySelectorAll('[data-news-feed-item]').forEach(item => item.remove());
  const posts = Array.from(content.querySelectorAll(':scope > [data-comments-post-id]:not([data-news-feed-item])'));
  let newsIndex = 0;
  posts.forEach((post, index) => {
    if (index % 2 !== 0 || newsIndex >= trendsNewsArticles.length) return;
    post.insertAdjacentElement('afterend', createTrendsNewsCard(trendsNewsArticles[newsIndex++]));
  });
  while (newsIndex < trendsNewsArticles.length) {
    content.appendChild(createTrendsNewsCard(trendsNewsArticles[newsIndex++]));
  }
}

function createTrendsNewsCard(article) {
  const imageUrl = getSafeNewsUrl(article.image || article.urlToImage);
  const sourceUrl = getSafeNewsUrl(article.link || article.url);
  const commentsUrl = getNewsCommentsUrl(article);
  const card = document.createElement('article');
  card.className = 'post-card news-story-card';
  card.setAttribute('role', 'link');
  card.tabIndex = 0;
  card.setAttribute('data-news-feed-item', '');
  card.setAttribute('data-comments-post-id', new URL(commentsUrl, window.location.origin).searchParams.get('post_id'));
  card.setAttribute('data-comments-url', commentsUrl);

  const title = document.createElement('h2');
  title.className = 'news-story-title';
  title.textContent = getNewsTitle(article);
  card.appendChild(title);
  if (imageUrl !== '#') {
    const image = document.createElement('img');
    image.className = 'news-story-image';
    image.src = imageUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove(), { once: true });
    card.appendChild(image);
  }
  const summaryText = getNewsContent(article).trim();
  if (summaryText) {
    const summary = document.createElement('p');
    summary.className = 'news-story-summary';
    summary.textContent = summaryText;
    card.appendChild(summary);
  }
  const source = document.createElement('p');
  source.className = 'news-story-source';
  source.appendChild(document.createTextNode('Source: ' + getNewsSource(article)));
  if (sourceUrl !== '#') {
    const sourceLink = document.createElement('a');
    sourceLink.href = sourceUrl;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = 'Read full story';
    source.append(' · ', sourceLink);
  }
  card.appendChild(source);
  return card;
}

document.addEventListener('click', function (event) {
  if (!(event.target instanceof Element) || event.target.closest('a')) return;
  const card = event.target.closest('.news-story-card, .news-headline-card, .news-card-compact');
  if (!card || !card.dataset.commentsUrl) return;
  window.location.href = card.dataset.commentsUrl;
});

document.addEventListener('keydown', function (event) {
  if ((event.key !== 'Enter' && event.key !== ' ') || !(event.target instanceof Element)) return;
  const card = event.target.closest('.news-story-card, .news-headline-card, .news-card-compact');
  if (!card || event.target.closest('a')) return;
  event.preventDefault();
  card.click();
});

async function renderNewsModulePermanent() {
  const container = document.getElementById('uganda-news');
  if (!container) return;
  container.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(`${BACKEND}/news/uganda`);
    if (!response.ok) throw new Error(`News request failed: ${response.status}`);
    const { articles } = await response.json();
    
    if (!Array.isArray(articles) || articles.length === 0) {
      trendsNewsArticles = [];
      renderTrendsNewsInFeed();
      container.textContent = 'No news';
      container.setAttribute('aria-busy', 'false');
      return;
    }

    const renderHeadlineCard = (article, isDuplicate) => {
      const imageUrl = getSafeNewsUrl(article.image || article.urlToImage);
      const sourceUrl = getSafeNewsUrl(article.link || article.url);
      const source = getNewsSource(article);
      const sourceMarkup = sourceUrl !== '#'
        ? `<a href="${escapeHtml(sourceUrl)}" tabindex="${isDuplicate ? '-1' : '0'}" target="_blank" rel="noopener noreferrer">${escapeHtml(source)}</a>`
        : escapeHtml(source);
      return `
        <article class="news-headline-card" role="link" tabindex="${isDuplicate ? '-1' : '0'}" ${isDuplicate ? 'aria-hidden="true"' : ''} data-comments-url="${escapeHtml(getNewsCommentsUrl(article))}">
          ${imageUrl !== '#' ? `<img class="news-headline-image" src="${escapeHtml(imageUrl)}" alt="" loading="lazy">` : ''}
          <div class="news-headline-content">
            <h3 class="news-headline-title">${escapeHtml(getNewsTitle(article))}</h3>
            <div class="news-headline-meta"><span>Source: ${sourceMarkup}</span></div>
          </div>
        </article>
      `;
    };
    const visibleArticles = articles.filter(article =>
      getSafeNewsUrl(article.image || article.urlToImage) !== '#'
    );
    trendsNewsArticles = visibleArticles;
    renderTrendsNewsInFeed();
    if (!visibleArticles.length) {
      container.textContent = 'No image headlines available.';
      container.setAttribute('aria-busy', 'false');
      return;
    }

    const pages = [];
    for (let index = 0; index < visibleArticles.length; index += 3) {
      pages.push(visibleArticles.slice(index, index + 3));
    }
    const renderPage = (page, isDuplicate) => `
      <div class="news-page"${isDuplicate ? ' aria-hidden="true"' : ''}>
        ${page.map(article => renderHeadlineCard(article, isDuplicate)).join('')}
      </div>
    `;
    const duplicatePages = pages.length > 1
      ? pages.map(page => renderPage(page, true)).join('')
      : '';
    container.innerHTML = `
      <div class="news-module" role="region" aria-label="Uganda news headlines" tabindex="0">
        <div class="news-track">${pages.map(page => renderPage(page, false)).join('')}${duplicatePages}</div>
      </div>
    `;
    container.setAttribute('aria-busy', 'false');

    if (pages.length > 1) {
      const newsModule = container.querySelector('.news-module');
      const headlinePages = Array.from(newsModule.querySelectorAll('.news-page'));
      let paused = false;
      const getCurrentPage = () => headlinePages.reduce((closestIndex, page, index) => {
        const closestDistance = Math.abs(headlinePages[closestIndex].offsetLeft - newsModule.scrollLeft);
        const pageDistance = Math.abs(page.offsetLeft - newsModule.scrollLeft);
        return pageDistance < closestDistance ? index : closestIndex;
      }, 0);
      const timer = window.setInterval(() => {
        if (paused || document.hidden) return;
        const currentPage = getCurrentPage();
        if (currentPage >= pages.length - 1) {
          newsModule.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          newsModule.scrollTo({ left: headlinePages[currentPage + 1].offsetLeft, behavior: 'smooth' });
        }
      }, 8000);
      newsModule.addEventListener('pointerenter', () => { paused = true; });
      newsModule.addEventListener('pointerleave', () => { paused = false; });
      newsModule.addEventListener('pointerdown', () => { paused = true; });
      newsModule.addEventListener('pointerup', () => {
        window.setTimeout(() => { paused = false; }, 2500);
      });
      newsModule.addEventListener('focusin', () => { paused = true; });
      newsModule.addEventListener('focusout', event => {
        if (!newsModule.contains(event.relatedTarget)) paused = false;
      });
      window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });
    }

  } catch (error) {
    console.error('News fetch error:', error);
    container.textContent = `Sorry we couldn't  load Uganda headlines. Please try again later.`;
    container.setAttribute('aria-busy', 'false');
    trendsNewsArticles = [];
    renderTrendsNewsInFeed();
  }
}

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

async function renderArticlesFeed(articles) {
  const container = document.getElementById('articles-container');
  const newsCards = await getNewsCardsForInterrupt();
  let newsIndex = 0;

  let html = '';
  articles.forEach((article, index) => {
    html += `<!-- your article card HTML -->`;
    
    if ((index + 1) % 3 === 0 && newsIndex < newsCards.length) {
      html += newsCards[newsIndex];
      newsIndex++;
    }
  });

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNewsModulePermanent();
});