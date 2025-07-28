import confirm from "@inquirer/confirm";
import { Octokit } from "@octokit/core";
import dotenv from "dotenv";

export interface ConfigurableCreateReleaseOptions {
  repo: string;

  /**
   * @defaultValue `"mlaursen"`
   */
  owner?: string;

  /**
   * The `.env` file to load to get the `GITHUB_TOKEN` environment variable.
   *
   * @defaultValue `".env.local"`
   */
  envPath?: string;
}

export interface CreateReleaseOptions extends ConfigurableCreateReleaseOptions {
  body: string;
  version: string;
  override?: boolean;
  tagPrefix: string;
  prerelease: boolean;
}

export async function createRelease(
  options: CreateReleaseOptions
): Promise<void> {
  const {
    version,
    body,
    tagPrefix,
    override,
    owner = "mlaursen",
    repo,
    prerelease,
    envPath = ".env.local",
  } = options;

  dotenv.config({ path: envPath, override, quiet: true });
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  try {
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/releases",
      {
        owner,
        repo,
        tag_name: `${tagPrefix}@${version}`,
        body,
        prerelease,
      }
    );

    console.log(`Created release: ${response.data.html_url}`);
  } catch (e) {
    console.error(e);

    console.log();
    console.log(
      "The npm token is most likely expired or never created. Update the `.env.local` to include the latest GITHUB_TOKEN"
    );
    console.log(
      "Regenerate the token: https://github.com/settings/personal-access-tokens"
    );
    if (
      !(await confirm({ message: "Try creating the Github release again?" }))
    ) {
      process.exit(1);
    }

    return createRelease({ ...options, override: true });
  }
}
