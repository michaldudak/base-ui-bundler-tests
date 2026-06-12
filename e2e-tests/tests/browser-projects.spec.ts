import { expect, test } from '@playwright/test';
import { projects } from './projects.js';
import { withProjectServer } from './support/project-server.js';

for (const project of projects) {
  test.describe(project.name, () => {
    for (const [mode, config] of Object.entries(project.modes)) {
      test(`${mode} renders the Tabs and Slider fixture`, async ({ page }, testInfo) => {
        await withProjectServer({ config, page, testInfo }, async ({ url }) => {
          await page.goto(url, { waitUntil: 'networkidle' });
          await expect(page).toHaveTitle(project.title);

          const fixture = page.getByTestId('base-ui-fixture');

          await expect(fixture.getByRole('heading', { name: 'Tabs' })).toBeVisible();
          await expect(fixture.getByRole('tab', { name: 'Bundlers' })).toBeVisible();
          await expect(fixture.getByRole('tab', { name: 'SSR' })).toBeVisible();

          await expect(fixture.getByRole('heading', { name: 'Slider' })).toBeVisible();

          const sliders = fixture.getByRole('slider');
          await expect(sliders).toHaveCount(2);
          await expect(sliders.nth(0)).toHaveAttribute('aria-label', 'Minimum confidence');
          await expect(sliders.nth(1)).toHaveAttribute('aria-label', 'Maximum confidence');
        });
      });
    }
  });
}
