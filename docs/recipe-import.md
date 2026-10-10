# Recipe imports from your phone

The [recipe-import skill](../.agents/skills/recipe-import/SKILL.md) reads a URL, supplied text, or magazine/book photograph, prepares Foodbook Markdown and a local photo, asks for confirmation, and opens a pull request in `g-mai/my-foodbook`. It does not change application code, push to `main`, or merge the PR itself.

The `Validate` workflow runs `pnpm validate:recipes` for PRs containing only allowed recipe/photo additions and updates: recipe Markdown formatting plus the Astro build, which validates metadata and referenced images. Other PRs and pushes to `main` run full formatting, lint, tests, types, and build checks. Dependency caching is enabled. The workflow always reports the same required `Validate` check; no branch-rule changes are needed. After successful PR validation, `Auto-merge recipes` attempts a squash merge only when:

- The PR is open, is not a draft, and targets this repository's `main` branch.
- Its author is a human GitHub user with current `write`, `maintain`, or `admin` repository permission. Having contributed before, being listed as `CONTRIBUTOR`, or being able to open a public PR does not qualify.
- The PR head is still the exact commit validated by CI.
- The complete diff contains at least one recipe Markdown file and only additions or modifications of root `recipes/*.md` files and supported raster photos directly in `recipes/images/`. Filenames must be lowercase and hyphenated. Code/configuration changes, renames, deletions, and image-only PRs are never automatically merged.
- GitHub's required checks and branch rules permit the merge. No bypass is attempted.

These checks are enforced by the trusted default-branch workflow, not by skill instructions, labels, PR text, branch names, or the account rerunning CI. Validation runs with read-only repository access; the merge job never checks out PR code, installs PR dependencies, reads CI artifacts, or restores a PR cache.

After a successful merge, the workflow deletes the PR's source branch when it belongs to this repository, is neither the base nor default branch, has no other open PR, and still points to the validated head when checked. Fork branches and branches with newer commits are retained. Cleanup is best effort: already-deleted branches are harmless, and deletion failures are logged without reporting the successful merge as a failure. The GitHub ref deletion API does not accept an expected SHA, so the last head check and deletion are separate requests.

## One-time GitHub setup

Publish the workflow, script, skill, tests, and documentation together in a manually reviewed PR. Automatic recipe merging becomes active once the workflows are on the default branch; no repository variable or extra secret is needed. Complete the branch protection and collaborator setup before opening recipe import PRs.

1. **Allow squash merging.** Open the repository's **Settings → General → Pull Requests** and enable **Allow squash merging**. Leave the separate **Allow auto-merge** option disabled unless you need it for another workflow: this recipe workflow uses a SHA-checked merge API call after CI succeeds, not GitHub's native queued auto-merge. No personal access token or additional GitHub App is required.
2. **Run CI once.** Open a PR targeting `main` and let the **Validate** check complete successfully. The check must have run before it can be selected as a required status check. If the initial setup PR already ran it, that is sufficient.
3. **Protect `main`.** Under **Settings → Rules → Rulesets**, create a new **branch ruleset** named `Protect main`, set enforcement to **Active**, and target `main` (or the default branch). Leave the bypass list empty. Enable **Require a pull request before merging**, **Require status checks to pass**, **Require branches to be up to date before merging**, **Block force pushes**, and **Restrict deletions**. Add the **Validate** status check and select **GitHub Actions** as its expected source. Do not require approving reviews if you want unattended recipe imports; required reviews would also apply to these PRs. Save the ruleset. Do not require the **Auto-merge recipes** workflow itself: it runs after validation and is not a PR validation check.
4. **Review collaborators and Actions settings.** In **Settings → Collaborators**, grant repository write access only to people whose recipe imports you trust. In **Settings → Actions → General**, allow the pinned actions used by these workflows (`actions/checkout`, `actions/github-script`, and `pnpm/setup`). Keep default workflow permissions read-only; the merge job requests its own minimal write permissions. Do not enable write tokens or secrets for fork PR validation. For public forks, require workflow approval for external contributors as an additional compute-safety measure; approving their CI run does not grant permission to auto-merge their PR.

To pause automatic recipe merging, disable **Auto-merge recipes** under the repository's **Actions** tab.

