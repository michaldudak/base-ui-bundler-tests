import { expect, test } from '@playwright/test';
import { projects } from './projects.js';
import { withProjectServer } from './support/project-server.js';

for (const project of projects) {
  test.describe(project.name, () => {
    for (const [mode, config] of Object.entries(project.modes)) {
      test(`${mode} renders and handles menu interaction`, async ({ page }, testInfo) => {
        await withProjectServer({ config, page, testInfo }, async ({ url }) => {
          await page.goto(url, { waitUntil: 'networkidle' });
          await expect(page).toHaveTitle(project.title);

          const fixture = page.getByTestId('base-ui-fixture');

          await expect(fixture.getByRole('button', { name: 'Menu' })).toBeVisible();
          await expect(fixture.getByText('No item selected')).toBeVisible();

          await fixture.getByRole('button', { name: 'Menu' }).click();
          await expect(page.getByRole('menuitem', { name: 'Item 2' })).toBeVisible();

          await page.getByRole('menuitem', { name: 'Item 2' }).click();
          await expect(fixture.getByText('Item 2 selected')).toBeVisible();
        });
      });
    }
  });
}
