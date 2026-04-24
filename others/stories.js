
// ─────────────────────────────────────────
//  STORIES DATA — edit here only
//
//  img      : path to image e.g. 'pics/story1.jpg'
//  cat      : category label
//  cc       : category colour class
//             cc-money | cc-love | cc-drama | cc-life
//  badge    : small top-left tag text
//  title    : story headline
//  snippet  : 1-2 line preview shown on the card
//  author   : author full name
//  initials : 2 letters for the avatar circle
//  time     : how long ago e.g. '2h ago'
//  read     : estimated read time e.g. '3 min'
//  body     : array of paragraphs
// ─────────────────────────────────────────

const DATA = [

  {
    img      : 'https://res.cloudinary.com/dvxl03ips/image/upload/q_auto/f_auto/v1776956041/sddefault_mr6epx.jpg ',
    cat      : 'Money & Family',
    cc       : 'cc-money',
    badge    : 'Trending',
    title    : 'Money Made Me Hate My Parents',
    snippet  : 'During high school my boyfriend used to give me money. My parents found out and insisted it was dangerous...',
    author   : 'Nankya Joleen',
    initials : 'NJ',
    time     : '2h ago',
    read     : '3 min',
    body     : [
      'During high school, I had a boyfriend who used to give me money. Back then, I thought I was the luckiest girl alive.',
      'My parents found out. They told me the money was "dangerous" and that I had to burn it. I agreed — at least to their faces.',
      'That night, I buried it instead. I felt clever.',
      'But the next morning, the hole was empty. My mother had watched me from the window and burned it for real.',
      'I didn\'t speak to them for weeks. But years later I understood exactly what they saw that I couldn\'t.',
      'Money made me hate my parents. But love made me forgive them.',
    ],
  },


{
    img      : 'pics/24.jpg',
    cat      : 'Money & Family',
    cc       : 'cc-money',
    badge    : 'Trending',
    title    : 'About Manon and how she made it',
    snippet  : 'During high school my boyfriend used to give me money. My parents found out and insisted it was dangerous...',
    author   : 'Nankya Joleen',
    initials : 'NJ',
    time     : '2h ago',
    read     : '3 min',
    body     : [
      'ring high school, I had a boyfriend who used to give me money. Back then, I thought I was the luckiest girl alive.',
      'My parents found out. They told me the money was "dangerous" and that I had to burn it. I agreed — at least to their faces.',
      'That night, I buried it instead. I felt clever.',
      'But the next morning, the hole was empty. My mother had watched me from the window and burned it for real.',
      'I didn\'t speak to them for weeks. But years later I understood exactly what they saw that I couldn\'t.',
      'Money made me hate my parents. But love made me forgive them.',
    ],
  },



  {
    img      : 'pics/20.jpg',
    cat      : 'Love & Betrayal',
    cc       : 'cc-love',
    badge    : 'Love',
    title    : 'He Said He Loved Me. His Wife Said Otherwise.',
    snippet  : 'We met at a wedding in Kampala. For six months he called every day and sent flowers. Then a woman walked in...',
    author   : 'Aisha K.',
    initials : 'AK',
    time     : '5h ago',
    read     : '4 min',
    body     : [
      'We met at a wedding in Kampala. He was charming and laughed at all my jokes.',
      'For six months he called every day, sent flowers, said things no one had ever said to me.',
      'Then a woman walked into my workplace and placed a photo on my desk — him, her, and two small children.',
      'She didn\'t shout. She just said, "This is the third time."',
      'I called him. He didn\'t deny it. He just said, "It\'s complicated."',
      'Trust what you can verify, not just what feels good.',
    ],
  },

  {
    img      : 'pics/13.jpg',
    cat      : 'Hustle',
    cc       : 'cc-money',
    badge    : 'Hustle',
    title    : 'I Started a Business With UGX 5,000.',
    snippet  : 'Five thousand shillings, a borrowed stove, and a bag of groundnuts — that\'s how it began...',
    author   : 'Brian M.',
    initials : 'BM',
    time     : 'Yesterday',
    read     : '6 min',
    body     : [
      'I started my first business with five thousand shillings — enough for groundnuts, a borrowed stove, and a plastic scoop.',
      'I set up outside Wandegeya market every evening after school. The first day I made nine thousand.',
      'Within three months I had two stoves, a helper, and a savings account.',
      'I wasted two years waiting for a "big opportunity" before I realised the small one was already there.',
      'Today I run a food supply chain serving six schools in central Uganda.',
      'Stop waiting for the right moment. The moment is right now.',
    ],
  },

  {
    img      : 'pics/story4.jpg',
    cat      : 'Drama',
    cc       : 'cc-drama',
    badge    : 'Drama',
    title    : 'My Roommate Sold My Laptop and Denied Everything.',
    snippet  : 'I came home one Tuesday to find my laptop gone. She looked me in the eye and said she had no idea...',
    author   : 'Sandra N.',
    initials : 'SN',
    time     : '2d ago',
    read     : '3 min',
    body     : [
      'I came home one Tuesday to find my laptop gone. My roommate told me she hadn\'t seen it.',
      'I searched everywhere, filed a report, borrowed money to replace it. She kept a straight face the whole time.',
      'Three weeks later a classmate sent me a photo — my laptop listed on a Facebook buy-and-sell group.',
      'When I confronted her she broke down. She had borrowed money from someone dangerous and was desperate.',
      'I moved out that weekend.',
      'The hardest part was realising she had looked me in the eye and lied for three weeks.',
    ],
  },

  {
    img      : 'pics/story5.jpg',
    cat      : 'Life',
    cc       : 'cc-life',
    badge    : 'Inspiring',
    title    : 'I Failed UNEB Twice. Now I Own a School.',
    snippet  : 'The first time I failed I said it was bad luck. The second time I couldn\'t find excuses. I was twenty with no certificate...',
    author   : 'Moses W.',
    initials : 'MW',
    time     : '3d ago',
    read     : '5 min',
    body     : [
      'The first time I failed UCE I said it was bad luck. The second time I couldn\'t find excuses.',
      'I spent a year doing manual work — construction, offloading trucks, digging trenches.',
      'I started reading on my own. I sat my exams a third time privately and passed.',
      'Instead of university I used my savings to start a tutoring group for children who couldn\'t afford school fees.',
      'Six students became twenty. Twenty became eighty.',
      'Today Watoto wa Taifa Primary School has 340 enrolled pupils. Failure is only final if you decide it is.',
    ],
  },

];


