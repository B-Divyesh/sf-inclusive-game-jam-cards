import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('builds and plays a five-card game with no serious accessibility issues', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Pick five cards/);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);

  await page.getByRole('button', { name: /Start the card jam/ }).click();
  for (let step = 0; step < 5; step += 1) {
    await page.locator('[data-choice]').first().click();
    await page.locator('[data-next]').click();
  }
  await expect(page.getByRole('heading', { name: 'Shape Quest' })).toBeVisible();
  const board = page.locator('[data-board]');
  await board.focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('[data-moves]')).toHaveText('1');

  const finishedResults = await new AxeBuilder({ page }).analyze();
  expect(finishedResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('surprise route completes on a 390px-class screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Deal me a surprise/ }).click();
  await expect(page.locator('.recipe li')).toHaveCount(5);
  await expect(page.locator('[data-download]')).toBeVisible();
});
