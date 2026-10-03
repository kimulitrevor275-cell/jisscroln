// ─────────────────────────────────────────
//  SUPABASE
// ─────────────────────────────────────────

var sb = supabase.createClient(
  "https://jzspezkljbxocqboqgtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c3BlemtsamJ4b2NxYm9xZ3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTU4MjMsImV4cCI6MjA5Mjg5MTgyM30.VXZ4ZX9_z33ZKrWUbhs2EXKruTi1kp5IpLuGLykF1y0",
);

var LIGHT_MODE_STORAGE_KEY = "jisscrol-light-mode";

function setLightMode(enabled) {
  document.documentElement.classList.toggle("light-mode", enabled);
  localStorage.setItem(LIGHT_MODE_STORAGE_KEY, enabled ? "true" : "false");
}

if (localStorage.getItem(LIGHT_MODE_STORAGE_KEY) === "true") {
  document.documentElement.classList.add("light-mode");
}

function handleLightModeInput(event) {
  var toggle = event.target.closest("#lightmode");
  if (!toggle) return;

  if (event.type === "keydown") {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
  }

  var enabled = !document.documentElement.classList.contains("light-mode");
  setLightMode(enabled);
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.setAttribute(
    "aria-label",
    enabled ? "Switch to dark mode" : "Switch to light mode",
  );
}

var existingLightModeToggle = document.getElementById("lightmode");
if (existingLightModeToggle) {
  var lightModeEnabled =
    document.documentElement.classList.contains("light-mode");
  existingLightModeToggle.setAttribute("aria-pressed", String(lightModeEnabled));
  existingLightModeToggle.setAttribute(
    "aria-label",
    lightModeEnabled ? "Switch to dark mode" : "Switch to light mode",
  );
}

if (!window._lightModeListenersInitialized) {
  document.addEventListener("click", handleLightModeInput);
  document.addEventListener("keydown", handleLightModeInput);
  window._lightModeListenersInitialized = true;
}

// ─────────────────────────────────────────
//  AUTH HELPERS
// ─────────────────────────────────────────

function getGreeting() {
  var h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function signOut() {
  sb.auth.signOut().then(function () {
    window.location.href = "index.html";
  });
}

function _makeBadge(tier, size) {
  size = size || 18;
  var colors = { veteran: "#c9a96e", loyal: "#4a90d9", regular: "#87ceeb" };
  var color = colors[tier];
  if (!color) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="vertical-align:middle;">
    <circle cx="12" cy="12" r="12" fill="${color}"/>
    <path d="M6.5 12.5l3.5 3.5 7-7" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ─────────────────────────────────────────
//  SESSION
// ─────────────────────────────────────────
var username = sessionStorage.getItem("jis_username") || "Anonymous";

function lightModeToggleMarkup(greetingElement) {
  var toggle = document.getElementById("lightmode");
  if (toggle && !greetingElement.contains(toggle)) return "";

  return `<img id="lightmode" src="/pics/lm.png" alt="Toggle light mode" role="button" tabindex="0" aria-pressed="${document.documentElement.classList.contains("light-mode")}">`;
}

sb.auth.getSession().then(function (r) {
  var el = document.getElementById("user-greeting");

  if (r.data.session) {
    var u = r.data.session.user;
    var name = (u.user_metadata && u.user_metadata.display_name) || u.email;
    var uid = u.id;

    window._cachedUsername = name;
    window._cachedUserId = uid;
    sessionStorage.setItem("jis_username", name);
    sessionStorage.setItem("jis_uid", uid);

    if (el) {
      el.innerHTML = `${getGreeting()}, ${name} <a href="#" onclick="signOut()" style="color:gray;font-size:25px; margin:0"></a>
      ${lightModeToggleMarkup(el)}`;
    }

    fetch("https://jisscrol-opinions.onrender.com/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: uid }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        window._cachedTier = data.tier;
        var badge = _makeBadge(data.tier, 35);
        if (el) {
          el.innerHTML = `${getGreeting()}, <span class="greeting-name">${name}${badge}</span>  <a href="/profile.html" style="color:gray;font-size:20px;">
          <img src="/pics/11.svg" alt="Profile" style="width:50px;height:auto;border:none;">
          </a>
         ${lightModeToggleMarkup(el)}
          `;
        }
      })
      .catch(function () {});
  } else {
    window._cachedUsername =
      sessionStorage.getItem("jis_username") || "Anonymous";
    window._cachedUserId = null;
    window._cachedTier = null;

    if (el) {
      el.innerHTML = `
      <div style="display:"flex"; width:"auto";text-align:right;" href="/login/" >
  
      <a href="/login/" style="color:white;font-size:30px;text-decoration:none;">
      <img src="/pics/11.svg" alt="Profile" style="width:50px;height:auto;border:none;">Sign In</a> </div>
      ${lightModeToggleMarkup(el)}`;
    }
  }

});



// ─────────────────────────────────────────
//  API
// ─────────────────────────────────────────

var API = "https://jisscrol-opinions.onrender.com";
var voted = {};
var ratings = {};

// ─────────────────────────────────────────
//  TEXT HELPERS
// ─────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Escapes first (safe), then turns URLs into gold clickable links
function linkifyText(text) {
  return escapeHtml(text).replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="body-link">$1</a>',
  );
}

