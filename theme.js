var LIGHT_MODE_STORAGE_KEY = "jisscrol-theme";
var savedLightMode = localStorage.getItem(LIGHT_MODE_STORAGE_KEY);

if (savedLightMode === null) {
  savedLightMode = "true";
  localStorage.setItem(LIGHT_MODE_STORAGE_KEY, savedLightMode);
}

document.documentElement.classList.toggle(
  "light-mode",
  savedLightMode === "true",
);
