import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { BaseUiFixture } from './BaseUiFixture';

test('Base UI prehydration fixture renders', async () => {
  render(<BaseUiFixture />);
  await act(async () => {});

  expect(screen.getByRole('tab', { name: 'Bundlers' })).not.toBeNull();
  expect(screen.getByText('Bundlers panel')).not.toBeNull();
  expect(screen.getByRole('button', { name: 'Options' })).not.toBeNull();
  expect(screen.getAllByRole('slider', { hidden: true }).length).toBe(2);
});
