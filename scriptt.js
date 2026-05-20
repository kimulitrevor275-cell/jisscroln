// ─────────────────────────────────────────
//  TICKER DATA
// ─────────────────────────────────────────

var tickers = [
  "Petrol prices are raising at a rocket-speed",
  "Iran shows Isreal real super power",
  "World leaders meet in Geneva",
  "X open algrorithm to  ",
  "Ugandans who took PDM money are at risk of being jailed",
];

// ─────────────────────────────────────────
//  POLLS DATA
// ─────────────────────────────────────────

var polls = [
  {
    id  : 'poll1',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1777975471/ab67616d00001e022211aea789b9010379e43726_vqtiml.jpg',
    text: 'The vistor sienna spiro',
  },
  {
    id  : 'poll2',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1777975515/ab67616d00001e02564858dca5482e57c932782f_tsean6.jpg', // replace with pics/20.jpg upload
    text: 'She did it again',
  },
  {
    id  : 'poll3',
    img : '',
    text: 'To fight  poverty you must stop feeling sorry for your hardwork',
  },
  {
    id  : 'poll4',
    img : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/21_1.png upload
    text: 'Blackpink in your area',
  },
];

// ─────────────────────────────────────────
//  TRENDS/NEWS DATA
//
//  img      : main image (always required)
//  img2     : second image — if set, both images show at 50% width each
//             if empty '', main image shows at 100% width (id="p1")
// ─────────────────────────────────────────

