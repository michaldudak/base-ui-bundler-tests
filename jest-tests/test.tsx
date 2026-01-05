import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Menu } from '@base-ui/react/menu';

test('Menu renders', async () => {
  const handleItemClick = jest.fn();

  render(
    <Menu.Root>
      <Menu.Trigger>Menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item onClick={handleItemClick}>Item 1</Menu.Item>
            <Menu.Item>Item 2</Menu.Item>
            <Menu.Item>Item 3</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );

  const menuButton = screen.getByRole('button');

  fireEvent.click(menuButton);
  await act(async () => {});

  const item1 = screen.queryByText('Item 1');
  expect(item1).not.toBeNull();

  fireEvent.click(item1!);
  expect(handleItemClick.mock.calls.length).toBe(1);
});
