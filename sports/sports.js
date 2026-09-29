// Needs jis.js loaded first
// (API, showSkeleton, renderBody, attachSeeMore, renderRateboxAndEngagement, initEngagement)

// ─────────────────────────────────────────
//  KEEP BACKEND AWAKE
// ─────────────────────────────────────────

function keepSportsApiAwake() {
  fetch(API + "/").catch(function (error) {
    console.error("Failed to keep sports API awake:", error);
  });
}

keepSportsApiAwake();
setInterval(keepSportsApiAwake, 5 * 60 * 1000);

// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

function renderSportsPost(post) {
  var postId = post.id;
  var singleImg = !post.img2;

  return `
    <b id="label">${post.label || ""}</b>
    <h2>${post.headline || ""}${
      post.link
        ? ` <a href="${post.link}" target="_blank" rel="noopener noreferrer">view ↗</a>`
        : ""
    }</h2>
    ${renderBody(post)}
    ${post.img ? `<img src="${post.img}" alt="photo"${singleImg ? ' id="p1"' : ""}>` : ""}
    ${post.img2 ? `<img src="${post.img2}" alt="photo">` : ""}
    ${renderRateboxAndEngagement(postId)}
    ${post.time ? `<br><b id="time">${post.time}</b>` : ""}
    <hr>
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
    card.innerHTML = renderSportsPost(post);
    sportsEl.appendChild(card);

    attachSeeMore(post.id);
    initEngagement(post.id); // buttons + ratings + opinions
  });
}


const BACKEND = 'https://jisscrol-opinions.onrender.com';

async function loadFootball() {
  try {
    const response = await fetch(`${BACKEND}/footstat`);
    const data = await response.json();
    renderMatches(data.matches);
  } catch (error) {
    console.error('Football fetch error:', error);
    document.getElementById('matches-scroll').innerHTML = 
      '<p style="color: #999; font-size: 12px; padding: 12px;">Unable to load</p>';
  }
}

function renderMatches(matches) {
  const container = document.getElementById('matches-scroll');
  
  if (!matches || matches.length === 0) {
    container.innerHTML = '<p style="color: #999; font-size: 12px; padding: 12px;">No matches</p>';
    return;
  }

  container.innerHTML = matches
    .slice(0, 20)
    .map(match => `
      <div class="match-card">
        <div class="match-date">${formatDate(match.utcDate)}</div>
        
        <div class="match-matchup">
          <div class="team-score">
            <div class="team-info">
              ${match.homeTeam.crest ? `<img src="${match.homeTeam.crest}" alt="" class="team-logo">` : '<div class="team-logo"></div>'}
              <div class="team-name">${match.homeTeam.name.substring(0, 3).toUpperCase()}</div>
            </div>
            <div class="score">${match.score?.fullTime?.home ?? '-'}</div>
          </div>
          
          <div class="team-score">
            <div class="team-info">
              ${match.awayTeam.crest ? `<img src="${match.awayTeam.crest}" alt="" class="team-logo">` : '<div class="team-logo"></div>'}
              <div class="team-name">${match.awayTeam.name.substring(0, 3).toUpperCase()}</div>
            </div>
            <div class="score">${match.score?.fullTime?.away ?? '-'}</div>
          </div>
        </div>
        
        <div class="match-divider"></div>
        <div class="match-time">${formatTime(match.utcDate)}</div>
        <div class="match-status">${match.status}</div>
      </div>
    `)
    .join('');
}

function formatDate(utcDate) {
  const date = new Date(utcDate);
  return date.toLocaleDateString('en-UG', { month: 'short', day: 'numeric' });
}

function formatTime(utcDate) {
  const date = new Date(utcDate);
  return date.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
}

document.addEventListener('DOMContentLoaded', loadFootball);
setInterval(loadFootball, 1800000);


// Replace the football + standings parts of your sports JS with this.
// Keep your existing renderSportsPost / renderSports / articles fetch as they are.


const emptyMsg = (t) => `<p class="empty-msg">${t}</p>`;

// Premier League always first, everything else after
const isPL = (code, name) => code === 'PL' || /premier league/i.test(name || '');
const plFirst = (a, b) => Number(b.pl) - Number(a.pl);

// ── Formatting ─────────────────────────
function formatDate(utcDate) {
  return new Date(utcDate).toLocaleDateString('en-UG', { month: 'short', day: 'numeric' });
}
function formatTime(utcDate) {
  return new Date(utcDate).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' });
}
function statusInfo(status) {
  if (status === 'IN_PLAY' || status === 'PAUSED') return { label: 'Live', cls: 'live' };
  if (status === 'FINISHED') return { label: 'FT', cls: '' };
  if (status === 'POSTPONED') return { label: 'PPD', cls: '' };
  return { label: 'Upcoming', cls: '' };
}

// ══════════════════════════════════════
//  MATCHES
// ══════════════════════════════════════
let allMatches = [];
let activeMatchTab = 'ALL';

async function loadFootball() {
  try {
    const response = await fetch(`${BACKEND}/footstat`);
    const data = await response.json();
    allMatches = data.matches || [];
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
  const started = h != null && a != null;

  const team = (t, side) => `
    <div class="team ${side}">
      ${t.crest ? `<img src="${t.crest}" alt="" class="team-logo" loading="lazy">` : '<div class="team-logo"></div>'}
      <div class="team-name">${(t.tla || t.name.substring(0, 3)).toUpperCase()}</div>
    </div>`;

  const middle = started
    ? `<div class="match-mid">${h} - ${a}</div>`
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

function renderMatches() {
  const container = document.getElementById('matches-scroll');

  if (!allMatches.length) {
    container.innerHTML = emptyMsg('No matches');
    return;
  }

  // Build competition tabs only if the API provides competition info
  const comps = [];
  allMatches.forEach((m) => {
    const c = m.competition;
    if (c && !comps.find((x) => x.code === (c.code || c.name))) {
      comps.push({ code: c.code || c.name, name: c.name, pl: isPL(c.code, c.name) });
    }
  });
  comps.sort(plFirst);

  if (comps.length > 1 && activeMatchTab === 'ALL') activeMatchTab = comps[0].code;

  const visible = comps.length > 1
    ? allMatches.filter((m) => (m.competition?.code || m.competition?.name) === activeMatchTab)
    : allMatches;

  const tabs = comps.length > 1
    ? `<div class="tabs" data-tabs="matches">${comps.map((c) =>
        `<button class="tab ${c.code === activeMatchTab ? 'active' : ''}" data-code="${c.code}">${c.name}</button>`
      ).join('')}</div>`
    : '';

  // tabs live above the scroller
  let tabsHost = document.getElementById('matches-tabs');
  if (!tabsHost) {
    tabsHost = document.createElement('div');
    tabsHost.id = 'matches-tabs';
    container.parentNode.insertBefore(tabsHost, container);
  }
  tabsHost.innerHTML = tabs;

  container.innerHTML = visible.slice(0, 20).map(matchCard).join('') || emptyMsg('No matches');
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('#matches-tabs .tab');
  if (!tab) return;
  activeMatchTab = tab.dataset.code;
  renderMatches();
});

document.addEventListener('DOMContentLoaded', loadFootball);
setInterval(loadFootball, 1800000);

// ══════════════════════════════════════
//  STANDINGS
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
//  FETCH AND RENDER
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