// Post/comment text: safe + links + line breaks
function formatBody(text) {
  return linkifyText(text).split("\n").join("<br>");
}

function formatTime(iso) {
  var d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }) +
    " | " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText =
      "position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(20px);" +
      "background:#d0c7f2;color:black;font-family:monospace;font-size:24px;" +
      "padding:12px 28px;border-radius:50px;opacity:0;transition:opacity 0.3s,transform 0.3s;" +
      "pointer-events:none;white-space:nowrap;z-index:999;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2500);
}

// ─────────────────────────────────────────
//  REUSABLE COMPONENTS
// ─────────────────────────────────────────

// 👍 count | bar | 👎 count | 💬 count
function renderRatingsBar(postId) {
  return `
    <div class="rate-btns">
      <button class="btn-good" id="bg-${postId}">
        <img src="/pics/iconsthumbsup.png" alt="good">
        <span id="rgp-${postId}">0</span>
      </button>
      <div class="rate-bar-wrap">
        <div class="rate-bar-good" id="rg-${postId}" style="width:50%"></div>
        <div class="rate-bar-bad" id="rbd-${postId}" style="width:50%"></div>
      </div>
      <button class="btn-bad" id="bb-${postId}">
        <img src="/pics/iconsthumbsdown.png" alt="bad">
        <span id="rbp-${postId}">0</span>
      </button>
      <button class="btn-engage" id="bte-${postId}">
        <img id="commentbtn" src="/pics/commentbtn.png" alt="comments">
        <span id="cc-${postId}">0</span>
      </button>
    </div>
  `;
}

function renderEngagementPanel(postId) {
  return `
    <div class="engage-panel" id="ep-${postId}">
      <div class="opinion-label">YOUR OPINION</div>
      <textarea class="opinion-input" id="oi-${postId}" placeholder="What do you think? (max 300 chars)" maxlength="300"></textarea>
      <div class="opinion-footer">
        <span class="char-count" id="oc-${postId}">0 / 300</span>
        <button class="btn-submit" id="ob-${postId}" disabled>Post</button>
      </div>
      <div class="opinions-list" id="ol-${postId}">
        <div class="opinions-title">OPINIONS</div>
        <div class="no-opinions" id="oe-${postId}">No opinions yet. Be the first.</div>
      </div>
      <button class="btn-show-more" id="osm-${postId}">Show more ▾</button>
    </div>
  `;
}

// Both together: this is the one you call
function renderRateboxAndEngagement(postId) {
  return renderRatingsBar(postId) + renderEngagementPanel(postId);
}

// Wires up buttons, typing counter, panel toggle for one post.
// Call it after the HTML is in the DOM.
function attachEngagementEvents(postId) {
  var engageBtn = document.getElementById("bte-" + postId);
  var panel = document.getElementById("ep-" + postId);
  var input = document.getElementById("oi-" + postId);
  var submitBtn = document.getElementById("ob-" + postId);
  var goodBtn = document.getElementById("bg-" + postId);
  var badBtn = document.getElementById("bb-" + postId);
  var showMore = document.getElementById("osm-" + postId);

  engageBtn.addEventListener("click", function () {
    panel.classList.toggle("open");
  });

  input.addEventListener("input", function () {
    var len = input.value.trim().length;
    var counter = document.getElementById("oc-" + postId);
    counter.textContent = len + " / 300";
    counter.style.color = len > 260 ? "#e07070" : "#444";
    submitBtn.disabled = len === 0;
  });

  submitBtn.addEventListener("click", function () {
    submitOpinion(postId);
  });
  goodBtn.addEventListener("click", function () {
    submitRating(postId, "good");
  });
  badBtn.addEventListener("click", function () {
    submitRating(postId, "bad");
  });

  showMore.addEventListener("click", function () {
    panel.querySelectorAll(".opinion-card.hidden").forEach(function (c) {
      c.classList.remove("hidden");
      c.style.display = "";
    });
    showMore.classList.remove("visible");
  });
}

