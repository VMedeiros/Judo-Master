import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** WCAG 2.1 A and AA: the bar the app is held to. */
async function expectAccessible(page: Page): Promise<void> {
  // Mid-fade, text is translucent and fails the contrast check: audit the settled page.
  await page.waitForFunction(() =>
    document.getAnimations().every(animation => animation.playState !== 'running')
  );
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
    await page.getByLabel('Faixa', { exact: true }).selectOption(String(index));
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
  await page.goto('/tecnicas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Técnicas por faixa');
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { consoleErrors: string[] }).consoleErrors).toEqual([]);
});

test('shows the first belt, its techniques and passes an accessibility audit', async ({ page }) => {
  // JudoKan's frame: the brand in the header, one main landmark, the footer.
  await expect(page.getByRole('banner')).toContainText('Judô Master');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: /JudoKan/ })).toBeVisible();
  await expect(page.getByRole('tabpanel')).toContainText('Faixa Branca');
  await expect(page.getByRole('table')).toContainText('Sensei');
  await expectAccessible(page);
});

test('opens light whatever the system prefers, as JudoKan does', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
});

test('is accessible in the dark theme too', async ({ page }) => {
  await page.getByRole('button', { name: 'Configurações' }).click();
  await page.getByRole('button', { name: 'Escuro', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expectAccessible(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // The choice survives a reload without a flash of the light theme.
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expectAccessible(page);
});

for (const theme of ['light', 'dark'] as const) {
  test(`high contrast passes the accessibility audit in the ${theme} theme`, async ({ page }) => {
    await page.getByRole('button', { name: 'Configurações' }).click();
    const dialog = page.getByRole('dialog', { name: 'Configurações' });
    await dialog
      .getByRole('button', { name: theme === 'dark' ? 'Escuro' : 'Claro', exact: true })
      .click();
    await dialog.getByLabel('Alto contraste').check();
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).toHaveClass(/\bhigh-contrast\b/);
    await expectAccessible(page);
    // Applied before the first paint on the next visit too.
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/\bhigh-contrast\b/);
  });
}

test('fits phone, tablet and desktop screens without sideways scrolling', async ({ page }) => {
  for (const [width, height] of [
    [360, 780],
    [820, 1180],
    [1366, 860],
  ] as const) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole('tabpanel')).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${width}px`).toBe(0);
  }
});

test('the scroll-to-top button appears down the page and brings focus back to the top', async ({
  page,
}) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const toTop = page.getByRole('button', { name: 'Voltar ao topo' });
  await toTop.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('#main-content')).toBeFocused();
});

test('switches belts and searches ignoring accents', async ({ page }) => {
  await selectBelt(page, 2);
  await expect(page.getByRole('tabpanel')).toContainText('Faixa Amarela');

  await page.getByRole('searchbox', { name: 'Buscar técnica' }).fill('projecao');
  // The yellow belt has 45 techniques; the counter shows "N de 45 técnicas".
  await expect(page.getByText('de 45 técnicas')).toBeVisible();

  await page.getByRole('searchbox', { name: 'Buscar técnica' }).fill('zzzz-nada');
  await expect(page.getByText('Nada encontrado')).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca' }).click();
  await expect(page.getByRole('table')).toBeVisible();
});

test('adds, edits and removes a technique, keeping it after a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Nova técnica' }).click();
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
    .getByRole('button', { name: /^Assistir à demonstração de / })
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
  await page.getByRole('button', { name: 'Fonte grande' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /font-size: 112\.5%/);

  await page.getByRole('button', { name: 'Restaurar técnicas originais' }).click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Restaurar', exact: true })
    .click();
  await expect(page.getByRole('button', { name: 'Ver detalhes de Sensei' })).toBeVisible();
});

test('opens the About dialog from the settings and from the footer', async ({ page }) => {
  await page.getByRole('contentinfo').getByRole('button', { name: 'Sobre o Judô' }).click();
  await expect(page.getByRole('dialog', { name: 'Sobre o Judô' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Configurações' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Sobre o Judô' }).click();
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

test.describe('the home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chegue preparado');
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`passes the accessibility audit in the ${theme} theme`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      if (theme === 'dark') {
        await page.getByRole('button', { name: 'Opções de exibição' }).click();
        await page.getByRole('button', { name: 'Escuro', exact: true }).click();
        await page.keyboard.press('Escape');
      }
      // Bring every section, and the deferred belts, onto the page before the audit.
      for (const id of ['recursos', 'faixas', 'como-funciona', 'privacidade', 'duvidas']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      }
      await expect(page.locator('app-belts-overview a').first()).toBeVisible();
      for (const summary of await page.locator('summary').all()) await summary.click();
      await expectAccessible(page);
    });
  }

  test('fits phone, tablet and desktop screens without sideways scrolling', async ({ page }) => {
    for (const [width, height] of [
      [360, 780],
      [820, 1180],
      [1366, 860],
    ] as const) {
      await page.setViewportSize({ width, height });
      await expect(
        page.getByRole('banner').getByRole('link', { name: 'Ver técnicas' })
      ).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${width}px`).toBe(0);
    }
  });

  test('opens the techniques on the belt picked here, and comes back with "Voltar"', async ({
    page,
  }) => {
    await page.locator('#faixas').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /Faixa Amarela/ }).click();
    await expect(page).toHaveURL(/\/tecnicas\?faixa=/);
    await expect(page.getByRole('tabpanel')).toContainText('Faixa Amarela');

    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chegue preparado');
  });

  test('the address follows the belt on screen, and Back skips the belts seen', async ({
    page,
  }) => {
    await page.locator('#faixas').scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: /Faixa Amarela/ }).click();
    await expect(page).toHaveURL(/\/tecnicas\?faixa=/);
    const amarela = page.url();

    await selectBelt(page, 4);
    await expect(page).not.toHaveURL(amarela);
    await expect(page).toHaveURL(/\/tecnicas\?faixa=/);
    // A reload opens the belt that was on screen, not the one picked on the home page.
    await page.reload();
    await expect(page.getByRole('tabpanel')).toContainText('Faixa Verde');

    // The browser's Back goes to the home page, not through the belts seen.
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chegue preparado');
    await page.goForward();
    await expect(page.getByRole('tabpanel')).toContainText('Faixa Verde');
  });

  test('the techniques page opens directly from its address, and the brand leads home', async ({
    page,
  }) => {
    await page.goto('/tecnicas');
    await expect(page).toHaveTitle('Técnicas por faixa · Judô Master');
    await page
      .getByRole('link', { name: 'Judô Master Técnicas por faixa, página inicial' })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chegue preparado');
    await expect(page).toHaveTitle('Técnicas de judô para cada faixa · Judô Master');
  });
});
