import { expect, test } from '@playwright/test';
import { projects } from './projects.js';
import { withProjectServer } from './support/project-server.js';

for (const project of projects) {
  test.describe(project.name, () => {
    for (const [mode, config] of Object.entries(project.modes)) {
      test(`${mode} renders interactive Base UI components`, async ({ page }, testInfo) => {
        await withProjectServer({ config, page, testInfo }, async ({ url }) => {
          await page.goto(url, { waitUntil: 'networkidle' });
          await expect(page).toHaveTitle(project.title);

          const fixture = page.getByTestId('base-ui-fixture');

          await expect(fixture.getByRole('heading', { name: 'Tabs' })).toBeVisible();
          const bundlersTab = fixture.getByRole('tab', { name: 'Bundlers' });
          const ssrTab = fixture.getByRole('tab', { name: 'SSR' });

          await expect(bundlersTab).toBeVisible();
          await expect(ssrTab).toBeVisible();
          await expect(bundlersTab).toHaveAttribute('aria-selected', 'true');
          await expect(ssrTab).toHaveAttribute('aria-selected', 'false');

          await ssrTab.click();

          await expect(bundlersTab).toHaveAttribute('aria-selected', 'false');
          await expect(ssrTab).toHaveAttribute('aria-selected', 'true');

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