// One call that does everything for a post: events + ratings + opinions
function initEngagement(postId) {
  attachEngagementEvents(postId);
  loadRatings(postId);
  loadOpinions(postId);
}

// ─────────────────────────────────────────
//  RATINGS
// ─────────────────────────────────────────

function submitRating(postId, vote) {
  if (voted[postId]) return;
  fetch(API + "/ratings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post_id: postId, vote: vote }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.good !== undefined) {
        voted[postId] = vote;
        document.getElementById("bg-" + postId).className =
          "btn-good" + (vote === "good" ? " voted" : "");
        document.getElementById("bb-" + postId).className =
          "btn-bad" + (vote === "bad" ? " voted" : "");
        loadRatings(postId);
      } else {
        showToast("Failed to rate");
      }
    })
    .catch(function () {
      showToast("No connection");
    });
}

function loadRatings(postId) {
  fetch(API + "/ratings/" + postId)
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      ratings[postId] = { good: data.good || 0, bad: data.bad || 0 };
      updateRatingBar(postId);
    })
    .catch(function () {
      if (!ratings[postId]) ratings[postId] = { good: 0, bad: 0 };
      updateRatingBar(postId);
    });
}

// Bar width still uses the ratio; only the raw counts are shown as text
function updateRatingBar(postId) {
  if (!ratings[postId]) ratings[postId] = { good: 0, bad: 0 };
  var good = ratings[postId].good;
  var bad = ratings[postId].bad;
  var total = good + bad;
  var goodPct = total ? Math.round((good / total) * 100) : 50;
  var badPct = 100 - goodPct;

  document.getElementById("rg-" + postId).style.width = goodPct + "%";
  document.getElementById("rbd-" + postId).style.width = badPct + "%";
  document.getElementById("rgp-" + postId).textContent = good;
  document.getElementById("rbp-" + postId).textContent = bad;
}

// ─────────────────────────────────────────
//  OPINIONS
// ─────────────────────────────────────────

function submitOpinion(postId) {
  var input = document.getElementById("oi-" + postId);
  var btn = document.getElementById("ob-" + postId);
  var text = input.value.trim();
  if (!text) return;

  btn.disabled = true;
  btn.textContent = "Posting...";

  var name =
    window._cachedUsername ||
    sessionStorage.getItem("jis_username") ||
    "Anonymous";
  var userId = window._cachedUserId || null;

  fetch(API + "/opinions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      post_id: postId,
      text: text,
      username: name,
      user_id: userId,
    }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.success) {
        input.value = "";
        btn.textContent = "Post";
        btn.disabled = true;
        loadOpinions(postId);
        showToast("Opinion posted!");
      } else {
        btn.disabled = false;
        btn.textContent = "Post";
        showToast("Failed to post");
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = "Post";
      showToast("No connection");
    });
}

function loadOpinions(postId) {
  fetch(API + "/opinions/" + postId)
    .then(function (r) {
      return r.json();
    })
    .then(function (opinions) {
      renderOpinions(postId, opinions);
    })
    .catch(function () {});
}

function renderOpinions(postId, opinions) {
  var list = document.getElementById("ol-" + postId);
  var empty = document.getElementById("oe-" + postId);
  var showMore = document.getElementById("osm-" + postId);
  var cc = document.getElementById("cc-" + postId);

  list.querySelectorAll(".opinion-card").forEach(function (c) {
    c.remove();
  });

  if (cc) cc.textContent = opinions.length;

  if (opinions.length === 0) {
    empty.style.display = "block";
    showMore.classList.remove("visible");
    return;
  }
  empty.style.display = "none";

  opinions.forEach(function (op, i) {
    var badge = "";
    if (op.username && op.username !== "Anonymous") {
      badge = _makeBadge(op.tier, 30);
    }
    var card = document.createElement("div");
    card.className = "opinion-card" + (i > 0 ? " hidden" : "");
    card.style.display = i > 0 ? "none" : "";
    card.innerHTML = `
      <div class="opinion-user">${escapeHtml(op.username || "Anonymous")}${badge}</div>
      <div class="opinion-text">${formatBody(op.text)}</div>
      <div class="opinion-time">${formatTime(op.time)}</div>
    `;
    list.appendChild(card);
  });

  if (opinions.length > 1) showMore.classList.add("visible");
}

