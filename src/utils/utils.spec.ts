import { dateStamp, normalizeForSearch, slugify } from './text.util';
import { isYouTubeUrl, youTubeEmbedUrl, youTubeVideoId, youTubeWatchUrl } from './youtube.util';

describe('youTubeVideoId', () => {
  const id = 'BBZG9N4cW0U';

  it('reads every common link format', () => {
    const links = [
      `https://www.youtube.com/watch?v=${id}`,
      `https://youtube.com/watch?v=${id}&t=30s`,
      `https://m.youtube.com/watch?v=${id}`,
      `https://youtu.be/${id}`,
      `https://youtu.be/${id}?si=X07lCZhUw5sVzfMZ`,
      `https://www.youtube.com/shorts/${id}`,
      `https://www.youtube.com/embed/${id}`,
      `https://www.youtube.com/live/${id}`,
      `  https://www.youtube.com/watch?v=${id}  `,
    ];
    for (const link of links) expect(youTubeVideoId(link)).withContext(link).toBe(id);
  });

  it('rejects anything that is not a YouTube video', () => {
    const links = [
      '',
      '#',
      'not a url',
      `https://vimeo.com/${id}`,
      `https://www.youtube.com.evil.com/watch?v=${id}`,
      // eslint-disable-next-line sonarjs/code-eval -- a hostile link the parser must reject
      `javascript:alert(1)//youtu.be/${id}`,
      'https://www.youtube.com/watch?v=short',
      'https://www.youtube.com/watch?v=<script>xx',
      'https://www.youtube.com/channel/UCabcdefghijk',
      'https://www.youtube.com/',
    ];
    for (const link of links) expect(youTubeVideoId(link)).withContext(link).toBeNull();
  });

  it('builds privacy-enhanced embed and watch links', () => {
    expect(youTubeEmbedUrl(`https://youtu.be/${id}`)).toBe(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    );
    expect(youTubeWatchUrl(`https://www.youtube.com/shorts/${id}`)).toBe(
      `https://www.youtube.com/watch?v=${id}`
    );
    expect(youTubeEmbedUrl('x')).toBeNull();
    expect(youTubeWatchUrl('x')).toBeNull();
    expect(isYouTubeUrl(`https://youtu.be/${id}`)).toBeTrue();
  });
});

describe('text utilities', () => {
  it('ignores case and accents in searches', () => {
    expect(normalizeForSearch('  Projeção TÊ-waza ')).toBe('projecao te-waza');
  });

  it('makes file-name-safe slugs', () => {
    expect(slugify('11º Kyu - Faixa Branca')).toBe('11o-kyu-faixa-branca');
    expect(slugify('--Ação!!--')).toBe('acao');
  });

  it('stamps dates as YYYYMMDD', () => {
    expect(dateStamp(new Date(2026, 0, 5))).toBe('20260105');
  });
});
