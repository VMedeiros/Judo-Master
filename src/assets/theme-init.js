// Applies the saved (or system) theme and font size before the first paint,
// so the page never flashes the wrong theme while Angular is still loading.
// Classic script, loaded synchronously from <head>; ThemeService takes over
// once the app boots. Keep the storage key and values in sync with it
// (src/constants/app.constants.ts).
(function () {
  var root = document.documentElement;
  var settings;
  try {
    settings = JSON.parse(localStorage.getItem('judo-master:settings') || '{}') || {};
  } catch {
    // Storage blocked or corrupt: fall back to the defaults.
    settings = {};
  }

  var prefersDark =
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  var dark = settings.theme === 'dark' || (settings.theme !== 'light' && prefersDark);
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';

  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', dark ? '#0a1422' : '#e8f0f7');

  var scale = { small: '87.5%', large: '112.5%' }[settings.fontSize];
  if (scale) root.style.fontSize = scale;
})();
