
var sb = supabase.createClient(
  "https://jzspezkljbxocqboqgtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6c3BlemtsamJ4b2NxYm9xZ3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTU4MjMsImV4cCI6MjA5Mjg5MTgyM30.VXZ4ZX9_z33ZKrWUbhs2EXKruTi1kp5IpLuGLykF1y0",
);

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

// ─────────────────────────────────────────
//  LIGHT MODE
// ─────────────────────────────────────────

var LIGHT_MODE_STORAGE_KEY = "jisscrol-theme";
var LM_ICON_FOR_DARK = "/pics/lm.png";
var LM_ICON_FOR_LIGHT = "/pics/darkmode.png";

function lmIconSrc() {
  return document.documentElement.classList.contains("light-mode")
    ? LM_ICON_FOR_LIGHT
    : LM_ICON_FOR_DARK;
}

function setLightMode(enabled) {
  document.documentElement.classList.toggle("light-mode", enabled);
  try {
    localStorage.setItem(LIGHT_MODE_STORAGE_KEY, enabled ? "true" : "false");
  } catch (e) {}
}

try {
  if (localStorage.getItem(LIGHT_MODE_STORAGE_KEY) === "true") {
    document.documentElement.classList.add("light-mode");
  }
} catch (e) {}

function syncLightModeToggle(toggle) {
  var enabled = document.documentElement.classList.contains("light-mode");
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.setAttribute(
    "aria-label",
    enabled ? "Switch to dark mode" : "Switch to light mode",
  );
  toggle.src = lmIconSrc();
}

function handleLightModeInput(event) {
  var toggle = event.target.closest && event.target.closest("#lightmode");
  if (!toggle) return;

  if (event.type === "keydown") {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
  }

  setLightMode(!document.documentElement.classList.contains("light-mode"));
  syncLightModeToggle(toggle);
}

onReady(function () {
  var existing = document.getElementById("lightmode");
  if (existing) syncLightModeToggle(existing);
});

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
    window.location.href = "/index.html";
  });
}

