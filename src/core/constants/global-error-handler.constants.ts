/** How long to stay quiet after reporting, so an error loop cannot flood the screen. */
export const QUIET_PERIOD_MS = 5000;

/**
 * What browsers say when a lazily loaded part of the app is gone: the page was
 * opened before a new version was published.
 */
export const STALE_CHUNK =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i;

/** Set while reloading for a new version, so a broken deploy cannot loop. */
export const RELOAD_FLAG = 'judo-master:stale-chunk-reload';
