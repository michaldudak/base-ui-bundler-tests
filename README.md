# Base UI bundler testbed

This repo contains a set of projects using different bundlers (and no bundler at all).
It is used to test if Base UI package can successfully be imported and used in these projects.

## Known issues

- Parcel app doesn't work out of the box.
  It has to be configured to support export conditions in package.json.
  The configuration must be present in the root package.json of the monorepo (https://github.com/parcel-bundler/parcel/issues/4155#issuecomment-2194126835).