function _makeBadge(tier, size) {
  size = size || 1;
  var colors = { veteran: "#c9a96e", loyal: "#1c7ade", regular: "#87ceeb" };
  var color = colors[tier];
  if (!color) return "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="vertical-align:middle;">
    <circle cx="12" cy="12" r="12" fill="${color}"/>
    <path d="M6.5 12.5l3.5 3.5 7-7" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ─────────────────────────────────────────
//  SESSION + GREETING
// ─────────────────────────────────────────
var username = sessionStorage.getItem("jis_username") || "Anonymous";

// The toggle. Returns "" if the page already has its own #lightmode elsewhere.
function lightModeToggleMarkup(greetingElement) {
  var existing = document.getElementById("lightmode");
  if (existing && !greetingElement.contains(existing)) return "";

  var enabled = document.documentElement.classList.contains("light-mode");
  return `<img id="lightmode" src="${lmIconSrc()}" alt="Toggle light mode" aria-label="${enabled ? "Switch to dark mode" : "Switch to light mode"}" role="button" tabindex="0" aria-pressed="${enabled}">`;
}

// The profile icon is separate so it never disappears with the toggle
function profileIconMarkup() {
  return `<a href="/profile.html"><img class="profileicon" src="/pics/11.svg" alt="Profile" style="border:none;"></a>`;
}
// Menu items. Edit this list to add or remove links.
var SIDE_LINKS = [
  { label: "About",           href: "/about/#who" },
  { label: "Privacy",         href: "/about/#privacy" },
  { label: "Terms of use",    href: "/about/#terms" },
  { label: "Data sources",    href: "/about/#data-sources" },
  { label: "Takedown requests", href: "/about/#takedowns" },
  { label: "Contact",         href: "/about/#contact" }
];
function sideMarkup() {
  return '<button type="button" class="side-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="side-drawer">' +
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M4 6h16M4 12h16M4 18h16"/>' +
    '</svg>' +
  '</button>';
}

function initSideMenu() {
  if (document.getElementById("side-drawer")) return;

  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<div class="side-overlay" hidden></div>' +
    '<aside class="side-drawer" id="side-drawer" aria-label="Menu" aria-hidden="true" inert>' +
      '<div class="side-head">' + "<img  style='width: 40px; height: auto;' src='/pics/logog.svg' alt='JiScroL' />" +
        '<p> The JiScroL</p>' +
        '<button type="button" class="side-close" aria-label="Close menu">✕</button>' +
      '</div>' +
      '<nav class="side-nav">' +
        SIDE_LINKS.map(function (l) {
          return '<a href="' + l.href + '">' + l.label + "</a>";
        }).join("") +
      "</nav>" +
    "</aside>";
  document.body.appendChild(wrap);

  var overlay = wrap.querySelector(".side-overlay");
  var drawer  = wrap.querySelector(".side-drawer");
  var lastFocus = null;

  function setOpen(open) {
    var toggles = document.querySelectorAll(".side-toggle");
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) drawer.removeAttribute("inert"); else drawer.setAttribute("inert", "");
    overlay.hidden = !open;
    overlay.classList.toggle("open", open);
    document.body.classList.toggle("side-locked", open);
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", String(open)); });

    if (open) {
      lastFocus = document.activeElement;
      drawer.querySelector("a").focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  }

  // delegation: works even if the button is injected later by sideMarkup()
  document.addEventListener("click", function (e) {
    if (e.target.closest(".side-toggle")) return setOpen(true);
    if (e.target.closest(".side-close") || e.target === overlay) return setOpen(false);
    if (e.target.closest(".side-nav a")) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", initSideMenu);
// Builds the greeting HTML when the element exists
function renderGreeting(buildHtml) {
  onReady(function () {
    var el = document.getElementById("user-greeting");
    if (el) el.innerHTML = buildHtml(el);
  });
}

function loggedInGreeting(el, name, badge) {
  return (
    `<div class="gwrap">${getGreeting()}, <span class="greeting-name">${escapeHtml(name)}${badge || ""}</span></div>` +
    `<div class="gicons">
      ${profileIconMarkup()}
      ${lightModeToggleMarkup(el)}
      ${sideMarkup()}
    </div>`
  );
}

sb.auth.getSession().then(function (r) {
  if (r.data.session) {
    var u = r.data.session.user;
    var name = (u.user_metadata && u.user_metadata.display_name) || u.email;
    var uid = u.id;

    window._cachedUsername = name;
    window._cachedUserId = uid;
    sessionStorage.setItem("jis_username", name);
    sessionStorage.setItem("jis_uid", uid);

    // first paint (no badge yet)
    renderGreeting(function (el) {
      return loggedInGreeting(el, name, "");
    });

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
        var badge = _makeBadge(data.tier, 20);
        renderGreeting(function (el) {
          return loggedInGreeting(el, name, badge);
        });
      })
      .catch(function () {});
  } else {
    window._cachedUsername =
      sessionStorage.getItem("jis_username") || "Anonymous";
    window._cachedUserId = null;
    window._cachedTier = null;

    renderGreeting(function (el) {
      return `<div style="display:flex;align-items:center;">
      <a href="/login/" style="color:white;font-family:'Outfit', sans-serif;font-size:19px;text-decoration:none; margin: 10px;">Login</a>${lightModeToggleMarkup(el)}${sideMarkup()}</div>`;
    });
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

// wraps links and hashtags
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
  if (!tag || typeof window.openJiSearch !== "function") return;
  window.openJiSearch(tag.getAttribute("data-tag"));
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

var toastTimer = null;

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
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2500);
}

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
         <svg class="commentbtn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3c-1.3 0-2.5-.3-3.6-.8L3 21l1.6-4.9A8.1 8.1 0 0 1 3.5 11.5 8.4 8.4 0 0 1 12 3.2a8.4 8.4 0 0 1 9 8.3z"/>
  </svg>
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
        <div class="no-opinions" id="oe-${postId}">
        
        No opinions yet. Be the first!</div>
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

  if (engageBtn) {
    engageBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      // Open the dedicated comments page for a full conversation view.
      var commentsPage = "/comments/?post_id=" + encodeURIComponent(postId);
      if (window.location.pathname.indexOf("/comments") === -1) {
        window.location.href = commentsPage;
      }
    });
  }

  if (input && submitBtn) {
    input.addEventListener("input", function () {
      var len = input.value.trim().length;
      var counter = document.getElementById("oc-" + postId);
      if (counter) {
        counter.textContent = len + " / 300";
        counter.style.color = len > 260 ? "#e07070" : "#444";
      }
      submitBtn.disabled = len === 0;
    });

    submitBtn.addEventListener("click", function () {
      submitOpinion(postId);
    });
  }

  if (goodBtn) {
    goodBtn.addEventListener("click", function () {
      submitRating(postId, "good");
    });
  }
  if (badBtn) {
    badBtn.addEventListener("click", function () {
      submitRating(postId, "bad");
    });
  }

  if (showMore && panel) {
    showMore.addEventListener("click", function () {
      panel.querySelectorAll(".opinion-card.hidden").forEach(function (c) {
        c.classList.remove("hidden");
        c.style.display = "";
      });
      showMore.classList.remove("visible");
    });
  }
}

