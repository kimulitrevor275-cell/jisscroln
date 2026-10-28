function keepSportsApiAwake() {
  fetch(API + "/").catch(function (error) {
    console.error("Failed to keep sports API awake:", error);
  });
}

keepSportsApiAwake();
setInterval(keepSportsApiAwake, 5 * 60 * 1000);

// ─────────────────────────────────────────
//  ARTICLES (unchanged)
// ─────────────────────────────────────────

function renderSportsPost(post) {
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
    ${post.time ? `<b id="time">${post.time}</b><hr>` : ""}
    
  `;
}

function renderSports(posts) {
  var sportsEl = document.getElementById("sports");
  if (!sportsEl) return;

  sportsEl.innerHTML = "";

  if (!Array.isArray(posts) || posts.length === 0) {
    sportsEl.textContent = "No sports found.";
    return;
  }

  posts.forEach(function (post) {
    var card = document.createElement("article");
    card.className = "post-card";
    card.setAttribute("data-comments-post-id", post.id);
    card.innerHTML = renderSportsPost(post);
    sportsEl.appendChild(card);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
  });
}

// ─────────────────────────────────────────
//  SHARED HELPERS
// ─────────────────────────────────────────

const BACKEND = 'https://jisscrol-opinions.onrender.com';

const emptyMsg = (t) => `<p class="empty-msg">${t}</p>`;

// Premier League always first, everything else after
const isPL = (code, name) => code === 'PL' || /premier league/i.test(name || '');
const plFirst = (a, b) => Number(b.pl) - Number(a.pl);

function formatDate(utcDate) {
  return new Date(utcDate).toLocaleDateString('en-UG', { month: 'short', day: 'numeric' });
}
function formatTime(utcDate) {
  return new Date(utcDate).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
}
function statusInfo(status) {
  if (status === 'IN_PLAY') return { label: 'Live', cls: 'live' };
  if (status === 'PAUSED') return { label: 'HT', cls: 'live' };
  if (status === 'FINISHED') return { label: 'FT', cls: '' };
  if (status === 'POSTPONED') return { label: 'PPD', cls: '' };
  return { label: 'Upcoming', cls: '' };
}

// ══════════════════════════════════════
//  MATCHES  (Live / Played / Upcoming  +  league tabs)
// ══════════════════════════════════════
let footData = { live: [], played: [], upcoming: [], delayed: false };
let activeStatus = null;     // 'live' | 'played' | 'upcoming'
let activeMatchTab = null;   // league code

const STATUS_TABS = [['upcoming', 'Upcoming'],['live', 'Live'], ['played', 'Played'], ];
const EMPTY = {
  live: 'No live matches right now',
  played: 'No recent results',
  upcoming: 'No upcoming matches'
};

async function loadFootball() {
  try {
    const response = await fetch(`${BACKEND}/footstat`);
    const data = await response.json();
    footData = {
      live: data.live || [],
      played: data.played || [],
      upcoming: data.upcoming || data.matches || [],   // data.matches = old backend
      delayed: !!data.delayed
    };
    if (!activeStatus) activeStatus = footData.live.length ? 'live' : 'upcoming';
    renderMatches();
  } catch (error) {
    console.error('Football fetch error:', error);
    document.getElementById('matches-scroll').innerHTML = emptyMsg('Unable to load');
  }
}

function matchCard(match) {
  const st = statusInfo(match.status);
  const h = match.score?.fullTime?.home;
  const a = match.score?.fullTime?.away;
  const started = st.cls === 'live' || match.status === 'FINISHED' || (h != null && a != null);

  const team = (t, side) => `
    <div class="team ${side}">
      ${t.crest ? `<img src="${t.crest}" alt="" class="team-logo" loading="lazy">` : '<div class="team-logo"></div>'}
      <div class="team-name">${(t.tla || t.name.substring(0, 3)).toUpperCase()}</div>
    </div>`;

  const middle = started
    ? `<div class="match-mid">${h ?? 0} - ${a ?? 0}</div>`
    : `<div class="match-mid time">${formatTime(match.utcDate)}</div>`;

  return `
    <div class="match-card">
      ${team(match.homeTeam, 'home')}
      <div class="match-center">
        <span class="match-status ${st.cls}">${st.label}</span>
        ${middle}
        <div class="match-date">${started ? formatTime(match.utcDate) + ' · ' : ''}${formatDate(match.utcDate)}</div>
      </div>
      ${team(match.awayTeam, 'away')}
    </div>`;
}

// creates a small host <div> right above the scroller the first time it's needed
function ensureHost(id, scroller) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    scroller.parentNode.insertBefore(el, scroller);
  }
  return el;
}

function renderMatches() {
  const container = document.getElementById('matches-scroll');
  const statusHost = ensureHost('status-tabs', container);
  const leagueHost = ensureHost('matches-tabs', container);

  // ── status pills: Live | Played | Upcoming ──
  statusHost.innerHTML =
    `<div class="tabs" id="status-pills">${STATUS_TABS.map(([key, label]) =>
      `<button class="tab ${key === activeStatus ? 'active' : ''} ${key === 'live' && footData.live.length ? 'has-live' : ''}" data-status="${key}">${label} <span>${footData[key].length}</span></button>`
    ).join('')}</div>` +
    (activeStatus === 'live' && footData.delayed
      ? '<p class="empty-msg">Live scores can run a few minutes behind.</p>'
      : '');

  const list = footData[activeStatus] || [];
  if (!list.length) {
    leagueHost.innerHTML = '';
    container.innerHTML = emptyMsg(EMPTY[activeStatus]);
    return;
  }

  // ── league tabs, built from the matches in this status ──
  const comps = [];
  list.forEach((m) => {
    const c = m.competition;
    if (c && !comps.find((x) => x.code === (c.code || c.name))) {
      comps.push({ code: c.code || c.name, name: c.name, pl: isPL(c.code, c.name) });
    }
  });
  comps.sort(plFirst);

  const showLeagues = comps.length > 1;
  if (showLeagues && !comps.find((c) => c.code === activeMatchTab)) activeMatchTab = comps[0].code;

  const visible = showLeagues
    ? list.filter((m) => (m.competition?.code || m.competition?.name) === activeMatchTab)
    : list;

  leagueHost.innerHTML = showLeagues
    ? `<div class="tabs">${comps.map((c) =>
        `<button class="tab ${c.code === activeMatchTab ? 'active' : ''}" data-code="${c.code}">${c.name}</button>`
      ).join('')}</div>`
    : '';

  container.innerHTML = visible.slice(0, 20).map(matchCard).join('') || emptyMsg(EMPTY[activeStatus]);
}

document.addEventListener('click', (e) => {
  const pill = e.target.closest('#status-pills .tab');
  if (pill) {
    activeStatus = pill.dataset.status;
    renderMatches();
    return;
  }
  const tab = e.target.closest('#matches-tabs .tab');
  if (tab) {
    activeMatchTab = tab.dataset.code;
    renderMatches();
  }
});

document.addEventListener('DOMContentLoaded', loadFootball);
setInterval(loadFootball, 60000);   // reads your own cached endpoint, so it's cheap

// ══════════════════════════════════════
//  STANDINGS (unchanged)
// ══════════════════════════════════════
let leagues = [];
let activeLeague = 0;

async function loadStandings() {
  try {
    const response = await fetch(`${BACKEND}/standings`);
    const data = await response.json();

    leagues = (data.standings || [])
      .filter((c) => c.standings && c.standings[0])
      .map((c) => ({
        name: c.competition.name,
        code: c.competition.code,
        table: c.standings[0].table,
        pl: isPL(c.competition.code, c.competition.name),
      }))
      .sort(plFirst);

    activeLeague = 0; // Premier League first
    renderStandings();
  } catch (error) {
    console.error('Standings fetch error:', error);
    document.getElementById('standings-container').innerHTML = emptyMsg('Unable to load standings');
  }
}

function zoneClass(league, pos, total) {
  if (!league.pl) return '';
  if (pos <= 4) return 'zone-ucl';
  if (pos === 5) return 'zone-uel';
  if (pos > total - 3) return 'zone-rel';
  return '';
}

function renderStandings() {
  const container = document.getElementById('standings-container');

  if (!leagues.length) {
    container.innerHTML = emptyMsg('No standings available');
    return;
  }

  const league = leagues[activeLeague];
  const total = league.table.length;

  const tabs = `<div class="tabs" id="standings-tabs">${leagues.map((l, i) =>
    `<button class="tab ${i === activeLeague ? 'active' : ''}" data-i="${i}">${l.name}</button>`
  ).join('')}</div>`;

  const rows = league.table.map((t) => `
    <tr class="${zoneClass(league, t.position, total)}">
      <td class="col-pos">${t.position}</td>
      <td class="col-team">
        <div class="team-cell">
          ${t.team.crest ? `<img src="${t.team.crest}" alt="" class="team-logo-small" loading="lazy">` : '<div class="team-logo-small"></div>'}
          <span class="team-name-small">${t.team.shortName || t.team.name}</span>
        </div>
      </td>
      <td>${t.playedGames}</td>
      <td>${t.won}</td>
      <td>${t.draw}</td>
      <td>${t.lost}</td>
      <td>${t.goalDifference > 0 ? '+' : ''}${t.goalDifference}</td>
      <td class="points">${t.points}</td>
    </tr>`).join('');

  const legend = league.pl ? `
    <div class="legend">
      <span><i style="background:var(--ucl)"></i>Champions League</span>
      <span><i style="background:var(--uel)"></i>Europa League</span>
      <span><i style="background:var(--rel)"></i>Relegation</span>
    </div>` : '';

  container.innerHTML = `
    ${tabs}
    <div class="league-standings">
      <div class="league-header">${league.name}</div>
      <div class="standings-table">
        <table>
          <thead>
            <tr>
              <th class="col-pos">#</th><th class="col-team">Team</th>
              <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${legend}
    </div>`;
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('#standings-tabs .tab');
  if (!tab) return;
  activeLeague = Number(tab.dataset.i);
  renderStandings();
});

document.addEventListener('DOMContentLoaded', loadStandings);
setInterval(loadStandings, 3600000);

// ─────────────────────────────────────────
//  FETCH AND RENDER ARTICLES (unchanged)
// ─────────────────────────────────────────

showSkeleton("sports", 3);

fetch(API + "/articles?category=sports")
  .then(function (response) {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(renderSports)
  .catch(function (error) {
    console.error("Failed to load sports:", error);
    var sportsEl = document.getElementById("sports");
    if (sportsEl) sportsEl.textContent = "Could not load sports. Please try again later.";
  });