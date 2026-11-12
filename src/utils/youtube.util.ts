const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);
/** Path prefixes that carry the video id as the next segment. */
const ID_PATHS = new Set(['shorts', 'embed', 'live', 'v']);

/**
 * Extracts the video id from any common YouTube link: watch, youtu.be,
 * shorts, embed and live, on desktop or mobile hosts. Returns null for
 * anything else, so only a validated 11-character id ever reaches an iframe.
 */
export function youTubeVideoId(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const segments = url.pathname.split('/').filter(Boolean);
  let id: string | null = null;
  if (url.hostname === 'youtu.be') {
    id = segments[0] ?? null;
  } else if (YOUTUBE_HOSTS.has(url.hostname)) {
    if (segments[0] === 'watch') id = url.searchParams.get('v');
    else if (segments.length >= 2 && ID_PATHS.has(segments[0] ?? '')) id = segments[1] ?? null;
  }
  return id !== null && VIDEO_ID.test(id) ? id : null;
}

export function isYouTubeUrl(rawUrl: string): boolean {
  return youTubeVideoId(rawUrl) !== null;
}

/** Privacy-enhanced embed: YouTube sets no cookies until the video plays. */
export function youTubeEmbedUrl(rawUrl: string): string | null {
  const id = youTubeVideoId(rawUrl);
  return id === null ? null : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

export function youTubeWatchUrl(rawUrl: string): string | null {
  const id = youTubeVideoId(rawUrl);
  return id === null ? null : `https://www.youtube.com/watch?v=${id}`;
}
