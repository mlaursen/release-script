# @mlaursen/release-script

## 0.0.6

### Patch Changes

- BREAKING CHANGES
  - Default token name is now `GITHUB_RELEASE_TOKEN` instead of `GITHUB_TOKEN`

  Features
  - Added `tokenName` option with defaults to `GITHUB_RELEASE_TOKEN`

  Bug fixes
  - Continue release should correctly stall until accepted

## 0.0.5

### Patch Changes

- Added suupport for repos that do not have a build step

## 0.0.4

### Patch Changes

- Fixed monorepos failing since there is no root CHANGELOG.md.

## 0.0.3

### Patch Changes

- Hopefully fixed reusing existing tags instead of creating a new tag for Github releases.

## 0.0.2

### Patch Changes

- Hopefully fixed the remaining issues.

## 0.0.1

### Patch Changes

- The first release. Let's see if it works!