// ─────────────────────────────────────────
//  SKELETON LOADER
// ─────────────────────────────────────────

function showSkeleton(containerId, count) {
  count = count || 3;
  var el = document.getElementById(containerId);
  if (!el) return;
  var card = `
    <div class="skeleton-card">
      <div class="skeleton skeleton-label"></div>
      <div class="skeleton skeleton-headline"></div>
      <div class="skeleton skeleton-headline-short"></div>
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text-short"></div>
      <div class="skeleton skeleton-time"></div>
    </div>
  `;
  el.innerHTML = card.repeat(count);
}

function showPollSkeleton() {
  ["poll1", "poll2", "poll3", "poll4"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
      <div class="skeleton skeleton-poll-img"></div>
      <div class="skeleton skeleton-poll-text"></div>
    `;
  });
}

function showTickerSkeleton() {
  var el = document.getElementById("ticker");
  if (!el) return;
  el.innerHTML = '<div class="skeleton skeleton-ticker"></div>';
}

// ── Inject skeleton + link styles ──
(function () {
  var style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
    }
    .skeleton-card { padding:16px 0; border-bottom:1px solid #222; margin-bottom:12px; }
    .skeleton-label { width:80px; height:12px; margin-bottom:10px; }
    .skeleton-headline { width:90%; height:20px; margin-bottom:8px; }
    .skeleton-headline-short { width:60%; height:20px; margin-bottom:14px; }
    .skeleton-img { width:100%; height:400px; margin-bottom:10px; border-radius:8px; }
    .skeleton-text { width:100%; height:13px; margin-bottom:6px; }
    .skeleton-text-short { width:70%; height:13px; margin-bottom:14px; }
    .skeleton-time { width:120px; height:11px; margin-top:8px; }
    .skeleton-poll-img { width:100%; height:120px; border-radius:6px; margin-bottom:8px; }
    .skeleton-poll-text { width:80%; height:13px; margin:0 auto; }
    .skeleton-ticker { width:60%; height:14px; margin:8px auto; }

    .body-link { color:#c9a96e; text-decoration:underline; word-break:break-all; cursor:pointer; }
    .body-link:hover { opacity:0.8; }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  SEARCH — JisScroL global search
// ─────────────────────────────────────────

(function () {
  var style = document.createElement("style");
  style.textContent = `
    #jis-search-icon {
      position:fixed; bottom:50px; right:20px;
      width:78px; height:78px; border:none; background:none;
      border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:22px; cursor:pointer;
      box-shadow:0 4px 16px rgba(0,0,0,0.5);
      z-index:999; user-select:none;
    }
    #jis-search-overlay {
      position:fixed; top:0; left:0; right:0;
      background:#0a0a0a; z-index:1000;
      transform:translateY(-100%); transition:transform 0.3s ease;
      padding:16px; border-bottom:1px solid #222;
    }
    #jis-search-overlay.open { transform:translateY(0); }
    #jis-search-wrap { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
    #jis-search-input {
      flex:1; background:#181818; border:1px solid #333; border-radius:8px;
      padding:8px 9px; color:#e8e8e8; width:50px; font-family:Outfit,sans-serif;
      font-size:19px; outline:none;
    }
    #jis-search-input:focus { border-color:white; }
    #jis-search-close { background:none; border:none; color:white; font-size:35px; cursor:pointer; padding:4px 8px; }
    #jis-search-results { max-height:70vh; overflow-y:auto; scrollbar-width:none; }
    .jis-result-section { font-size:20px; text-transform:uppercase; color:white; margin:12px 0 6px; }
    .jis-result-item { display:flex; align-items:center; gap:12px; font-family:"outfit",serif; padding:10px 0; border-bottom:1px solid #344761; cursor:pointer; }
    .jis-result-item:active { opacity:0.7; }
    .jis-result-img { width:55px; height:55px; object-fit:cover; border-radius:5px; flex-shrink:0; background:#1a1a1a; }
    .jis-result-info { flex:1; min-width:0; }
    .jis-result-cat { font-size:20px; color:lightgray; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:3px; }
    .jis-result-title { font-size:20px; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .jis-no-results { text-align:center; color:white; font-size:30px; padding:32px 0; }
  `;
  document.head.appendChild(style);

  var overlay = document.createElement("div");
  overlay.id = "jis-search-overlay";
  overlay.innerHTML = `
    <div id="jis-search-wrap">
      <input id="jis-search-input" type="text" placeholder="Search articles, stories, songs...">
      <button id="jis-search-close">✕</button>
    </div>
    <div id="jis-search-results"></div>
  `;
  document.body.appendChild(overlay);

  function openSearch() {
    overlay.classList.add("open");
    document.getElementById("jis-search-input").focus();
  }

  function closeSearch() {
    overlay.classList.remove("open");
    document.getElementById("jis-search-input").value = "";
    document.getElementById("jis-search-results").innerHTML = "";
  }

  document
    .getElementById("jis-search-close")
    .addEventListener("click", closeSearch);

  var searchTimer;
  document
    .getElementById("jis-search-input")
    .addEventListener("input", function () {
      clearTimeout(searchTimer);
      var q = this.value.trim();
      if (!q) {
        document.getElementById("jis-search-results").innerHTML = "";
        return;
      }
      searchTimer = setTimeout(function () {
        doSearch(q);
      }, 350);
    });

  function resultItem(page, img, cat, title) {
    return `
      <div class="jis-result-item" onclick="window.location.href='${page}'">
        <img class="jis-result-img" src="${img || ""}" alt="">
        <div class="jis-result-info">
          <div class="jis-result-cat">${cat}</div>
          <div class="jis-result-title">${title}</div>
        </div>
      </div>
    `;
  }

  function doSearch(q) {
    var results = document.getElementById("jis-search-results");
    results.innerHTML = '<p class="jis-no-results">Searching...</p>';

    fetch(API + "/search?q=" + encodeURIComponent(q))
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var html = "";
        var total =
          data.articles.length + data.stories.length + data.songs.length;

        if (total === 0) {
          results.innerHTML =
            '<p class="jis-no-results">No results for "' +
            escapeHtml(q) +
            '"</p>';
          return;
        }

        if (data.articles.length) {
          html += '<div class="jis-result-section">Articles</div>';
          data.articles.forEach(function (a) {
            var page =
              a.category === "trends"
                ? "index.html"
                : a.category === "newpage"
                  ? "newpage.html"
                  : "sports.html";
            html += resultItem(page, a.img, a.category, a.headline);
          });
        }

        if (data.stories.length) {
          html += '<div class="jis-result-section">Stories</div>';
          data.stories.forEach(function (s) {
            html += resultItem("others.html", s.img, s.cat || "Story", s.title);
          });
        }

        if (data.songs.length) {
          html += '<div class="jis-result-section">Songs</div>';
          data.songs.forEach(function (s) {
            html += resultItem(
              "others.html",
              s.img,
              "#" + s.rank,
              s.name + " — " + s.artist,
            );
          });
        }

        results.innerHTML = html;
      })
      .catch(function () {
        results.innerHTML = '<p class="jis-no-results">Could not connect</p>';
      });
  }

  var icon = document.createElement("span");
  icon.id = "jis-search-icon";
  icon.innerHTML =
    '<img src="/pics/search.svg" alt="search" style="background:none;width:40px;height:40px;border:none">';
  icon.addEventListener("click", openSearch);
  document.body.appendChild(icon);
})();
function attachSeeMore(postId) {
  var seeMore = document.getElementById("sm-" + postId);
  if (!seeMore) return;
  seeMore.addEventListener("click", function () {
    toggleBody(postId, seeMore.getAttribute("data-body"));
  });
}

// ─────────────────────────────────────────
//  BODY TEXT (See More / See Less)
// ─────────────────────────────────────────

var BODY_LIMIT = 300;

function toggleBody(postId, encodedBody) {
  var el = document.getElementById("body-text-" + postId);
  var btn = document.getElementById("sm-" + postId);
  var full = decodeURIComponent(encodedBody);

  if (btn.textContent === "See More") {
    el.innerHTML = formatBody(full);
    btn.textContent = "See Less";
  } else {
    el.innerHTML = formatBody(full.substring(0, BODY_LIMIT)) + "...";
    btn.textContent = "See More";
  }
}

function renderBody(post) {
  if (!post.body) return "";

  var isLong = post.body.length > BODY_LIMIT;
  var shown = isLong
    ? formatBody(post.body.substring(0, BODY_LIMIT)) + "..."
    : formatBody(post.body);

  return `
    <p class="article-body" id="body-${post.id}">
      <span id="body-text-${post.id}">${shown}</span>${
        isLong
          ? ` <span class="see-more" id="sm-${post.id}" data-body="${encodeURIComponent(post.body)}">See More</span>`
          : ""
      }
    </p>
  `;
}