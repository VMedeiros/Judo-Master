/**
 * In-page navigation to a section by id: scrolls to it and moves focus to its
 * heading, so keyboard and screen-reader users continue from there (a bare
 * scroll would leave focus on the link). Motion follows the reduced-motion
 * setting. Returns false when the page has no such section.
 */
export function goToSection(document: Document, event: Event, id: string): boolean {
  const section = document.getElementById(id);
  if (!section) return false;
  event.preventDefault();
  const reduceMotion = document.defaultView?.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  section.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true });
  return true;
}
