# @mlaursen/release-script

## This project has been moved to https://github.com/mlaursen/npm-packages/packages/release-script
This is the normal npm release script I use. This requires:

- [changesets](https://github.com/changesets/changesets) to handle bumping
  versions and generating changelogs.
- A Github [release token](https://github.com/settings/personal-access-tokens)
  - The token only needs repository access
  - This is normally stored as `GITHUB_TOKEN` in an `.env.local` file that
    should not be committed

## Installation

The release script relies on
[changesets](https://github.com/changesets/changesets) to handle bumping
versions and generating changelogs.

```sh
pnpm install --save-dev @mlaursen/release-script \
  @changesets/cli \
  tsx
```

Setup the `.changeset` dir if needed:

```sh
pnpm changeset init
git add .changeset
git add -u
git commit -m "build: setup changesets"
```

## Usage

Create a `scripts/release.ts` file with:

```ts
import { release } from "@mlaursen/release-script";

await release({
  repo: "{{REPO_NAME}}", // i.e. eslint-config

  // if the repo is not under `mlaursen` for some reason
  // owner: "mlaursen",

  // If there is a custom clean command for releases. `clean` is the default
  // cleanCommand: "clean",

  // If there is a custom build command for releases. `build` is the default
  // buildCommand: "build",

  // An optional flag if the build step should be skipped. `!buildCommand` by default
  // skipBuild: process.argv.includes("--skip-build"),

  // This is useful for monorepos where only a single Github release needs to
  // be created. Defaults to `JSON.parse(await readFile("package.json)).name`
  // mainPackage: "{{PACKAGE_NAME}}",

  // If the version message needs to be customized. The following is the default
  // versionMessage: "build(version): version package",

  // An optional `.env` file path that includes the `GITLAB_TOKEN` environment
  // variable.
  // envPath: ".env.local",

  // An optional async function to get the next release tag name. The default
  // is shown below:
  // getTagName: async () => {
  //   const latestTag = await (
  //     await import("@react-md/release-script")
  //   ).getLatestTag();
  //   let tagName =
  //     mainPackage && /@\d/.test(latestTag)
  //       ? latestTag.replace(/.+(@\d)/, `${mainPackage}$1`)
  //       : latestTag;
  //
  //   return tagName;
  // },
});
```

Next, update `package.json` to include the release script:

```diff
   "scripts": {
     "prepare": "husky",
     "typecheck": "tsc --noEmit",
     "check-format": "prettier --check .",
     "format": "prettier --write .",
     "clean": "rm -rf dist",
     "build": "tsc -p tsconfig.json",
+    "release": "tsx index.ts"
   },
```

Finally, run the release script whenever a new release should go out:

```sh
pnpm release
```

## Alpha Releases

Use the changesets api to enter the pre-release flow:

```sh
pnpm changeset enter pre
```

Once ready to do a real release:

```sh
pnpm changeset exit pre
```