Cloudflare's existing Git connection remains responsible for production deployment after the merge to `main`. Do not add a second deployment workflow or put Cloudflare credentials in GitHub Actions.

## Install and use the skill

Use `.agents/skills/recipe-import/` as the canonical skill source. Codex discovers it there, and `.claude/skills` is a symlink to the same skills directory for Claude Code. The folder contains the entrypoint and Codex UI metadata. Install it in a client that supports local skills, or package it for a client accepting ZIP skill uploads:

```sh
mkdir -p dist
(cd .agents/skills && python3 -m zipfile -c ../../dist/recipe-import.zip recipe-import)
```

The archive has one top-level `recipe-import/` folder. It is a local export, not a tracked repository file; a later static build may remove it. A client without a local runtime can follow the documented recipe format and write through its GitHub connector; it must report that local checks were not run and let CI validate the PR. Installing a skill does not grant connector access or permission to write to GitHub.

Example request:

> Import this recipe into my Foodbook: [source URL]. Use this photo and show me the recipe before publishing.

The agent translates the supplied recipe into English, converts measurements to metric, prepares the local photo, and asks for confirmation. Translation and conversion are always part of imports, including updates; uncertain conversions must be resolved before publication. It does not scan saved recipes or open PRs for duplicates; it checks only proposed file paths to avoid overwriting existing content. Once you confirm, it opens a non-draft recipe-only PR. Successful CI triggers the trusted merge workflow; Cloudflare then builds and deploys the merged change. The agent should return the PR link and distinguish CI, merge, and deployment status.

Source attribution is optional and uses one `source` field: a recipe URL or text such as `Delicious magazine, October 2026, page 42`. Omit it when unknown. Valid HTTP(S) URLs display as links; text references display without a link. Existing recipes retain their original filename, source attribution, addition date, and personal notes on updates.

For a magazine import, attach a readable recipe photograph and identify the dish photo you want saved. The recipe page photograph may be used as the local image if that is your choice. The agent asks about unclear or cropped content instead of guessing; a source URL is never required.

## Verify the first import

Use one real recipe that is not already saved, publish its recipe and photo in a PR from your connected account, and check:

1. **Validate** succeeds.
2. **Auto-merge recipes** records the author's permission and recipe-only eligibility decision and merges the tested SHA. If your connector authors PRs as a bot instead of your human account, they remain manual-review PRs; do not broaden the policy to all bots.
3. The PR is squash-merged into `main` without a manual merge action.
   Its source branch is deleted if eligible for cleanup; check the workflow log if it remains.
4. Cloudflare reports a successful production deployment, and the new recipe page and photo load correctly.

To verify exclusions without deliberately merging anything, use draft test PRs or inspect the automated regression tests: outside/read-only authors, unvalidated heads, code changes, and deletions must not reach the merge API. A live outside-author check needs an account without repository write permission; the local test suite simulates it without granting access or publishing a PR.

## When a PR stays open

- Failed CI: fix the recipe or unrelated application problem as appropriate, then rerun validation. The importer must not silently edit application code to fix an import.
- Passing CI but no merge job: check that the workflows are on the default branch, **Auto-merge recipes** is not disabled in Actions, and validation was a PR run rather than a push run.
- Successful CI rerun by the owner on an outside contributor's PR: still ineligible; trust is checked against the PR author, not the rerun actor.
- Permission lookup errors, incomplete file lists, bot authors, or non-recipe files: fail closed and leave the PR for manual review. Labels cannot override this decision.
- Draft marked ready: validation runs again on `ready_for_review`. Opening a draft alone never publishes it.
- Branch protection, conflicts, pending additional required checks, or a newer base/head: leave the PR open, update its branch if needed, then rerun **Validate**. This workflow does not enqueue native auto-merge or keep retrying until other gates pass.
- Merged but not live: inspect Cloudflare build/deployment logs. A merge or green GitHub CI check is not proof of a successful production deployment.

Only use automatic merging when you trust the write collaborators and the required checks. CI validates recipe structure and builds, not taste, conversion accuracy, licensing, or the quality of personal notes.

## References

- [GitHub workflow-run triggers and security boundaries](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run)
- [GitHub merge API and expected head SHA](https://docs.github.com/en/rest/pulls/pulls#merge-a-pull-request)
- [Creating repository rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Approving workflow runs from public forks](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks)
