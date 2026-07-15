# Base UI bundler testbed

This repo contains a set of projects using different bundlers (and no bundler at all).
It is used to test if Base UI package can successfully be imported and used in these projects.

## Fixture workflow

The shared browser component lives in the `templates` directory.
Edit the template instead of editing the generated copies inside each project:

- `templates/BaseUiFixture.tsx` is copied into each browser, Next.js, and Jest project.

`pnpm install` generates the copies automatically. The root `build`, `typecheck`, `test`, and
`test:browser` scripts also synchronize them before running, and you can run
`pnpm run sync-templates` explicitly after changing a template.

## Known issues

- Parcel app doesn't work out of the box.
  It has to be configured to support export conditions in package.json.
  The configuration must be present in the package.json of the Parcel project (https://github.com/parcel-bundler/parcel/issues/4155#issuecomment-2194126835).
- Webpack 4 needs to run Babel on node_modules (so not have `exclude: /node_modules/` on the `babel-loader` rule).
  This is required, as Base UI uses newer JS syntax that Webpack doesn't understand.
- Webpack 4 does not support package `imports` specifiers such as `#prehydration/tabs/indicator`.
  It requires aliasing the Base UI prehydration imports to their browser stub files manually.
  This is a webpack 4 compatibility workaround; newer bundlers resolve the package `imports` map directly.
