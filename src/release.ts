import { execSync, type ExecSyncOptions } from "node:child_process";
import { continueRelease } from "./continueRelease.js";
import { getCurrentChangeset } from "./getCurrentChangeset.js";
import { getPackageManager } from "./getPackageManager.js";
import { getReleaseVersion } from "./getReleaseVersion.js";
import {
  ConfigurableCreateReleaseOptions,
  createRelease,
} from "./createRelease.js";
import { getTagPrefix } from "./getTagPrefix.js";

const exec = (command: string, opts?: ExecSyncOptions): void => {
  console.log(command);
  execSync(command, opts);
};

export interface ReleaseOptions extends ConfigurableCreateReleaseOptions {
  skipBuild?: boolean;
  cleanCommand?: string;
  buildCommand?: string;

  mainPackage?: string;

  versionMessage?: string;
}

export async function release(options: ReleaseOptions): Promise<void> {
  const {
    owner,
    repo,
    envPath,
    skipBuild,
    cleanCommand = "clean",
    buildCommand = "build",
    mainPackage,
    versionMessage = "build(version): version package",
  } = options;

  const pkgManager = await getPackageManager();

  if (!skipBuild) {
    exec(`${pkgManager} ${cleanCommand}`);
    exec(`${pkgManager} ${buildCommand}`);
  }
  exec(`${pkgManager} changeset`, { stdio: "inherit" });
  await continueRelease();

  exec("git add -u");
  exec("git add .changeset");

  const changeset = await getCurrentChangeset();
  exec("pnpm changeset version", { stdio: "inherit" });
  exec("git add -u");

  const version = await getReleaseVersion(mainPackage);
  await continueRelease();

  exec(`git commit -m "${versionMessage}"`);
  exec(`${pkgManager} changeset publish`, { stdio: "inherit" });
  exec("git push --follow-tags");

  await createRelease({
    owner,
    repo,
    body: changeset,
    tagPrefix: await getTagPrefix(mainPackage),
    version,
    envPath,
    prerelease: version.includes("next"),
  });
}
