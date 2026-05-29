const FOCUSABLE_SELECTOR =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Foca o primeiro elemento focável dentro do host.
 * Centraliza a lógica duplicada nos componentes modais.
 */
export function focusFirstFocusable(host: HTMLElement): void {
    const el = host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    el?.focus();
}
