const header = document.getElementById('header');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY + 50) {
    // Scrolling down past 50px threshold
    header.classList.add('hide');
  } else if (currentScrollY < lastScrollY - 50) {
    // Scrolling up past 50px threshold
    header.classList.remove('hide');
  }

  lastScrollY = currentScrollY;
});