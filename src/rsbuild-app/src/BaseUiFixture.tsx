'use client';

// This file is generated from templates/BaseUiFixture.tsx. Edit the template instead.
import * as React from 'react';
import { Menu } from '@base-ui/react/menu';

export function BaseUiFixture() {
  const [selectedItem, setSelectedItem] = React.useState('No item selected');

  return (
    <div data-testid="base-ui-fixture">
      <Menu.Root>
        <Menu.Trigger>Menu</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item onClick={() => setSelectedItem('Item 1 selected')}>Item 1</Menu.Item>
              <Menu.Item onClick={() => setSelectedItem('Item 2 selected')}>Item 2</Menu.Item>
              <Menu.Item onClick={() => setSelectedItem('Item 3 selected')}>Item 3</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <p aria-live="polite">{selectedItem}</p>
    </div>
  );
}
