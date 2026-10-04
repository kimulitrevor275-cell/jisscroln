// ─────────────────────────────────────────
//  SUPABASE
// ─────────────────────────────────────────
var sb = supabase.createClient(
  "https://jzspezkljbxocqboqgtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c3BlemtsamJ4b2NxYm9xZ3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTU4MjMsImV4cCI6MjA5Mjg5MTgyM30.VXZ4ZX9_z33ZKrWUbhs2EXKruTi1kp5IpLuGLykF1y0",
);

var LIGHT_MODE_STORAGE_KEY = "jisscrol-theme";

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
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Link / hashtag detection ──
// Finds, in RAW text: https://… links, www.… links, bare domains
// (jisscrol.com, site.co.ug/page) and #hashtags. Trailing punctuation
// ("see jisscrol.com, then…", "(https://x.com)") is kept OUT of the link.
var BARE_TLDS =
  "com|org|net|ug|co\\.ug|or\\.ug|ac\\.ug|go\\.ug|ke|tz|rw|ng|gh|za|uk|us|ca|de|fr|in|io|me|tv|fm|to|cc|co|ly|gl|be|tk|" +
  "info|biz|app|dev|news|edu|gov|xyz|online|site|store|link|live|club|shop|tech|page|blog|wiki|media|world|today|top";