var trends = [
{
  id      : '24',
  headline: `X released its latest Open source algorithm which is partically power by Grok, Here is how it could  help you`,
  img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1779207128/icon-ios.77d25eba_icse0r.png',
  img2    : '',
  body    : `X released its algorithm earlier this week, The JisScroL has pointed out its benefit to specific audience(s) <br><br>

<b>Students and beginners : </b>They can study real AI systems instead of only theory. Seeing how recommendation systems, chatbots, or AI models are built helps people learn faster.<br><br>

<b>Developers : </b> Programmers can improve the code, build apps on top of it, or customize it for their own projects. Open-source tools often grow quickly because thousands of developers contribute ideas and fixes.<br><br>

<b>Small startups : </b> Companies without huge budgets can use existing AI technology instead of building everything from scratch. That lowers the barrier to entering the AI industry.<br><br>

<b>Researchers : </b> Open algorithms allow experts to test for bias, accuracy, safety, and performance. Closed systems hide many details, but open systems can be audited publicly.<br><br>

<b>Content creators and businesses : </b> They may use the AI for automation, customer support, analytics, or content generation without paying extremely high enterprise costs.<br><br>

<b>The general public : </b> More transparency builds trust, People can better understand how recommendations, trends, or AI-generated responses work instead of treating the system like a "black box."`,
  time    : '19.5.26 | 6:24 PM',
  link    : '',
},
  {
    id      : '23',
    headline: "How Artificial intelligence  spread world wide in a short time and changed the game",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1779200121/artificial-intelligence-1920_glq5nm.jpg', 
    img2    : '',
    body    : `Artificial Intelligence has spread across the world in a very short time because of the rapid growth of technology and the internet. Today, AI is used in smartphones, social media, schools, hospitals, businesses, and even transportation. Companies have invested heavily in AI to improve speed, accuracy, and convenience in daily activities. Popular tools such as virtual assistants, chatbots, and recommendation systems have made AI part of everyday life for millions of people.
                <br><br>Another reason for the fast growth of AI is easy access to information and powerful computers. Developers can now create advanced AI systems faster than before, while people around the world can access them through the internet. Social media and global communication also helped spread awareness of AI quickly. As technology continues to improve.
                <br><br><br> Artificial Intelligence is expected to become even more important in education, work, entertainment, and communication worldwide`,
    time    : '19.5.26 | 5:11 PM',
    link    : '',
  },
  {
    id      : '22',
    headline: "The Met gala is to take place to night in Newyork!",
    img     :  'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1777892277/2024_Met_Gala_Zendaya_778df27c5b_pyzbhn.webp', 
    img2    : '',
    body    : 'The met gal is to take place in Newyork with them "FASHION IS ART".How are you expecting the most?',
    time    : '04.5.26 | 2:2 PM',
    link    : '',
  },
{
    id      : '92',
    headline: "Olivia Rodrigo makes history as the only artist with all leads (3) debut at #1 on global spotify",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776956041/sddefault_mr6epx.jpg', // replace with pics/31.jpg upload
    img2    : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/29.jpg upload
    body    : '',
    time    : '16.4.26 | 5:01 PM',
    link    : '',
  },
  {
    id      : "91",
    headline: "Justin Bieber shocks fans as he streams YouTube on his Coachella set",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/v1776510182/32_uxzewk.jpg',
    img2    : '',
    body    : 'He did great that his collobrating "beauty and a beat" with Nickminaj returned to #1 on global spotify',
    time    : '16.4.26 | 5:25 PM',
    link    : '',
  },
  {
    id      : '48',
    headline: "Olivia Rodrigo returns to music tonight with her new single 'Drop Dead'",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776956041/sddefault_mr6epx.jpg', // replace with pics/31.jpg upload
    img2    : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/29.jpg upload
    body    : '',
    time    : '16.4.26 | 5:01 PM',
    link    : '',
  },
  {
    id      : '71',
    headline: "HYBE gives update on Manon's situation, says she will perform at Coachella in a few weeks",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/28.jpg upload
    img2    : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/24.jpg upload
    body    : '',
    time    : '03.4.26 | 7:01 PM',
    link    : '',
  },
  {
    id      : '61',
    headline: "Earth stuns in new photo taken by Artemis II (Via: @NASA)",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/27.jpg upload
    img2    : '',
    body    : '',
    time    : '03.4.26 | 6:43 PM',
    link    : '',
  },
  {
    id      : '55',
    headline: "Manon has deleted KATSEYE from her Instagram bio — is this just a hiatus?",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/24.jpg upload
    img2    : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/23.jpg upload
    body    : "Fans of Katseye and Manon's solo stans were shocked after Manon removed 'KATSEYE' from her bio.<br><br>Showing she isn't in good terms with HxG. The other members plus HxG are still silent and fans are demanding an official statement.",
    time    : '02.4.26 | 12:28 AM',
    link    : '',
  },
  {
    id      : '44',
    headline: "Newly constructed stadium in Uganda as they prepare for 2027 AFCON",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', // replace with pics/11.jpg upload
    img2    : '',
    body    : '',
    time    : '23.3.26 | 4:58 PM',
    link    : 'https://www.google.com',
  },
  {
    id      : '36',
    headline: "What was your experience with supabase",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1777892317/1_pnSzmFJRCJztS7tkSJXYuQ_rmkexr.jpg', 
    img2    : '',
    body    : 'supa is a beginner-freindly but powerful data base you can use, easy to setup and has good security and a proper Auth system',
    time    : '23.3.26 | 4:58 PM',
    link    : '',
  },
  {
    id      : '12',
    headline: "Would you leave mordern cities for this wonderful rural village",
    img     :  'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1777892515/214120962-humble-village-in-the-middle-of-the-jungle_urw3eq.jpg', 
    img2    : '',
    body    : `Moving from a busy town or city to a village doesn’t just change your surroundings, It reshapes how you experience time, relationships, and even your own thoughts. In the beginning, the quiet can feel uncomfortable
    .<br> <br><br>Almost like something is missing, because you’re used to constant noise, movement, and instant access to everything. But as days pass, that silence starts to feel different—less like emptiness and more like space to actually think and notice things you used to ignore, like the rhythm of nature, the way mornings unfold slowly, 
    or how conversations with people tend to be longer and more personal. <br><br>Life in a village often strips things down to what really matters, where convenience is reduced but connection is stronger, and you begin to rely more on people than systems. At the same time, it’s not all peaceful and perfect; you may deal with limited resources, fewer opportunities, and moments of frustration when things aren’t as fast or efficient as you’re used to. <br><br>Still, there’s a trade-off happening beneath the surface, where stress levels drop, your pace becomes more human, and you start valuing consistency over urgency. If you lean into it instead of resisting it, village life can teach patience, 
    self-reliance, and a kind of clarity that’s hard to find in crowded places, but it also forces you to be honest about what you truly need versus what you were just used to having.`,
    
    time    : '23.3.26 | 4:58 PM',
    link    : '',
  },
  {
    id      : '11',
    headline: "Courage and experience which helps people build empires from new places",
    img     : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', 
    img2    : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776955966/blackpink-go_reewuf.jpg', 
    body    : ` Building something meaningful as a student isn’t about waiting until you “feel ready,” it’s about consistently showing up and refining your work in small, honest steps.
    <br><br> Most people overestimate how much they can do in a day and underestimate what they can achieve in a few months of focused effort, which is why projects often get abandoned halfway—not because they’re impossible, but because the process feels slower than expected. <br><br>The real advantage comes from learning how to stay in that slow phase, where things are slightly confusing, slightly messy, and not yet impressive, because that’s where real skill develops.
    <br><br>Whether you’re working on a website, experimenting with design, or figuring out how backend logic connects to what users see, each mistake you fix quietly upgrades your understanding, even if it doesn’t look like progress on the surface. Over time, those small corrections stack into something solid and reliable, and that’s when people start calling it “talent,” even though it’s just persistence combined with curiosity.`,
    
    time    : '23.3.26 | 4:58 PM',
    link    : 'https://www.google.com',
  },
];

