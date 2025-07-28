import { execSync } from "node:child_process";

export function getLatestTag(): string {
  return execSync("git tag --sort=-creatordate | head -1").toString().trim();
}
