/** How often an app left open looks for a new version. */

export const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;

/** Coming back to the app checks again, but no more often than this. */

export const UPDATE_CHECK_MIN_GAP_MS = 60 * 1000;

/**
 * A new version that finishes downloading this soon after the app is opened or
 * brought back is switched to right away: the person has barely started, so a
 * reload loses nothing. Later on, the app asks first.
 */

export const AUTO_APPLY_WINDOW_MS = 30 * 1000;

/** Published next to index.html by every build (scripts/generate-version.mjs). */

export const PUBLISHED_VERSION_URL = 'version.json';