// ─────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────

var API     = 'https://jisscrol-opinions.onrender.com';
var voted   = {};
var ratings = {};

// Wake up API on page load
fetch(API + '/').catch(function() {});
setInterval(function() { fetch(API + '/').catch(function() {}); }, 5 * 60 * 1000);

// ─────────────────────────────────────────
//  RENDER ENGINE — do not edit below
//
//  Image width logic (automatic):
//  - one image  → id="p1" → 100% width
//  - two images → no id   → 50% width each
// ─────────────────────────────────────────

function render() {

  // --- Ticker ---
  var tickerEl = document.getElementById('ticker');
  if (tickerEl) {
    tickerEl.innerHTML = '';
    tickers.forEach(function(t) {
      var span = document.createElement('span');
      span.textContent = t;
      tickerEl.appendChild(span);
    });
  }

  // --- Polls ---
  polls.forEach(function(poll) {
    var el = document.getElementById(poll.id);
    if (!el) return;
    el.innerHTML = '';
    if (poll.img) {
      var img = document.createElement('img');
      img.src = poll.img;
      img.alt = poll.text;
      el.appendChild(img);
    }
    if (poll.text) {
      var h4 = document.createElement('h4');
      h4.textContent = poll.text;
      el.appendChild(h4);
    }
  });

  // --- Trends ---
  var trendsEl = document.getElementById('trends');
  if (!trendsEl) return;
  trendsEl.innerHTML = '<h1 id="forup">JisScroL Updates<a href="newpage.html"><img id="nxtp-icon" src="pics/nxtpage.png"></a></h1>';

  trends.forEach(function(post) {
    var postId    = post.id;
    var singleImg = !post.img2;
    var div       = document.createElement('div');

    div.innerHTML =
      '<h2>' + post.headline +
        (post.link ? ' <a href="' + post.link + '" target="_blank">view</a>' : '') +
      '</h2>' +
      '<img src="' + post.img + '" alt="photo"' + (singleImg ? ' id="p1"' : '') + '>' +
      (post.img2 ? '<img src="' + post.img2 + '" alt="photo">' : '') +
      (post.body ? '<p>' + post.body + '</p>' : '') +

      // ── rating bar ──
      '<div class="rate-box">' +
        '<div class="rate-btns">' +
          '<button class="btn-good" id="bg-' + postId + '">' +
            '<img src="pics/iconsthumbsup.png" alt="good"> good' +
          '</button>' +
          '<button class="btn-bad" id="bb-' + postId + '">' +
            '<img src="pics/iconsthumbsdown.png" alt="bad"> bad' +
          '</button>' +
        '</div>' +
        '<div class="rate-bar-wrap">' +
          '<div class="rate-bar-good" id="rg-'  + postId + '" style="width:50%"></div>' +
          '<div class="rate-bar-bad"  id="rbd-' + postId + '" style="width:50%"></div>' +
        '</div>' +
        '<div class="rate-counts">' +
          '<span id="rgp-' + postId + '">0 (50%)</span>' +
          '<span id="rbp-' + postId + '">(50%) 0</span>' +
        '</div>' +
      '</div>' +

      // ── comment button ──
      '<button class="btn-engage" id="bte-' + postId + '">' +
        '<img id="commentbtn" src="pics/commentbtn.png"> Comment <span>▾</span>' +
      '</button>' +

      // ── comment panel (hidden by default) ──
      '<div class="engage-panel" id="ep-' + postId + '">' +
        '<div class="opinion-label">YOUR OPINION</div>' +
        '<textarea class="opinion-input" id="oi-' + postId + '" ' +
          'placeholder="What do you think? (max 300 chars)" maxlength="300"></textarea>' +
        '<div class="opinion-footer">' +
          '<span class="char-count" id="oc-' + postId + '">0 / 300</span>' +
          '<button class="btn-submit" id="ob-' + postId + '" disabled>Post</button>' +
        '</div>' +
        '<div class="opinions-list" id="ol-' + postId + '">' +
          '<div class="opinions-title">OPINIONS</div>' +
          '<div class="no-opinions" id="oe-' + postId + '">No opinions yet. Be the first.</div>' +
        '</div>' +
        '<button class="btn-show-more" id="osm-' + postId + '">Show more ▾</button>' +
      '</div>' +

      // ── timestamp at the bottom ──
      '<br><b id="time">' + post.time + '</b>' +
      '<hr>';

    trendsEl.appendChild(div);
    attachEvents(postId);
    loadRatings(postId);
    loadOpinions(postId);
  });
}

