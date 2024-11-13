import * as React from 'react';
import { Menu } from '@base_ui/react/Menu';

export function App() {
  return (<div>
    <Menu.Root>
      <Menu.Trigger>
        Menu
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item onClick={() => console.log('Item 1 clicked')}>Item 1</Menu.Item>
          <Menu.Item onClick={() => console.log('Item 2 clicked')}>Item 2</Menu.Item>
          <Menu.Item onClick={() => console.log('Item 3 clicked')}>Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Root>
  </div>);
}
