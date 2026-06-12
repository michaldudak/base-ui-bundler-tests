'use client';

// This file is generated from templates/BaseUiFixture.tsx. Edit the template instead.
import { Menu } from '@base-ui/react/menu';
import { Slider } from '@base-ui/react/slider';
import { Tabs } from '@base-ui/react/tabs';

const menuItemClassName = 'base-ui-bundler-menu-item';
const menuTriggerClassName = 'base-ui-bundler-menu-trigger';
const sliderThumbClassName = 'base-ui-bundler-slider-thumb';
const tabClassName = 'base-ui-bundler-tab';

const fixtureCss = `
  .${tabClassName}:focus-visible,
  .${menuTriggerClassName}:focus-visible,
  .${menuItemClassName}:focus-visible,
  .${sliderThumbClassName}:has(input:focus-visible) {
    outline: 2px solid #2368e8;
    outline-offset: 2px;
  }

  .${menuItemClassName}:hover,
  .${menuItemClassName}:focus,
  .${menuItemClassName}[data-highlighted] {
    background: #eef4ff;
  }
`;

const styles = {
  page: {
    display: 'grid',
    gap: 32,
    maxWidth: 720,
    margin: '40px auto',
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  section: {
    display: 'grid',
    gap: 16,
  },
  heading: {
    margin: 0,
    fontSize: 18,
  },
  menuTrigger: {
    justifySelf: 'start',
    padding: '8px 12px',
    border: '1px solid #b8c3d5',
    borderRadius: 4,
    background: '#ffffff',
    color: '#182230',
    font: 'inherit',
  },
  menuPopup: {
    display: 'grid',
    minWidth: 168,
    padding: 4,
    border: '1px solid #d7dde8',
    borderRadius: 6,
    background: '#ffffff',
    boxShadow: '0 10px 24px rgb(24 34 48 / 14%)',
  },
  menuItem: {
    padding: '8px 10px',
    borderRadius: 4,
    color: '#182230',
    cursor: 'default',
    font: 'inherit',
  },
  tabsList: {
    position: 'relative',
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid #d7dde8',
  },
  tab: {
    padding: '10px 12px',
    border: 0,
    background: 'transparent',
    color: '#182230',
    font: 'inherit',
  },
  tabsIndicator: {
    position: 'absolute',
    left: 'var(--active-tab-left)',
    bottom: -1,
    width: 'var(--active-tab-width)',
    height: 2,
    background: '#2368e8',
  },
  sliderRoot: {
    display: 'grid',
    gap: 12,
  },
  sliderControl: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: 320,
    maxWidth: '100%',
    height: 32,
  },
  sliderTrack: {
    position: 'relative',
    width: '100%',
    height: 6,
    borderRadius: 999,
    background: '#d7dde8',
  },
  sliderIndicator: {
    position: 'absolute',
    height: '100%',
    borderRadius: 999,
    background: '#2368e8',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#ffffff',
    border: '2px solid #2368e8',
    boxSizing: 'border-box',
  },
} as const;

export function BaseUiFixture() {
  return (
    <main data-testid="base-ui-fixture" style={styles.page}>
      <style>{fixtureCss}</style>
      <section style={styles.section} aria-label="Tabs">
        <h1 style={styles.heading}>Tabs</h1>
        <Tabs.Root defaultValue="bundlers">
          <Tabs.List style={styles.tabsList}>
            <Tabs.Tab className={tabClassName} value="bundlers" style={styles.tab}>
              Bundlers
            </Tabs.Tab>
            <Tabs.Tab className={tabClassName} value="ssr" style={styles.tab}>
              SSR
            </Tabs.Tab>
            <Tabs.Indicator renderBeforeHydration={false} style={styles.tabsIndicator} />
          </Tabs.List>
        </Tabs.Root>
      </section>

      <section style={styles.section} aria-label="Menu">
        <h1 style={styles.heading}>Menu</h1>
        <Menu.Root>
          <Menu.Trigger className={menuTriggerClassName} style={styles.menuTrigger}>
            Options
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="start">
              <Menu.Popup style={styles.menuPopup}>
                <Menu.Item className={menuItemClassName} style={styles.menuItem}>
                  First action
                </Menu.Item>
                <Menu.Item className={menuItemClassName} style={styles.menuItem}>
                  Second action
                </Menu.Item>
                <Menu.Item className={menuItemClassName} style={styles.menuItem}>
                  Third action
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </section>

      <section style={styles.section} aria-label="Slider">
        <h1 style={styles.heading}>Slider</h1>
        <Slider.Root
          defaultValue={[20, 80]}
          min={0}
          max={100}
          step={5}
          thumbAlignment="edge"
          style={styles.sliderRoot}
        >
          <Slider.Control style={styles.sliderControl}>
            <Slider.Track style={styles.sliderTrack}>
              <Slider.Indicator style={styles.sliderIndicator} />
            </Slider.Track>
            <Slider.Thumb
              className={sliderThumbClassName}
              index={0}
              getAriaLabel={() => 'Minimum confidence'}
              style={styles.sliderThumb}
            />
            <Slider.Thumb
              className={sliderThumbClassName}
              index={1}
              getAriaLabel={() => 'Maximum confidence'}
              style={styles.sliderThumb}
            />
          </Slider.Control>
        </Slider.Root>
      </section>
    </main>
  );
}
