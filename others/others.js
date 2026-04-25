// ─────────────────────────────────────────
//  CHARTS DATA
// ─────────────────────────────────────────

const charts = [
  {
    id  : 'chart-cover1',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/v1776955711/250px-Tyla_-_Chanel_tnljs5.jpg',
    link: 'https://music.youtube.com/watch?v=xiZUf98A1Ts&si=tLu9tvhV9Q10hw0c',
  },
  {
    id  : 'chart-cover2',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776956041/sddefault_mr6epx.jpg',
    link: '',
  },
  {
    id  : 'chart-cover3',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg',
    link: '',
  },
  {
    id  : 'chart-cover4',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with real URL
    link: '',
  },
{
    id  : 'chart-cover5',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with real URL
    link: '',
  },

];

// ─────────────────────────────────────────
//  SONGS DATA
// ─────────────────────────────────────────

const songs = [
  { rank: '1',  trend: 'up',      name: 'Go',               artist: 'Blackpink',           days: '4d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '2',  trend: 'neutral', name: 'Dracula',           artist: 'Jennie & Tame Impala',days: '14d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '3',  trend: 'down',    name: 'Mariam',            artist: 'Liam Voice',          days: '1d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '4',  trend: 'neutral', name: 'She did it again',  artist: 'Tyla',                days: '4d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '5',  trend: 'neutral', name: 'Rude',              artist: 'Hearts2Hearts',       days: '14d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '5',  trend: 'up',      name: 'Pinky Up',          artist: 'Katseye',             days: '12d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '6',  trend: 'down',    name: 'Risk it all',       artist: 'Bruno Mars',          days: '16d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '7',  trend: 'up',      name: 'London',            artist: 'Kapeke',              days: '2d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '8',  trend: 'down',    name: 'Swim',              artist: 'BTS',                 days: '40d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '9',  trend: 'up',      name: 'Gundi',             artist: 'Mimi Kampala',        days: '1d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '10', trend: 'down',    name: 'Click Clack Sympthon', artist: 'Raye',             days: '4d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '11', trend: 'up',      name: 'Die for me',        artist: 'Zayn Malik',          days: '21d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '12', trend: 'neutral', name: 'Midnight Sun',      artist: 'Zara Larsson',        days: '4d',  img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '13', trend: 'neutral', name: 'End of Beginning',  artist: 'DJO',                 days: '46d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '14', trend: 'up',      name: 'Like Jennie',       artist: 'Jennie',              days: '70d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '15', trend: 'down',    name: 'Jump',              artist: 'Blackpink',           days: '41d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },
  { rank: '16', trend: 'down',    name: 'Jump',              artist: 'Blackpink',           days: '41d', img: 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg' },

];

// ─────────────────────────────────────────
//  STORIES DATA
// ─────────────────────────────────────────

const stories = [
  {
    title : 'Money made me hate my parents.',
    body  : 'During high school I had a boyfriend who used to give me money. But my parents insisted on burning it, I agreed. Later that night I dug the hole to find that my mom took it and surprised dad.',
    author: 'Nankya Joleen',
  },
  {
    title : "Lilian Narrated how k'la night life treated her",
    body  : "In 2015, we were once out at a night club with my friends who were boozing. A friend of mine had two beers tanked and wanted to fight. He said \"Munkwate, I'm sober I can beat this guy.\" To him sober meant he's too drunk and impaired 😂🙈",
    author: 'Lilian Max',
  },
  {
    title : 'My dad called one morning to tell me that he had a cute story to share.',
    body  : "He stopped off at his favorite little bakery on the way to the harbor park. He arrived just as they were taking lemon berry scones out of the oven. On a lark, he bought a bunch to give to folks down at the park. Eight dogs were waiting for him by his parking spot. As he handed out treats, one owner joked, \"So all the dogs get a treat, but what about the people?\" Everyone laughed, but my dad went back to the car, emerged with the scones, and handed them out. \"You should have seen their faces,\" he said. Then after a beat he added, \"It really is fun to be kind.\"",
    author: 'Anonymous',
  },
];

// ─────────────────────────────────────────
//  RENDER ENGINE
// ─────────────────────────────────────────

const trendIcon = { up: '⌃', down: '⌄', neutral: '●' };
const trendId   = { up: 'up', down: 'down', neutral: 'neutral' };

// Poll containers in order
const pollIds = ['poll1', 'poll2', 'poll3', 'poll4'];
const songsPerPoll = 4;

function render() {

  // --- Charts ---
  charts.forEach(function(chart) {
    var el = document.getElementById(chart.id);
    if (!el) return;
    var wrap = document.createElement('div');
    if (chart.link) {
      wrap.innerHTML = '<a href="' + chart.link + '" target="_blank"><img src="' + chart.img + '" alt="chart" class="chart-img"></a>';
    } else {
      wrap.innerHTML = '<img src="' + chart.img + '" alt="chart" class="chart-img">';
    }
    el.appendChild(wrap);
  });

  // --- Songs (split into polls of 4) ---
  pollIds.forEach(function(pollId, pollIndex) {
    var el = document.getElementById(pollId);
    if (!el) return;
    var slice = songs.slice(pollIndex * songsPerPoll, pollIndex * songsPerPoll + songsPerPoll);
    slice.forEach(function(song) {
      var div = document.createElement('div');
      div.className = 'song';
      div.innerHTML =
        '<span id="rank">' + song.rank + '<b id="' + trendId[song.trend] + '">' + trendIcon[song.trend] + '</b></span>' +
        '<img src="' + song.img + '" alt="' + song.name + '">' +
        '<span id="songname">' + song.name + '</span>' +
        '<b>' + song.artist + '</b>' +
        '<span class="days">' + song.days + '</span>';
      el.appendChild(div);
      el.insertAdjacentHTML('beforeend', '<hr>');
    });
  });

  // --- Stories ---
  var randomEl = document.getElementById('random');
  if (randomEl) {
    var label = document.createElement('div');
    label.className = 'section-label';
    label.textContent = 'Random stories';
    randomEl.appendChild(label);

    stories.forEach(function(story) {
      var div = document.createElement('div');
      div.innerHTML =
        '<div id="parahead"><b>' + story.title + '</b></div>' +
        '<p>' + story.body + '</p>' +
        '<b>' + story.author + '</b><hr>';
      randomEl.appendChild(div);
    });
  }
}

render();

// ─────────────────────────────────────────
//  DOTS NAVIGATION
// ─────────────────────────────────────────

var chartsScroll = document.querySelector('.charts-scroll');
var chartDots    = document.querySelectorAll('#chartDots .dot');

if (chartsScroll) {
  chartsScroll.addEventListener('scroll', function() {
    var idx = Math.round(chartsScroll.scrollLeft / chartsScroll.clientWidth);
    chartDots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  });
  chartDots.forEach(function(d, i) {
    d.addEventListener('click', function() {
      chartsScroll.scrollTo({ left: i * chartsScroll.clientWidth, behavior: 'smooth' });
    });
  });
}

var musiccharts = document.querySelector('.musiccharts');
var musicDots   = document.querySelectorAll('#musicDots .dot');

if (musiccharts) {
  musiccharts.addEventListener('scroll', function() {
    var idx = Math.round(musiccharts.scrollLeft / musiccharts.clientWidth);
    musicDots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  });
  musicDots.forEach(function(d, i) {
    d.addEventListener('click', function() {
      musiccharts.scrollTo({ left: i * musiccharts.clientWidth, behavior: 'smooth' });
    });
  });
}
