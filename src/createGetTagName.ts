import confirm from "@inquirer/confirm";
import input from "@inquirer/input";
import { getLatestTag } from "./getLatestTag.js";

export function createGetTagName(mainPackage: string | undefined) {
  return async function getTagName(): Promise<string> {
    const latestTag = getLatestTag();
    let tagName =
      mainPackage && /@\d/.test(latestTag)
        ? // most likely a monorepo
          latestTag.replace(/.+(@\d)/, `${mainPackage}$1`)
        : latestTag;

    while (
      !tagName ||
      !(await confirm({ message: `Use "${tagName}" for the next tag name?` }))
    ) {
      tagName = await input({
        message: "Enter the tag name",
      });
    }

    return tagName;
  };
}
