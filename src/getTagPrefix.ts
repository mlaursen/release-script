import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function getPkgName(): Promise<string> {
  const pkgJson = await readFile(
    resolve(process.cwd(), "package.json"),
    "utf8"
  );

  return JSON.parse(pkgJson).name || "";
}

export async function getTagPrefix(mainPackage?: string): Promise<string> {
  let pkg = "";
  try {
    pkg = mainPackage ?? (await getPkgName());
  } catch {
    console.error("Unable to get package name from package.json");
  }

  while (
    !pkg ||
    !(await confirm({ message: `Use ${pkg} as the next tag name?` }))
  ) {
    pkg = await input({
      message: "Enter the next tag name prefix",
    });
  }

  return pkg;
}
