import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BaseUiFixture } from './BaseUiFixture';

test('Menu renders', async () => {
  render(<BaseUiFixture />);

  const menuButton = screen.getByRole('button');

  fireEvent.click(menuButton);
  await act(async () => {});

  const item1 = screen.queryByText('Item 1');
  expect(item1).not.toBeNull();

  fireEvent.click(item1!);
});
