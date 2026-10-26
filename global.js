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
// notify("Opinion posted", "success")
// notify("Could not reach server", "error", 6000)   // type, then ms on screen (0 = stays until closed)
// Styles (.toast-region, .toast, ...) live in global.css.
(function () {
  var region = null;

  function getRegion() {
    if (region) return region;
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
    return region;
  }

  window.notify = function (message, type, duration) {
    type = type || "info";
    duration = duration === undefined ? 4000 : duration;
    var host = getRegion();

    // don't stack identical messages
    var existing = Array.from(host.children).find(function (t) {
      return t.dataset.msg === message;
    });
    if (existing) {
      existing.classList.remove("show");
      void existing.offsetWidth;
      existing.classList.add("show");
      return;
    }

    var toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.dataset.msg = message;

    var text = document.createElement("span");
    text.className = "toast-text";
    text.textContent = message;               // textContent, so no HTML injection

    var close = document.createElement("button");
    close.type = "button";
    close.className = "toast-close";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "";

    toast.appendChild(text);
    toast.appendChild(close);
    host.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("show"); });

    var timer;
    function remove() {
      clearTimeout(timer);
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 250);
    }
    function start() { if (duration > 0) timer = setTimeout(remove, duration); }

    close.addEventListener("click", remove);
    toast.addEventListener("mouseenter", function () { clearTimeout(timer); });
    toast.addEventListener("mouseleave", start);
    start();

    // keep at most 3 on screen
    while (host.children.length > 3) host.firstChild.remove();
  };
})();