// ─────────────────────────────────────────
//  ATTACH EVENTS
// ─────────────────────────────────────────

function attachEvents(postId) {
  var engageBtn = document.getElementById('bte-' + postId);
  var panel     = document.getElementById('ep-'  + postId);
  var input     = document.getElementById('oi-'  + postId);
  var submitBtn = document.getElementById('ob-'  + postId);
  var goodBtn   = document.getElementById('bg-'  + postId);
  var badBtn    = document.getElementById('bb-'  + postId);
  var showMore  = document.getElementById('osm-' + postId);

  engageBtn.addEventListener('click', function() {
    var isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    engageBtn.querySelector('span').textContent = isOpen ? '▾' : '▴';
  });

  input.addEventListener('input', function() {
    var len = input.value.trim().length;
    document.getElementById('oc-' + postId).textContent = len + ' / 300';
    document.getElementById('oc-' + postId).style.color = len > 260 ? '#e07070' : '#444';
    submitBtn.disabled = len === 0;
  });

  submitBtn.addEventListener('click', function() { submitOpinion(postId); });
  goodBtn.addEventListener('click',   function() { submitRating(postId, 'good'); });
  badBtn.addEventListener('click',    function() { submitRating(postId, 'bad'); });

  showMore.addEventListener('click', function() {
    var hidden = panel.querySelectorAll('.opinion-card.hidden');
    hidden.forEach(function(c) {
      c.classList.remove('hidden');
      c.style.display = '';
    });
    showMore.classList.remove('visible');
  });
}

// ─────────────────────────────────────────
//  RATING FUNCTIONS
// ─────────────────────────────────────────

function submitRating(postId, vote) {
  if (voted[postId]) return;

  fetch(API + '/ratings', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ post_id: postId, vote: vote }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      voted[postId] = vote;
      document.getElementById('bg-' + postId).className = 'btn-good' + (vote === 'good' ? ' voted' : '');
      document.getElementById('bb-' + postId).className = 'btn-bad'  + (vote === 'bad'  ? ' voted' : '');
      loadRatings(postId);
    } else {
      showToast('Failed to rate');
    }
  })
  .catch(function() {
    showToast('No connection');
  });
}

