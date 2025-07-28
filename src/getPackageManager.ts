import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type PackageManager = "npm" | "yarn" | "pnpm";

export async function getPackageManager(): Promise<PackageManager> {
  const rawPackageJson = await readFile(
    resolve(process.cwd(), "package.json"),
    "utf8"
  );
  const packageJson = JSON.parse(rawPackageJson);

  if (typeof packageJson.volta === "object" && packageJson.volta) {
    const { volta } = packageJson;
    if ("pnpm" in volta) {
      return "pnpm";
    }

    if ("yarn" in volta) {
      return "yarn";
    }

    return "npm";
  }

  if (typeof packageJson.packageManager === "string") {
    const mgr = packageJson.packageManagerreplace(/@.+/, "");

    if (mgr === "pnpm" || mgr === "yarn" || mgr === "npm") {
      return mgr;
    }

    throw new Error(`Unsupported package mananger "${mgr}" in package.json`);
  }

  throw new Error("Unable to find a package manager");
}
