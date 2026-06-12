# Base UI bundler testbed

This repo contains a set of projects using different bundlers (and no bundler at all).
It is used to test if Base UI package can successfully be imported and used in these projects.

## Fixture workflow

The shared components live in the `templates` directory.
Edit the template files instead of editing the generated copies inside each project:

- `templates/BaseUiFixture.tsx` is copied into each browser, Next.js, and Jest project.
- `templates/node-esm-index.js` is copied to `src/node-esm-app/index.js`.
- `templates/node-cjs-index.js` is copied to `src/node-cjs-app/index.js`.

Run `pnpm run sync-templates` after changing a template.
The `build` and `test` scripts run this automatically before building or testing.

## Known issues

- Webpack 4 needs to run Babel on node_modules (so not have `exclude: /node_modules/` on the `babel-loader` rule).
  This is required, as Base UI uses newer JS syntax that Webpack doesn't understand.