function loadRatings(postId) {
  fetch(API + '/ratings/' + postId)
  .then(function(r) { return r.json(); })
  .then(function(data) {
    ratings[postId] = { good: data.good || 0, bad: data.bad || 0 };
    updateRatingBar(postId);
  })
  .catch(function() {
    if (!ratings[postId]) ratings[postId] = { good: 0, bad: 0 };
    updateRatingBar(postId);
  });
}

function updateRatingBar(postId) {
  if (!ratings[postId]) ratings[postId] = { good: 0, bad: 0 };
  var good    = ratings[postId].good;
  var bad     = ratings[postId].bad;
  var total   = good + bad;
  var goodPct = total ? Math.round((good / total) * 100) : 50;
  var badPct  = 100 - goodPct;

  document.getElementById('rg-'  + postId).style.width = goodPct + '%';
  document.getElementById('rbd-' + postId).style.width = badPct  + '%';
  document.getElementById('rgp-' + postId).textContent = good + ' (' + goodPct + '%)';
  document.getElementById('rbp-' + postId).textContent = '(' + badPct + '%) ' + bad;
}

// ─────────────────────────────────────────
//  OPINION FUNCTIONS
// ─────────────────────────────────────────

function submitOpinion(postId) {
  var input = document.getElementById('oi-' + postId);
  var btn   = document.getElementById('ob-' + postId);
  var text  = input.value.trim();
  if (!text) return;

  btn.disabled    = true;
  btn.textContent = 'Posting...';

  var username = window._cachedUsername || 'Anonymous';
  fetch(API + '/opinions', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ post_id: postId, text: text, username: username }),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      input.value     = '';
      btn.textContent = 'Post';
      btn.disabled    = true;
      loadOpinions(postId);
      showToast('Opinion posted!');
    } else {
      btn.disabled    = false;
      btn.textContent = 'Post';
      showToast('Failed to post');
    }
  })
  .catch(function() {
    btn.disabled    = false;
    btn.textContent = 'Post';
    showToast('No connection');
  });
}

function loadOpinions(postId) {
  fetch(API + '/opinions/' + postId)
  .then(function(r) { return r.json(); })
  .then(function(opinions) { renderOpinions(postId, opinions); })
  .catch(function() {});
}

function renderOpinions(postId, opinions) {
  var list     = document.getElementById('ol-'  + postId);
  var empty    = document.getElementById('oe-'  + postId);
  var showMore = document.getElementById('osm-' + postId);
  var cards    = list.querySelectorAll('.opinion-card');
  cards.forEach(function(c) { c.remove(); });

  if (opinions.length === 0) {
    empty.style.display = 'block';
    showMore.classList.remove('visible');
    return;
  }
  empty.style.display = 'none';

  opinions.forEach(function(op, i) {
    var card = document.createElement('div');
    card.className     = 'opinion-card' + (i > 0 ? ' hidden' : '');
    card.style.display = i > 0 ? 'none' : '';
    card.innerHTML =
      '<div class="opinion-user">' + escapeHtml(op.username || 'Anonymous') + (op.username && op.username !== 'Anonymous' ? ' <svg width="14" height="14" viewBox="0 0 24 24" style="margin-left:3px;vertical-align:middle;"><circle cx="12" cy="12" r="12" fill="#87ceeb"/><path d="M6.5 12.5l3.5 3.5 7-7" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') + '</div>' +
      '<div class="opinion-text">' + escapeHtml(op.text) + '</div>' +
      '<div class="opinion-time">' + formatTime(op.time) + '</div>';
    list.appendChild(card);
  });

  if (opinions.length > 1) showMore.classList.add('visible');
}

// ─────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────

function formatTime(iso) {
  var d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' }) +
         ' | ' + d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText =
      'position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:#d0c7f2;color:black;font-family:monospace;font-size:24px;' +
      'padding:12px 28px;border-radius:50px;opacity:0;transition:opacity 0.3s,transform 0.3s;' +
      'pointer-events:none;white-space:nowrap;z-index:999;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity   = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(function() {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}

render();