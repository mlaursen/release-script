import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function getReleaseVersion(mainPackage?: string): Promise<string> {
  let packageJsonPath = "package.json";
  if (mainPackage) {
    packageJsonPath = `packages/${mainPackage}.json`;
  }

  packageJsonPath = resolve(process.cwd(), packageJsonPath);

  const packageJson = await readFile(packageJsonPath, "utf8");
  const { version } = JSON.parse(packageJson);

  if (
    await confirm({
      message: `Is "${version}" the next github release version?`,
    })
  ) {
    return version;
  }

  return await input({
    message: "Input the next release version for Github",
  });
}
