import confirm from "@inquirer/confirm";

export async function continueRelease(): Promise<void> {
  const confirmed = await confirm({ message: "Continue the release?" });
  if (!confirmed) {
    process.exit(1);
  }
}