// ─────────────────────────────────────────
//  RENDER ENGINE — do not edit below
// ─────────────────────────────────────────

const likedMap  = {};
const likeCounts = {};

function render() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';

  DATA.forEach(function(s, i) {

    likeCounts[i] = 0;

    const card = document.createElement('div');
    card.className = 'scard';
    card.dataset.i = i;

    const paras = s.body
      .map(function(p) { return '<p>' + p + '</p>'; })
      .join('');

    card.innerHTML =
      '<div class="scard-thumb">' +
        '<img src="' + s.img + '" alt="' + s.title + '">' +
        '<div class="thumb-badge">' + s.badge + '</div>' +
        '<div class="thumb-overlay">' +
          '<div class="thumb-cat ' + s.cc + '">' + s.cat + '</div>' +
          '<div class="thumb-title">' + s.title + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="scard-preview">' +
        '<div class="preview-snippet">' + s.snippet + '</div>' +
        '<div class="preview-meta">' +
          '<div class="meta-left">' +
            '<div class="mini-av">' + s.initials + '</div>' +
            '<span class="meta-author">' + s.author + '</span>' +
            '<span class="dot">·</span>' +
            '<span>' + s.read + ' read</span>' +
            '<span class="dot">·</span>' +
            '<span>' + s.time + '</span>' +
          '</div>' +
          '<div class="read-more">see more<span class="read-arrow">⌄</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="scard-article">' +
        '<div class="article-body">' + paras + '</div>' +
        '<div class="reactions">' +
          '<button class="like-btn" data-i="' + i + '">' +
            '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
            '</svg>' +
            '<span class="lcount">0</span>' +
          '</button>' +
          '<button class="show-less" data-i="' + i + '">Show less</button>' +
        '</div>' +
      '</div>';

    feed.appendChild(card);
  });

  // expand / collapse
  feed.querySelectorAll('.scard').forEach(function(card) {
    var thumb   = card.querySelector('.scard-thumb');
    var preview = card.querySelector('.scard-preview');

    function toggleOpen(e) {
      var isOpen = card.classList.contains('open');
      feed.querySelectorAll('.scard').forEach(function(c) {
        c.classList.remove('open');
      });
      if (!isOpen) {
        card.classList.add('open');
        setTimeout(function() {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
    }

    thumb.addEventListener('click', toggleOpen);
    preview.addEventListener('click', toggleOpen);
  });

  // show less
  feed.querySelectorAll('.show-less').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var card = btn.closest('.scard');
      card.classList.remove('open');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // like
  feed.querySelectorAll('.like-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var i = btn.dataset.i;
      likedMap[i] = !likedMap[i];
      likeCounts[i] = likedMap[i]
        ? likeCounts[i] + 1
        : Math.max(0, likeCounts[i] - 1);
      btn.classList.toggle('liked', likedMap[i]);
      btn.querySelector('.lcount').textContent = likeCounts[i];
    });
  });
}

render();
