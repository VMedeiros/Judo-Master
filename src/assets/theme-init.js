// Applies the saved theme (light when there is none, as in JudoKan), contrast
// and font size before the first paint,
// so the page never flashes the wrong theme while Angular is still loading.
// Classic script, loaded synchronously from <head>; SettingsService takes over
// once the app boots. Keep the storage key and values in sync with it
// (src/core/constants/app.constants.ts).
(function () {
  var root = document.documentElement;
  var settings;
  try {
    settings = JSON.parse(localStorage.getItem('judo-master:settings') || '{}') || {};
  } catch {
    // Storage blocked or corrupt: fall back to the defaults.
    settings = {};
  }

  var dark = settings.theme === 'dark';
  root.classList.toggle('dark', dark);
  root.classList.toggle('high-contrast', settings.highContrast === true);
  root.style.colorScheme = dark ? 'dark' : 'light';

  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', dark ? '#0a1422' : '#f9fafb');

  var scale = { small: '87.5%', large: '112.5%' }[settings.fontSize];
  if (scale) root.style.fontSize = scale;
})();
