import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** WCAG 2.1 A and AA: the bar the app is held to. */
async function expectAccessible(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const summary = results.violations.map(
    v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`
  );
  expect(summary).toEqual([]);
}

function isMobile(page: Page): boolean {
  return (page.viewportSize()?.width ?? 1024) < 640;
}

async function selectBelt(page: Page, index: number): Promise<void> {
  if (isMobile(page)) {
    await page.getByLabel('Selecionar faixa de graduação').selectOption(String(index));
  } else {
    await page.getByRole('tab').nth(index).click();
  }
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  (page as Page & { consoleErrors: string[] }).consoleErrors = errors;
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Judô');
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { consoleErrors: string[] }).consoleErrors).toEqual([]);
});

test('shows the first belt, its techniques and passes an accessibility audit', async ({ page }) => {
  await expect(page.getByRole('tabpanel')).toContainText('Faixa Branca');
  await expect(page.getByRole('table')).toContainText('Sensei');
  await expectAccessible(page);
});

test('is accessible in the dark theme too', async ({ page }) => {
  await page.getByRole('button', { name: 'Configurações' }).click();
  await page.getByRole('switch', { name: 'Tema escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expectAccessible(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // The choice survives a reload without a flash of the light theme.
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expectAccessible(page);
});

test('switches belts and searches ignoring accents', async ({ page }) => {
  await selectBelt(page, 2);
  await expect(page.getByRole('tabpanel')).toContainText('Faixa Amarela');

  await page.getByRole('searchbox', { name: 'Buscar técnica' }).fill('projecao');
  // The yellow belt has 45 techniques; the counter shows "N de 45 técnicas".
  await expect(page.getByText('de 45 técnicas')).toBeVisible();

  await page.getByRole('searchbox', { name: 'Buscar técnica' }).fill('zzzz-nada');
  await expect(page.getByText('Nenhum resultado para')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca' }).click();
  await expect(page.getByRole('table')).toBeVisible();
});

test('adds, edits and removes a technique, keeping it after a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar técnica' }).click();
  const form = page.getByRole('dialog', { name: 'Adicionar técnica' });
  await form.getByRole('button', { name: 'Salvar' }).click();
  await expect(form.getByText('Informe o nome da técnica')).toBeVisible();

  await form.getByLabel('Nome').fill('Técnica E2E');
  await form.getByLabel('Descrição').fill('Criada pelo teste de ponta a ponta');
  await form.getByLabel('Vídeo de demonstração (YouTube)').fill('https://youtu.be/BBZG9N4cW0U');
  await expectAccessible(page);
  await form.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('table')).toContainText('Técnica E2E');

  await page.reload();
  await expect(page.getByRole('table')).toContainText('Técnica E2E');

  await page.getByRole('button', { name: 'Editar Técnica E2E' }).click();
  await page.getByRole('dialog').getByLabel('Nome').fill('Técnica E2E editada');
  await page.getByRole('dialog').getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByRole('table')).toContainText('Técnica E2E editada');

  await page.getByRole('button', { name: 'Remover Técnica E2E editada' }).click();
  const confirm = page.getByRole('alertdialog', { name: 'Remover técnica' });
  await expect(confirm.getByRole('button', { name: 'Cancelar' })).toBeFocused();
  await confirm.getByRole('button', { name: 'Sim, remover' }).click();
  await expect(page.getByRole('table')).not.toContainText('Técnica E2E editada');
});

test('opens the details, steps through techniques and returns focus on close', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Ver detalhes de Sensei' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Sensei' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Técnica anterior' })).toBeDisabled();
  await expectAccessible(page);

  await dialog.getByRole('button', { name: 'Próxima técnica' }).click();
  await expect(page.getByRole('dialog', { name: 'Fundador do Judô' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('plays demonstrations in the privacy-enhanced YouTube player', async ({ page }) => {
  await page
    .getByRole('button', { name: /^Assistir demonstração de / })
    .first()
    .click();
  const frame = page.getByRole('dialog').locator('iframe');
  await expect(frame).toHaveAttribute(
    'src',
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}/
  );
});

test('changes the font size and restores the original techniques', async ({ page }) => {
  await page.getByRole('button', { name: 'Remover Sensei' }).click();
  await page.getByRole('button', { name: 'Sim, remover' }).click();
  await expect(page.getByRole('button', { name: 'Ver detalhes de Sensei' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Configurações' }).click();
  await page.getByRole('button', { name: 'Fonte Grande' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /font-size: 112\.5%/);

  await page.getByRole('button', { name: 'Restaurar técnicas originais' }).click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Restaurar', exact: true })
    .click();
  await expect(page.getByRole('button', { name: 'Ver detalhes de Sensei' })).toBeVisible();
});

test('opens the About dialog from the settings', async ({ page }) => {
  await page.getByRole('button', { name: 'Configurações' }).click();
  await page.getByRole('button', { name: /Sobre o/ }).click();
  const about = page.getByRole('dialog', { name: 'Sobre o Judô' });
  await expect(about).toContainText('精力善用');
  await expectAccessible(page);
});

test('downloads the belt as Excel and PDF', async ({ page }) => {
  for (const [label, extension] of [
    ['Excel', 'xlsx'],
    ['PDF', 'pdf'],
  ] as const) {
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: label, exact: true }).click();
    expect((await download).suggestedFilename()).toMatch(
      new RegExp(String.raw`^judo-master-11o-kyu-faixa-branca-\d{8}\.${extension}$`)
    );
  }
});

test('lets keyboard users skip to the content and move between tabs with the arrows', async ({
  page,
}) => {
  test.skip(isMobile(page), 'Tabs are a select on phones');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir para o conteúdo principal' })).toBeFocused();

  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab').nth(1)).toBeFocused();
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected', 'true');
});