// One call that does everything for a post: events + ratings + opinions
function initEngagement(postId) {
  attachEngagementEvents(postId);
  loadRatings(postId);
  loadOpinions(postId);
}

// Tapping a post card opens its comments page
document.addEventListener("click", function (event) {
  var target = event.target;
  if (!(target instanceof Element)) return;

  var card = target.closest("[data-comments-post-id]");
  if (
    !card ||
    target.closest(
      "a, button, textarea, input, select, [contenteditable='true'], " +
        ".see-more, .body-hashtag, .post-video, iframe, video, .rate-btns, .engage-panel",
    )
  ) {
    return;
  }

  var postId = card.getAttribute("data-comments-post-id");
  if (!postId) return;
  window.location.href = "/comments/?post_id=" + encodeURIComponent(postId);
});

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
        var g = document.getElementById("bg-" + postId);
        var b = document.getElementById("bb-" + postId);
        if (g) g.className = "btn-good" + (vote === "good" ? " voted" : "");
        if (b) b.className = "btn-bad" + (vote === "bad" ? " voted" : "");
        loadRatings(postId);
      } else {
        notify("Failed to rate");
      }
    })
    .catch(function () {
      notify("No connection, please try again...");
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

  var rg = document.getElementById("rg-" + postId);
  var rbd = document.getElementById("rbd-" + postId);
  var rgp = document.getElementById("rgp-" + postId);
  var rbp = document.getElementById("rbp-" + postId);
  if (!rg || !rbd || !rgp || !rbp) return;

  rg.style.width = goodPct + "%";
  rbd.style.width = badPct + "%";
  rgp.textContent = good;
  rbp.textContent = bad;
}

// ─────────────────────────────────────────
//  OPINIONS
// ─────────────────────────────────────────

function submitOpinion(postId) {
  var input = document.getElementById("oi-" + postId);
  var btn = document.getElementById("ob-" + postId);
  if (!input || !btn) return;
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
        notify("Opinion posted!");
      } else {
        btn.disabled = false;
        btn.textContent = "Post";
        notify("Failed to post");
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = "Post";
      notify("No connection");
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
  // API can return an error object instead of a list
  if (!Array.isArray(opinions)) return;

  var list = document.getElementById("ol-" + postId);
  var empty = document.getElementById("oe-" + postId);
  var showMore = document.getElementById("osm-" + postId);
  var cc = document.getElementById("cc-" + postId);
  if (!list || !empty || !showMore) return;

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

(function () {
  var style = document.createElement("style");

  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }

    .skeleton {
      display: block;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      background: linear-gradient(
        90deg,
        #1a1a1a 25%,
        #2a2a2a 50%,
        #1a1a1a 75%
      );
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
    }

    .skeleton-card {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 0;
      border-bottom: 1px solid #222;
      margin-bottom: 12px;
    }

    .skeleton-label {
      width: 80px;
      height: 12px;
      margin-bottom: 10px;
    }

    .skeleton-headline {
      width: 90%;
      height: 20px;
      margin-bottom: 8px;
    }

    .skeleton-headline-short {
      width: 60%;
      height: 20px;
      margin-bottom: 14px;
    }

    .skeleton-img {
      width: 100%;
      height: 400px;
      margin-bottom: 10px;
      border-radius: 8px;
    }

    .skeleton-text {
      width: 100%;
      height: 13px;
      margin-bottom: 6px;
    }

    .skeleton-text-short {
      width: 70%;
      height: 13px;
      margin-bottom: 14px;
    }

    .skeleton-time {
      width: 120px;
      height: 11px;
      margin-top: 8px;
    }

    .skeleton-poll-img {
      width: 100%;
      height: 120px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .skeleton-poll-text {
      width: 80%;
      height: 13px;
      margin: 0 auto;
    }

    .skeleton-ticker {
      width: 60%;
      height: 14px;
      margin: 8px auto;
    }

    .body-link {
      color: #3b9cff;
      text-decoration: underline;
      word-break: break-all;
      cursor: pointer;
    }

    .body-link:hover {
      opacity: 0.8;
    }

    .article-body a {
      pointer-events: auto;
      position: relative;
      z-index: 5;
    }

    .body-hashtag {
      color: #3b9cff;
      cursor: pointer;
    }

    .body-hashtag:hover {
      text-decoration: underline;
    }
  `;

  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  SEARCH — floating icon that opens the /search/ page
// ─────────────────────────────────────────

(function () {
  // no floating icon on the search page itself
  if (/^\/search(?:\/|$)/.test(window.location.pathname)) return;

  var style = document.createElement("style");
  style.textContent = `
    #jis-search-icon {
      position:fixed; bottom:30px; right:15px;
      width:50px; height:50px; padding:0; border:none; background:none;
      border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; box-shadow:0 7px 16px rgba(99, 232, 205, 0.5);
      z-index:999; user-select:none;
    }
  `;
  document.head.appendChild(style);

  // lets #hashtags in post text open the search page
  window.openJiSearch = function (q) {
    q = String(q || "").replace(/^#/, "");
    window.location.href = "/search/" + (q ? "?q=" + encodeURIComponent(q) : "");
  };

  onReady(function () {
    var icon = document.createElement("button");
    icon.id = "jis-search-icon";
    icon.type = "button";
    icon.setAttribute("aria-label", "Open search page");
    icon.innerHTML =
      '<img src="/pics/search.svg" alt="" style="background:none;width:50px;height:50px;border:none;margin:0">';
    icon.addEventListener("click", function () {
      window.location.href = "/search/";
    });
    document.body.appendChild(icon);
  });
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

// The main <video> has NO autoplay attribute on purpose: the
// IntersectionObserver below starts the one that is on screen.
// (With autoplay, every video on the page started at once.)
function renderVideoEmbed(item, fillFrame) {
  if (item.type === "video") {
    var safeSrc = escapeHtml(item.url);
    var backdrop = fillFrame
      ? `<video class="article-image-backdrop post-video-backdrop" autoplay muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1" src="${safeSrc}"></video>`
      : "";
    return `${backdrop}
      <video class="post-video-main" muted loop playsinline preload="auto" src="${safeSrc}">Your browser does not support video playback.</video>
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

var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
var ICON_MUTED = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="video-mute-mark" d="m16 9 5 6m0-6-5 6"/></svg>';
var ICON_VOLUME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="video-volume-mark" d="M16 9a5 5 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/></svg>';

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

  // Only touch the buttons when their state changes (timeupdate fires constantly;
  // rewriting innerHTML every time can swallow taps)
  var playState = video.paused ? "paused" : "playing";
  if (playButton.dataset.state !== playState) {
    playButton.dataset.state = playState;
    playButton.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
    playButton.innerHTML = video.paused ? ICON_PLAY : ICON_PAUSE;
  }

  var muteState = video.muted ? "muted" : "sound";
  if (muteButton.dataset.state !== muteState) {
    muteButton.dataset.state = muteState;
    muteButton.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
    muteButton.classList.toggle("is-muted", video.muted);
    muteButton.innerHTML = video.muted ? ICON_MUTED : ICON_VOLUME;
  }

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
  video.play().catch(function () {
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
  var button = event.target.closest && event.target.closest("[data-video-action]");
  if (!button) return;

  var wrapper = button.closest(".post-video");
  var video = wrapper && wrapper.querySelector(".post-video-main");
  if (!video) return;

  var action = button.dataset.videoAction;

  if (action === "play") {
    if (video.paused) {
      startArticleVideo(video);
    } else {
      // user paused on purpose: don't let scroll logic auto-restart it
      delete video.dataset.resumeAfterScroll;
      delete video.dataset.autoPlayPending;
      video.pause();
    }
  } else if (action === "mute") {
    articleVideosMuted = !video.muted;
    document.querySelectorAll(".post-video-main").forEach(function (articleVideo) {
      articleVideo.muted = articleVideosMuted;
      updateArticleVideoControls(articleVideo);
    });
  } else if (action === "fullscreen") {
    var request;
    if (document.fullscreenElement === wrapper) {
      if (document.exitFullscreen) request = document.exitFullscreen();
    } else if (wrapper.requestFullscreen) {
      request = wrapper.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      // iPhone Safari can only fullscreen the <video> itself
      video.webkitEnterFullscreen();
    }
    if (request && request.catch) {
      request.catch(function (error) {
        console.error("Article video fullscreen could not be changed:", error);
      });
    }
  }
  updateArticleVideoControls(video);
});

document.addEventListener("input", function (event) {
  var seek = event.target.closest && event.target.closest(".post-video-seek");
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

onReady(function () {
  document.querySelectorAll(".post-video-main").forEach(observeArticleVideos);

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(observeArticleVideos);
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
});

function toggleBody(postId, encodedBody) {
  var el = document.getElementById("body-text-" + postId);
  var btn = document.getElementById("sm-" + postId);
  if (!el || !btn) return;
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

(function () {
  var host = document.getElementById("site-footer");
  if (!host) return;

  var LINKS = {
    terms: "about.html",
    email: "thejisscrol@gmail.com",           // confirm this address
    x: "https://x.com/boyslovepor",
    whatsapp: "https://wa.me/256765247503",
    tiktok: "https://tiktok.com/@yourhandle"  // put your real handle
  };

  var ICONS = {
    x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    whatsapp: '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.43-1.37c1.37.73 2.93 1.15 4.61 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.96 13.06c-.21.59-1.22 1.13-1.67 1.19-.45.06-.87.21-2.94-.61-2.47-1-4.03-3.51-4.15-3.67-.12-.16-.99-1.32-.99-2.52s.63-1.79.85-2.03c.22-.24.48-.3.64-.3h.46c.15 0 .35-.06.55.42.21.49.71 1.73.77 1.86.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.24-.1.48.14.24.62.99 1.32 1.6.9.8 1.66 1.05 1.9 1.17.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.39.66 1.63.78.24.12.4.18.46.28.06.1.06.56-.15 1.15z"/>',
    tiktok: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.2 8.2 0 004.79 1.52V7.13a4.85 4.85 0 01-1.02-.44z"/>'
  };

  var SOCIALS = [
    { key: "x", label: "JiScroL on X" },
    { key: "whatsapp", label: "JiScroL on WhatsApp", color: "#25D366" },
    { key: "tiktok", label: "JiScroL on TikTok" }
  ];

  var social = SOCIALS.map(function (s) {
    return '<a href="' + LINKS[s.key] + '" target="_blank" rel="noopener noreferrer" aria-label="' + s.label + '">' +
      '<svg viewBox="0 0 24 24" fill="' + (s.color || "currentColor") + '" aria-hidden="true">' + ICONS[s.key] + "</svg></a>";
  }).join("");

  var contact = host.hasAttribute("data-full")
    ? '<p class="foot-line">Contact: <a href="mailto:' + LINKS.email + '">' + LINKS.email + "</a></p>"
    : "";

  var year = new Date().getFullYear();

  host.innerHTML =
    '<footer class="about_us">' +
      '<p class="foot-line">©' + year + " JiScroL · " +
        '<a href="' + LINKS.terms + '">Terms of use</a></p>' +
      contact +
      '<nav class="social" aria-label="Social links">' + social + "</nav>" +
    "</footer>";
})();

