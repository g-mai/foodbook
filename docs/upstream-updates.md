# Personal repositories and upstream updates

Foodbook is a complete application you can customize, with an optional update path through shared Git history. Each cookbook has its own repository, deployment settings, and content. No package registry or separate content checkout is needed.

## Create a personal cookbook

Use a normal clone with its history intact, rather than GitHub's **Use this template**, a ZIP download, or a new `git init`. Template-generated repositories start with independent history, making ordinary upstream merges harder. A GitHub fork of a public repository must also be public; an independent repository can be private.

The following are user-operated setup instructions. Agents in this project must keep changes local under the current remote-service restrictions.

1. Create an **empty** repository in your GitHub account, such as `my-foodbook`. Choose private if you do not want to share the source. Do not initialize it with a README, license, or `.gitignore`.
2. Clone Foodbook into a new directory:

   ```sh
   git clone https://github.com/g-mai/foodbook.git my-foodbook
   cd my-foodbook
   git remote rename origin upstream
   git remote add origin https://github.com/YOUR-USERNAME/my-foodbook.git
   git remote -v
   ```

   Replace `YOUR-USERNAME` and the personal repository name. Verify that `origin` points to your repository and `upstream` points to the public Foodbook project. Keep the `.git` directory.

3. Publish the preserved history to your empty repository:

   ```sh
   git push -u origin main
   ```

4. Install dependencies with `pnpm install --frozen-lockfile`. Personalize `foodbook.config.ts`, optionally add `src/styles/custom.css` overrides, and set your own Cloudflare Worker name in `wrangler.jsonc`.
5. Configure your personal repository's GitHub Actions deployment when that workflow is available. Git remotes, repository secrets, GitHub settings, and Cloudflare resources are not copied by cloning. A private repository still produces a public website unless access control is separately configured.

After this setup, regular publishing targets `origin`. `upstream` is the source of shared updates, not a destination for your cookbook content. Your agent should work in the personal checkout when importing recipes or making personal customizations.

## Prepare an upstream update

Start with committed personal work and a clean working tree (`git status`). In your personal checkout:

```sh
git switch main
git pull --ff-only origin main
git fetch upstream
git switch -c update/foodbook
git merge --no-ff upstream/main
```

Use a fresh update branch name if `update/foodbook` already exists. If the fast-forward pull fails, reconcile your local and personal remote history before proceeding rather than resetting away local commits.

This currently targets the upstream development branch. Once versioned releases are published, prefer a selected release and read its upgrade notes: fetch that upstream tag explicitly and merge the tag instead of `upstream/main`. Do not assume the version in `package.json` corresponds to an existing release tag.

### Resolve and verify

- Git normally retains recipes and other files added only in your personal repository.
- Changes to the same components, configuration, or skills may conflict. Reconcile both sets of changes instead of accepting all of one side.
- Schema or behavior changes can require migration even when Git reports no conflicts. Review upgrade notes and preview your custom features.
- If a dependency update conflicts, resolve `package.json` intentionally and use pnpm to reconcile/regenerate `pnpm-lock.yaml`; do not hand-edit the lockfile.
- After resolving merge conflicts, stage the resolved files and finish the merge with `git merge --continue`. To abandon an in-progress merge, use `git merge --abort`.

Run the project checks on the combined result:

```sh
pnpm install --frozen-lockfile
pnpm format
pnpm validate
pnpm deploy:dry-run
```

Inspect and commit any intentional formatting or follow-up fixes. Preview important pages and personal styling before publishing. The dry run validates deployment packaging without publishing anything.

### Publish the update

Under the current agent restrictions, the agent leaves the result local and reports the remaining publishing steps. The user can push the update branch to `origin` and open a pull request against their personal `main` branch.

**Use a merge commit, not squash or rebase merging, for upstream update pull requests.** Alternatively, fast-forward your personal `main` to the tested update branch. Preserving the upstream ancestry lets Git recognize already-integrated changes on the next update.

When the deployment workflow is implemented, merging into personal `main` triggers its GitHub Actions build and Cloudflare deployment. Fetching upstream changes alone does not update the live website.

## Developing Foodbook and using your own cookbook

Maintain separate checkouts for public Foodbook development and your personal cookbook:

- Develop shared features, defaults, skills, and examples in the public project.
- Import personal recipes and customize your website in the personal project.
- Merge public improvements into the personal project using the update process above.
- Contribute reusable changes back as focused code-only patches or commits; do not merge the entire personal branch, which includes your recipes and configuration, into the public project.

Future releases should include upgrade notes for schema changes and migrations. Dedicated personal directories reduce conflicts, but users remain free to change every part of the application.
