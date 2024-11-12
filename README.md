# Base UI bundler testbed

This repo contains a set of projects using different bundlers (and no bundler at all).
It is used to test if Base UI package can successfully be imported and used in these projects.

## Known issues

- Node.js ESM app fails to run as Base UI depends on @mui/utils that does not conform to the ESM spec.

