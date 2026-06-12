// This file is generated from templates/node-cjs-index.js. Edit the template instead.
const React = require('react');
const { renderToString } = require('react-dom/server');
const { Menu } = require('@base-ui/react/menu');
const { Slider } = require('@base-ui/react/slider');
const { Tabs } = require('@base-ui/react/tabs');

function App() {
  return React.createElement(
    'main',
    null,
    React.createElement(
      'section',
      { 'aria-label': 'Tabs fixture' },
      React.createElement('h1', null, 'Tabs fixture'),
      React.createElement(
        Tabs.Root,
        { defaultValue: 'bundlers' },
        React.createElement(
          Tabs.List,
          null,
          React.createElement(Tabs.Tab, { value: 'bundlers' }, 'Bundlers'),
          React.createElement(Tabs.Tab, { value: 'ssr' }, 'SSR'),
          React.createElement(Tabs.Indicator, { renderBeforeHydration: false }),
        ),
      ),
    ),
    React.createElement(
      'section',
      { 'aria-label': 'Menu fixture' },
      React.createElement('h1', null, 'Menu fixture'),
      React.createElement(
        Menu.Root,
        null,
        React.createElement(Menu.Trigger, null, 'Options'),
        React.createElement(
          Menu.Portal,
          null,
          React.createElement(
            Menu.Positioner,
            null,
            React.createElement(
              Menu.Popup,
              null,
              React.createElement(Menu.Item, null, 'First action'),
              React.createElement(Menu.Item, null, 'Second action'),
              React.createElement(Menu.Item, null, 'Third action'),
            ),
          ),
        ),
      ),
    ),
    React.createElement(
      'section',
      { 'aria-label': 'Slider fixture' },
      React.createElement('h1', null, 'Slider fixture'),
      React.createElement(
        Slider.Root,
        {
          defaultValue: [20, 80],
          min: 0,
          max: 100,
          step: 5,
          thumbAlignment: 'edge',
        },
        React.createElement(
          Slider.Control,
          null,
          React.createElement(Slider.Track, null, React.createElement(Slider.Indicator)),
          React.createElement(Slider.Thumb, {
            index: 0,
            getAriaLabel: () => 'Minimum confidence',
          }),
          React.createElement(Slider.Thumb, {
            index: 1,
            getAriaLabel: () => 'Maximum confidence',
          }),
        ),
      ),
    ),
  );
}

const html = renderToString(React.createElement(App));
console.log(html);
