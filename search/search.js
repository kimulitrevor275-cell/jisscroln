(function () {
  var form = document.getElementById("site-search-form");
  var input = document.getElementById("site-search-input");
  var results = document.getElementById("site-search-results");
  var resultsSection = document.getElementById("search-results-section");
  var discovery = document.getElementById("search-discovery");
  var featuredArticles = document.getElementById("featured-articles");
  var featuredSongs = document.getElementById("featured-songs");
  var resultsTitle = document.getElementById("results-title");
  if (!form || !input || !results || !resultsSection || !discovery) return;

  var timer;
  var requestId = 0;
  var activeRequest = null;

  function setSearchView(query) {
    var searching = Boolean(query);
    discovery.hidden = searching;
    resultsSection.hidden = !searching;
    document.querySelector(".search-intro").classList.toggle("is-searching", searching);
    if (searching && resultsTitle) {
      resultsTitle.textContent = 'Results for "' + query + '"';
    }
  }

  function showMessage(message) {
    var paragraph = document.createElement("p");
    paragraph.className = "search-message";
    paragraph.textContent = message;
    results.replaceChildren(paragraph);
    results.setAttribute("aria-busy", "false");
  }

  function safeImageUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      var url = new URL(value, window.location.origin);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function articleCommentsUrl(article) {
    return "/comments/?" + new URLSearchParams({
      post_id: String(article.id),
    }).toString();
  }

  function createCoverPlaceholder(className, text) {
    var placeholder = document.createElement("span");
    placeholder.className = className;
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = text;
    return placeholder;
  }

  function appendCover(container, media, className, placeholderClass, placeholderText) {
    var wrap = document.createElement("span");
    wrap.className = className + "-media-wrap";

    function showPlaceholder(element) {
      var backdrop = wrap.querySelector("." + className + "-backdrop");
      if (backdrop) backdrop.remove();
      var mark = wrap.querySelector("." + className + "-cover-mark");
      if (mark) mark.remove();
      element.replaceWith(createCoverPlaceholder(placeholderClass, placeholderText));
    }

    function createBackdrop(type, url, posterUrl) {
      var backdrop;
      if (type === "video") {
        backdrop = document.createElement("video");
        backdrop.muted = true;
        backdrop.autoplay = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        backdrop.loop = true;
        backdrop.playsInline = true;
        backdrop.preload = "auto";
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.tabIndex = -1;
        if (posterUrl) backdrop.poster = posterUrl;
      } else {
        backdrop = document.createElement("img");
        backdrop.alt = "";
        backdrop.setAttribute("aria-hidden", "true");
      }
      backdrop.className = className + "-backdrop";
      backdrop.src = url;
      backdrop.addEventListener("error", function () {
        if (type === "video" && posterUrl && backdrop.src !== posterUrl) {
          var poster = document.createElement("img");
          poster.className = className + "-backdrop";
          poster.src = posterUrl;
          poster.alt = "";
          poster.setAttribute("aria-hidden", "true");
          poster.addEventListener("error", function () {
            poster.remove();
          }, { once: true });
          backdrop.replaceWith(poster);
          return;
        }
        backdrop.remove();
      }, { once: true });
      wrap.appendChild(backdrop);
    }

    function addCoverMark() {
      var mark = document.createElement("img");
      mark.className = className + "-cover-mark";
      mark.src = "/pics/logog.svg";
      mark.alt = "";
      mark.setAttribute("aria-hidden", "true");
      wrap.appendChild(mark);
    }

    if (media && media.url) {
      if (media.type === "video") {
        var videoUrl = safeImageUrl(media.url);
        if (videoUrl) {
          var posterUrl = media.poster ? safeImageUrl(media.poster) : "";
          var video = document.createElement("video");
          video.className = className + "-video";
          video.src = videoUrl;
          video.muted = true;
          video.autoplay = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          video.loop = true;
          video.playsInline = true;
          video.preload = "metadata";
          video.setAttribute("aria-hidden", "true");
          if (posterUrl) video.poster = posterUrl;
          video.addEventListener("error", function () {
            if (media.poster) {
              var posterUrl = safeImageUrl(media.poster);
              if (posterUrl) {
                var poster = document.createElement("img");
                poster.className = className + "-image";
                poster.src = posterUrl;
                poster.alt = "";
                poster.loading = "lazy";
                poster.addEventListener("error", function () {
                  showPlaceholder(poster);
                }, { once: true });
                video.replaceWith(poster);
                return;
              }
            }
            showPlaceholder(video);
          }, { once: true });
          createBackdrop("video", videoUrl, posterUrl);
          wrap.appendChild(video);
          addCoverMark();
        }
      } else {
        var imageUrl = safeImageUrl(media.url);
        if (imageUrl) {
          var image = document.createElement("img");
          image.className = className + "-image";
          image.src = imageUrl;
          image.alt = "";
          image.loading = "lazy";
          image.addEventListener("error", function () {
            showPlaceholder(image);
          }, { once: true });
          createBackdrop("image", imageUrl, "");
          wrap.appendChild(image);
          addCoverMark();
        }
      }
    }

    if (!wrap.childNodes.length) {
      wrap.appendChild(createCoverPlaceholder(placeholderClass, placeholderText));
    }
    container.appendChild(wrap);
  }

  function resultCard(page, media, categoryText, titleText) {
    var link = document.createElement("a");
    link.className = "search-result-card";
    link.href = page;

    appendCover(
      link,
      media,
      "search-result",
      "search-result-image-placeholder",
      categoryText.toLowerCase().includes("song") ? "♫" : "✦",
    );

    var copy = document.createElement("span");
    copy.className = "search-result-copy";
    var category = document.createElement("span");
    category.className = "search-result-category";
    category.textContent = categoryText;
    var title = document.createElement("span");
    title.className = "search-result-title";
    title.textContent = titleText;
    copy.append(category, title);
    link.appendChild(copy);
    return link;
  }

  function appendSection(fragment, headingText, items, getCard) {
    if (!items.length) return;
    var section = document.createElement("section");
    section.className = "search-result-section";
    var heading = document.createElement("h3");
    heading.textContent = headingText;
    section.appendChild(heading);
    var grid = document.createElement("div");
    grid.className = "search-result-grid";
    items.forEach(function (item) {
      grid.appendChild(getCard(item));
    });
    section.appendChild(grid);
    fragment.appendChild(section);
  }

  function articleCover(article) {
    var media = Array.isArray(article.media) ? article.media : [];
    var video = media.find(function (item) {
      return item && item.type === "video" && item.url;
    });
    var image = media.find(function (item) {
      return item && item.type === "image" && item.url;
    });
    if (video) {
      return { type: "video", url: video.url, poster: image ? image.url : "" };
    }
    if (image) return { type: "image", url: image.url };
    if (article.img) return { type: "image", url: article.img };
    if (article.img2) return { type: "image", url: article.img2 };
    return null;
  }

  function discoveryArticleCard(article) {
    var category = String(article.category || "Story");
    var link = document.createElement("a");
    link.className = "discovery-card";
    link.href = articleCommentsUrl(article);

    appendCover(
      link,
      articleCover(article),
      "discovery-card",
      "discovery-card-image-placeholder",
      "JISSCROL STORIES",
    );

    var copy = document.createElement("span");
    copy.className = "discovery-card-copy";
    var label = document.createElement("span");
    label.className = "discovery-card-category";
    label.textContent = category;
    var title = document.createElement("span");
    title.className = "discovery-card-title";
    title.textContent = String(article.headline || "Untitled story");
    copy.append(label, title);
    link.appendChild(copy);
    return link;
  }

  function discoverySongCard(song, index) {
    var link = document.createElement("a");
    link.className = "song-card";
    link.href = "/others/";

    appendCover(
      link,
      song.img ? { type: "image", url: song.img } : null,
      "song-card",
      "song-card-art-placeholder",
      "♫",
    );

    var copy = document.createElement("span");
    copy.className = "song-card-copy";
    var rank = document.createElement("span");
    rank.className = "song-card-rank";
    rank.textContent = song.rank ? "TRENDING #" + song.rank : "ON REPEAT #" + (index + 1);
    var title = document.createElement("span");
    title.className = "song-card-title";
    title.textContent = String(song.name || "Untitled track");
    var artist = document.createElement("span");
    artist.className = "song-card-artist";
    artist.textContent = String(song.artist || "JisScroL music");
    copy.append(rank, title, artist);
    link.appendChild(copy);
    return link;
  }

  function loadDiscovery() {
    if (!featuredArticles || !featuredSongs) return;
    Promise.allSettled([
      fetch(API + "/articles?category=trends").then(function (response) {
        if (!response.ok) throw new Error("Articles request failed: " + response.status);
        return response.json();
      }),
      fetch(API + "/songs").then(function (response) {
        if (!response.ok) throw new Error("Songs request failed: " + response.status);
        return response.json();
      }),
    ]).then(function (responses) {
      var articlesResult = responses[0];
      if (articlesResult.status === "fulfilled" && Array.isArray(articlesResult.value)) {
        var articleCards = articlesResult.value
          .filter(function (article) {
            return article && typeof article === "object";
          })
          .slice()
          .sort(function (first, second) {
            return Number(Boolean(articleCover(second))) - Number(Boolean(articleCover(first)));
          })
          .slice(0, 6)
          .map(discoveryArticleCard);
        if (articleCards.length) {
          featuredArticles.replaceChildren.apply(featuredArticles, articleCards);
        } else {
          featuredArticles.textContent = "No featured stories right now.";
        }
      } else {
        console.error("Could not load featured stories:", articlesResult.reason);
        featuredArticles.textContent = "Featured stories are unavailable right now.";
      }
      featuredArticles.setAttribute("aria-busy", "false");

      var songsResult = responses[1];
      if (songsResult.status === "fulfilled" && Array.isArray(songsResult.value)) {
        var songCards = songsResult.value
          .filter(function (song) {
            return song && typeof song === "object";
          })
          .slice(0, 4)
          .map(discoverySongCard);
        if (songCards.length) {
          featuredSongs.replaceChildren.apply(featuredSongs, songCards);
        } else {
          featuredSongs.textContent = "No tracks to feature right now.";
        }
      } else {
        console.error("Could not load featured songs:", songsResult.reason);
        featuredSongs.textContent = "Featured music is unavailable right now.";
      }
      featuredSongs.setAttribute("aria-busy", "false");
    });
  }

  function search(query) {
    query = String(query || "").trim().slice(0, 120);
    setSearchView(query);
    if (!query) {
      requestId += 1;
      if (activeRequest) activeRequest.abort();
      activeRequest = null;
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    window.history.replaceState(
      null,
      "",
      window.location.pathname + "?q=" + encodeURIComponent(query),
    );
    var currentRequestId = ++requestId;
    if (activeRequest) activeRequest.abort();
    activeRequest = new AbortController();
    results.setAttribute("aria-busy", "true");
    if (resultsTitle) resultsTitle.textContent = 'Results for "' + query + '"';
    showMessage("Searching...");
    results.setAttribute("aria-busy", "true");

    fetch(API + "/search?q=" + encodeURIComponent(query), {
      signal: activeRequest.signal,
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Search request failed: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (currentRequestId !== requestId) return;
        if (
          !data ||
          !Array.isArray(data.articles) ||
          !Array.isArray(data.stories) ||
          !Array.isArray(data.songs)
        ) {
          throw new Error("Search returned an invalid response.");
        }

        var fragment = document.createDocumentFragment();
        appendSection(fragment, "Articles", data.articles, function (article) {
          var category = String(article.category || "article");
          return resultCard(
            articleCommentsUrl(article),
            articleCover(article),
            category,
            String(article.headline || "Untitled article"),
          );
        });

        appendSection(fragment, "Stories", data.stories, function (story) {
          return resultCard(
            "/others/",
            story.img ? { type: "image", url: story.img } : null,
            String(story.cat || "Story"),
            String(story.title || "Untitled story"),
          );
        });

        appendSection(fragment, "Songs", data.songs, function (song) {
          return resultCard(
            "/others/",
            song.img ? { type: "image", url: song.img } : null,
            song.rank ? "#" + String(song.rank) : "Song",
            [song.name, song.artist].filter(Boolean).map(String).join(" — ") ||
              "Untitled song",
          );
        });

        if (!fragment.childNodes.length) {
          showMessage("No results for “" + query + "”.");
          return;
        }
        results.replaceChildren(fragment);
        results.setAttribute("aria-busy", "false");
      })
      .catch(function (error) {
        if (currentRequestId !== requestId || error.name === "AbortError") return;
        console.error("Search failed:", error);
        showMessage("Search is unavailable. Please try again.");
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearTimeout(timer);
    search(input.value);
  });

  input.addEventListener("input", function () {
    clearTimeout(timer);
    var query = input.value.trim();
    if (!query) {
      search("");
      return;
    }
    timer = setTimeout(function () {
      search(query);
    }, 300);
  });

  var initialQuery = new URLSearchParams(window.location.search).get("q") || "";
  if (initialQuery) {
    input.value = initialQuery;
    search(initialQuery);
  } else {
    setSearchView("");
    loadDiscovery();
  }
})();
