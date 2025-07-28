import confirm from "@inquirer/confirm";
import rawlist from "@inquirer/rawlist";
import { execSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function getCurrentChangeset(): Promise<string> {
  let changesetName = execSync(
    "git diff --name-only @{upstream} .changeset/*.md"
  )
    .toString()
    .trim();

  if (
    !changesetName ||
    !(await confirm({
      message: `Is "${changesetName}" the correct changeset path?`,
    }))
  ) {
    const changesetNames = await readdir(".changeset");
    changesetName = await rawlist({
      message: "Select the changeset path",
      choices: changesetNames
        .filter((changeset) => changeset.endsWith(".md"))
        .map((changeset) => ({
          value: changeset,
        })),
    });
    changesetName = join(".changeset", changesetName);
  }

  return await readFile(changesetName, "utf8");
}
