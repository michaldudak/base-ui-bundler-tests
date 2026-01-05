import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Menu } from '@base-ui/react/menu';

function App() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      Menu.Root,
      null,
      React.createElement(Menu.Trigger, null, 'Menu'),
      React.createElement(
        Menu.Portal,
        null,
        React.createElement(
          Menu.Positioner,
          null,
          React.createElement(
            Menu.Popup,
            null,
            React.createElement(
              Menu.Item,
              { onClick: () => console.log('Item 1 clicked') },
              'Item 1',
            ),
            React.createElement(
              Menu.Item,
              { onClick: () => console.log('Item 2 clicked') },
              'Item 2',
            ),
            React.createElement(
              Menu.Item,
              { onClick: () => console.log('Item 3 clicked') },
              'Item 3',
            ),
          ),
        ),
      ),
    ),
  );
}

const html = renderToString(React.createElement(App));
console.log(html);