function findTextTokens(text) {
  var re = new RegExp(
    "(https?:\\/\\/[^\\s<>\"']+" +
      "|www\\.[^\\s<>\"']+" +
      "|[a-z0-9][a-z0-9-]*(?:\\.[a-z0-9-]+)*\\.(?:" + BARE_TLDS + ")(?![a-z0-9-])(?:\\/[^\\s<>\"']*)?" +
      // any other ending is still a link when a path follows: example.xyz123/page
      "|[a-z0-9][a-z0-9-]*(?:\\.[a-z0-9-]+)*\\.[a-z]{2,}\\/[^\\s<>\"']*" +
      "|#[\\p{L}\\p{N}_]+)",
    "giu",
  );
  var tokens = [];
  var m;

  while ((m = re.exec(text)) !== null) {
    var raw = m[0];
    var start = m.index;
    var prev = start > 0 ? text.charAt(start - 1) : "";

    if (raw.charAt(0) === "#") {
      // hashtag: must contain a letter (so "#1" isn't one) and not be glued to a word
      if (/[\p{L}\p{N}_]/u.test(prev) || !/\p{L}/u.test(raw)) continue;
      tokens.push({ start: start, end: start + raw.length, text: raw, kind: "tag" });
      continue;
    }

    // skip emails (name@site.com) and domains glued to a preceding word/path
    if (prev === "@" || /[\w\/.-]/.test(prev)) {
      if (!/^https?:/i.test(raw)) continue;
    }

    // trim trailing punctuation off the link
    var trimmed = raw;
    while (trimmed.length) {
      var last = trimmed.charAt(trimmed.length - 1);
      if (/[.,!?;:'"\]}>]/.test(last)) {
        trimmed = trimmed.slice(0, -1);
      } else if (last === ")") {
        var opens = (trimmed.match(/\(/g) || []).length;
        var closes = (trimmed.match(/\)/g) || []).length;
        if (closes > opens) trimmed = trimmed.slice(0, -1);
        else break;
      } else {
        break;
      }
    }
    if (!trimmed) continue;

    re.lastIndex = start + trimmed.length; // resume right after the link
    tokens.push({ start: start, end: start + trimmed.length, text: trimmed, kind: "link" });
  }
  return tokens;
}

// Escapes everything, then wraps links and hashtags
function linkifyText(text) {
  if (!text) return "";
  text = String(text);

  var tokens = findTextTokens(text);
  var out = "";
  var pos = 0;

  tokens.forEach(function (t) {
    out += escapeHtml(text.slice(pos, t.start));

    if (t.kind === "tag") {
      out +=
        '<span class="body-hashtag" data-tag="' + escapeHtml(t.text) + '">' +
        escapeHtml(t.text) + "</span>";
    } else {
      var href = /^https?:\/\//i.test(t.text) ? t.text : "https://" + t.text;
      out +=
        '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" class="body-link">' +
        escapeHtml(t.text) + "</a>";
    }
    pos = t.end;
  });

  return out + escapeHtml(text.slice(pos));
}

// Post/comment text: safe + links + line breaks
function formatBody(text) {
  return linkifyText(text).split("\n").join("<br>");
}

// Cut text at `limit` WITHOUT slicing through a link or hashtag
function truncateBody(text, limit) {
  if (text.length <= limit) return text;
  var cut = limit;
  findTextTokens(text).forEach(function (t) {
    if (t.start < limit && t.end > limit) cut = t.end;
  });
  return text.substring(0, cut);
}

// Make every body link reliably clickable, even when the post card
// sits inside another link or has its own click handler (capture phase runs first).
document.addEventListener(
  "click",
  function (event) {
    var a = event.target.closest && event.target.closest("a.body-link");
    if (!a) return;
    event.preventDefault();
    event.stopPropagation();
    window.open(a.href, "_blank", "noopener,noreferrer");
  },
  true,
);

// Tapping a #hashtag opens search with that tag
document.addEventListener("click", function (event) {
  var tag = event.target.closest && event.target.closest(".body-hashtag");
  if (!tag || typeof window.openJisSearch !== "function") return;
  window.openJisSearch(tag.getAttribute("data-tag"));
});

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

    .body-link { color:#3b9cff; text-decoration:underline; word-break:break-all; cursor:pointer; }
    .body-link:hover { opacity:0.8; }
    .article-body a { pointer-events:auto; position:relative; z-index:5; }
    .body-hashtag { color:#3b9cff; cursor:pointer; }
    .body-hashtag:hover { text-decoration:underline; }
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

  // lets #hashtags in post text open search
  window.openJisSearch = function (q) {
    q = String(q || "").replace(/^#/, "");
    openSearch();
    if (q) {
      document.getElementById("jis-search-input").value = q;
      doSearch(q);
    }
  };

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

// ─────────────────────────────────────────
//  ARTICLE MEDIA
// ─────────────────────────────────────────
// The backend classifies media. Each article carries:
//   post.media = [{ type: "image" | "video" | "embed", url, provider, embedUrl }]
// so nothing here sniffs URLs or file extensions.

// Fallback for old API responses that only have img/img2/img_type/img2_type.
// (Embeds can't be rebuilt here without embedUrl, so they degrade to images.)
function legacyMediaFromPost(post) {
  var items = [];
  [["img", "img_type"], ["img2", "img2_type"]].forEach(function (pair) {
    var src = post[pair[0]];
    if (!src) return;
    items.push({
      type: post[pair[1]] === "video" ? "video" : "image",
      url: src,
      provider: null,
      embedUrl: null,
    });
  });
  return items;
}

function renderArticleImages(post) {
  var items = post.media && post.media.length ? post.media : legacyMediaFromPost(post);

  if (items.length === 2) {
    return `<div class="article-images">${items
      .map(function (item) { return renderArticleMediaItem(item, true); })
      .join("")}</div>`;
  }

  if (items.length === 1) {
    return renderArticleMediaItem(items[0], false, "p1");
  }

  return "";
}

function renderArticleMediaItem(item, framed, id) {
  var idAttr = id ? ` id="${id}"` : "";

  if (item.type === "video" || item.type === "embed") {
    var mediaHtml = renderVideoEmbed(item, framed);
    if (!mediaHtml) return "";
    var frameClass = framed ? " article-image-frame" : "";
    return `<div class="post-video${frameClass}"${idAttr}>${mediaHtml}</div>`;
  }

  var src = escapeHtml(item.url);

  if (framed) {
    return `
      <div class="article-image-frame">
        <img class="article-image-backdrop" src="${src}" alt="" aria-hidden="true">
        <img class="article-image" src="${src}" alt="photo">
      </div>
    `;
  }

  return `<img src="${src}" alt="photo"${idAttr}>`;
}

function renderVideoEmbed(item, fillFrame) {
  if (item.type === "video") {
    var safeSrc = escapeHtml(item.url);
    var backdrop = fillFrame
      ? `<video class="article-image-backdrop post-video-backdrop" autoplay muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1" src="${safeSrc}"></video>`
      : "";
    return `${backdrop}
      <video class="post-video-main" autoplay muted loop playsinline preload="auto" src="${safeSrc}">Your browser does not support video playback.</video>
      <div class="post-video-controls" role="group" aria-label="Video controls">
        <button class="post-video-control post-video-mute is-muted" type="button" data-video-action="mute" aria-label="Unmute video">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="video-mute-mark" d="m16 9 5 6m0-6-5 6"/></svg>
        </button>
        <button class="post-video-control post-video-play" type="button" data-video-action="play" aria-label="Pause video">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <input class="post-video-seek" type="range" min="0" max="1000" value="0" aria-label="Seek video">
        <span class="post-video-time" aria-live="off">0:00 / 0:00</span>
        <button class="post-video-control post-video-fullscreen" type="button" data-video-action="fullscreen" aria-label="Enter fullscreen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 4v-4h2v6h-6v-2h4z"/></svg>
        </button>
      </div>`;
  }

  // type === "embed": backend supplies a ready-made embedUrl
  if (!item.embedUrl) {
    console.error("Cannot render article media: embed has no embedUrl.");
    return "";
  }

  var url;
  try {
    url = new URL(item.embedUrl);
  } catch (error) {
    console.error("Cannot render article media: invalid embed URL.", error);
    return "";
  }
  if (url.protocol !== "https:") {
    console.error("Cannot render article media: embed must be https.");
    return "";
  }

  var isTwitch = item.provider === "twitch";
  if (isTwitch) url.searchParams.set("parent", window.location.hostname);

  url.searchParams.set("autoplay", isTwitch ? "true" : "1");
  if (item.provider === "vimeo") {
    url.searchParams.set("muted", "1");
  } else if (isTwitch) {
    url.searchParams.set("muted", "true");
  } else {
    url.searchParams.set("mute", "1");
  }

  return `<iframe src="${escapeHtml(url.href)}" title="Article video" loading="lazy" allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

document.addEventListener(
  "error",
  function (event) {
    var video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;

    var wrapper = video.closest(".post-video");
    if (!wrapper) return;

    if (video.classList.contains("post-video-backdrop")) {
      video.remove();
      return;
    }

    console.error(
      "Article video could not be loaded:",
      video.currentSrc || video.src,
      video.error,
    );

    var message = document.createElement("p");
    message.className = "post-video-error";
    message.textContent =
      "This video is unavailable. Its source may be offline or may not allow playback here.";
    wrapper.replaceChildren(message);
    wrapper.classList.add("media-error");
  },
  true,
);

function formatVideoClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  var totalSeconds = Math.floor(seconds);
  var minutes = Math.floor(totalSeconds / 60);
  var remainder = String(totalSeconds % 60).padStart(2, "0");
  if (minutes >= 60) {
    return Math.floor(minutes / 60) + ":" + String(minutes % 60).padStart(2, "0") + ":" + remainder;
  }
  return minutes + ":" + remainder;
}

function updateArticleVideoControls(video) {
  var wrapper = video.closest(".post-video");
  if (!wrapper) return;

  var seek = wrapper.querySelector(".post-video-seek");
  var time = wrapper.querySelector(".post-video-time");
  var playButton = wrapper.querySelector(".post-video-play");
  var muteButton = wrapper.querySelector(".post-video-mute");
  var fullscreenButton = wrapper.querySelector(".post-video-fullscreen");
  if (!seek || !time || !playButton || !muteButton || !fullscreenButton) return;

  var duration = Number.isFinite(video.duration) ? video.duration : 0;
  var currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
  seek.value = duration ? String(Math.round((currentTime / duration) * 1000)) : "0";
  seek.style.setProperty("--video-progress", Number(seek.value) / 10 + "%");
  time.textContent = formatVideoClock(currentTime) + " / " + formatVideoClock(duration);
  playButton.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  playButton.innerHTML = video.paused
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
  muteButton.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  muteButton.classList.toggle("is-muted", video.muted);
  muteButton.innerHTML = video.muted
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="video-mute-mark" d="m16 9 5 6m0-6-5 6"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="video-volume-mark" d="M16 9a5 5 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/></svg>';
  fullscreenButton.setAttribute(
    "aria-label",
    document.fullscreenElement === wrapper ? "Exit fullscreen" : "Enter fullscreen",
  );
}

var articleVideosMuted = true;
var activeArticleVideo = null;
var visibleArticleVideos = new WeakSet();

function startArticleVideo(video) {
  document.querySelectorAll(".post-video-main").forEach(function (otherVideo) {
    if (otherVideo === video) return;
    delete otherVideo.dataset.resumeAfterScroll;
    if (!otherVideo.paused) otherVideo.pause();
  });

  activeArticleVideo = video;
  video.muted = articleVideosMuted;
  video.play().catch(function (error) {
    if (activeArticleVideo === video) activeArticleVideo = null;
    console.error("Article video playback could not start:", error);
    startNextVisibleArticleVideo();
  });
}

function startNextVisibleArticleVideo() {
  if (activeArticleVideo && !activeArticleVideo.paused) return;

  var candidate = Array.from(document.querySelectorAll(".post-video-main")).find(
    function (video) {
      if (
        video.dataset.resumeAfterScroll !== "true" &&
        video.dataset.autoPlayPending !== "true"
      ) {
        return false;
      }
      return visibleArticleVideos.has(video);
    },
  );

  if (candidate) {
    delete candidate.dataset.resumeAfterScroll;
    delete candidate.dataset.autoPlayPending;
    startArticleVideo(candidate);
  }
}

document.addEventListener("click", function (event) {
  var button = event.target.closest("[data-video-action]");
  if (!button) return;

  var wrapper = button.closest(".post-video");
  var video = wrapper && wrapper.querySelector(".post-video-main");
  if (!video) return;

  if (button.dataset.videoAction === "play") {
    if (video.paused) {
      startArticleVideo(video);
    } else {
      video.pause();
    }
  } else if (button.dataset.videoAction === "mute") {
    articleVideosMuted = !video.muted;
    document.querySelectorAll(".post-video-main").forEach(function (articleVideo) {
      articleVideo.muted = articleVideosMuted;
      updateArticleVideoControls(articleVideo);
    });
  } else if (button.dataset.videoAction === "fullscreen") {
    var fullscreenRequest =
      document.fullscreenElement === wrapper
        ? document.exitFullscreen()
        : wrapper.requestFullscreen();
    fullscreenRequest.catch(function (error) {
      console.error("Article video fullscreen could not be changed:", error);
    });
  }
  updateArticleVideoControls(video);
});

document.addEventListener("input", function (event) {
  var seek = event.target.closest(".post-video-seek");
  if (!seek) return;

  var wrapper = seek.closest(".post-video");
  var video = wrapper && wrapper.querySelector(".post-video-main");
  if (!video || !Number.isFinite(video.duration)) return;

  video.currentTime = (Number(seek.value) / 1000) * video.duration;
  updateArticleVideoControls(video);
});

["durationchange", "loadedmetadata", "timeupdate", "play", "pause", "volumechange", "ended"].forEach(
  function (eventName) {
    document.addEventListener(
      eventName,
      function (event) {
        var articleVideo = event.target;
        if (
          !(articleVideo instanceof HTMLVideoElement) ||
          !articleVideo.classList.contains("post-video-main")
        ) {
          return;
        }

        if (event.type === "play") {
          var playingVideo = articleVideo;
          document.querySelectorAll(".post-video-main").forEach(function (otherVideo) {
            if (otherVideo === playingVideo) return;
            delete otherVideo.dataset.resumeAfterScroll;
            if (!otherVideo.paused) otherVideo.pause();
          });
          activeArticleVideo = playingVideo;
        } else if (event.type === "pause" && activeArticleVideo === articleVideo) {
          activeArticleVideo = null;
          window.setTimeout(startNextVisibleArticleVideo, 0);
        }
        updateArticleVideoControls(articleVideo);
      },
      true,
    );
  },
);

document.addEventListener("fullscreenchange", function () {
  document.querySelectorAll(".post-video-main").forEach(updateArticleVideoControls);
});

var articleVideoObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      var wrapper = video.closest(".post-video");
      if (!wrapper) return;

      if (entry.isIntersecting) {
        visibleArticleVideos.add(video);
      } else {
        visibleArticleVideos.delete(video);
      }

      var backdrop = wrapper.querySelector(".post-video-backdrop");
      if (entry.isIntersecting) {
        if (backdrop && backdrop.paused) {
          backdrop.play().catch(function (error) {
            console.error("Article video backdrop could not resume:", error);
          });
        }
        if (
          !activeArticleVideo &&
          (video.dataset.resumeAfterScroll === "true" ||
            video.dataset.autoPlayPending === "true")
        ) {
          delete video.dataset.resumeAfterScroll;
          delete video.dataset.autoPlayPending;
          startArticleVideo(video);
        }
        return;
      }

      if (!video.paused) {
        video.dataset.resumeAfterScroll = "true";
        video.pause();
      }
      if (backdrop && !backdrop.paused) backdrop.pause();
    });
  },
  { threshold: 0.15 },
);

var observedArticleVideos = new WeakSet();

function observeArticleVideos(node) {
  if (!(node instanceof Element)) return;

  var videos = [];
  if (node.matches(".post-video-main")) videos.push(node);
  videos.push.apply(videos, node.querySelectorAll(".post-video-main"));

  videos.forEach(function (video) {
    if (observedArticleVideos.has(video)) return;
    observedArticleVideos.add(video);
    video.muted = articleVideosMuted;
    video.dataset.autoPlayPending = "true";
    articleVideoObserver.observe(video);
  });
}

document.querySelectorAll(".post-video-main").forEach(observeArticleVideos);

new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(observeArticleVideos);
  });
}).observe(document.documentElement, { childList: true, subtree: true });

function toggleBody(postId, encodedBody) {
  var el = document.getElementById("body-text-" + postId);
  var btn = document.getElementById("sm-" + postId);
  var full = decodeURIComponent(encodedBody);

  if (btn.textContent === "See More") {
    el.innerHTML = formatBody(full);
    btn.textContent = "See Less";
  } else {
    el.innerHTML = formatBody(truncateBody(full, BODY_LIMIT)) + "...";
    btn.textContent = "See More";
  }
}

function renderBody(post) {
  if (!post.body) return "";

  var isLong = post.body.length > BODY_LIMIT;
  var shown = isLong
    ? formatBody(truncateBody(post.body, BODY_LIMIT)) + "..."
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