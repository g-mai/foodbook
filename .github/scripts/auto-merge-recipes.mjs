import { isRecipeOnlyChange } from './recipe-files.mjs';

export default async function autoMergeRecipes({ github, context, core }) {
  const run = context.payload.workflow_run;
  const repository = context.repo;

  if (
    run.event !== 'pull_request' ||
    run.status !== 'completed' ||
    run.conclusion !== 'success'
  ) {
    return;
  }

  const { data: workflow } = await github.rest.actions.getWorkflow({
    ...repository,
    workflow_id: run.workflow_id,
  });
  if (workflow.path !== '.github/workflows/validate.yml') {
    core.info('Ignoring a run from a different validation workflow.');
    return;
  }

  const candidates = await github.paginate(
    github.rest.repos.listPullRequestsAssociatedWithCommit,
    { ...repository, commit_sha: run.head_sha, per_page: 100 },
  );

  for (const candidate of candidates) {
    const pullRequestParameters = {
      ...repository,
      pull_number: candidate.number,
    };
    const { data: pullRequest } = await github.rest.pulls.get(
      pullRequestParameters,
    );
    if (
      pullRequest.state !== 'open' ||
      pullRequest.draft ||
      pullRequest.base.ref !== 'main' ||
      pullRequest.base.repo.full_name !==
        `${repository.owner}/${repository.repo}` ||
      pullRequest.head.sha !== run.head_sha ||
      pullRequest.user.type !== 'User'
    ) {
      core.info(`PR #${candidate.number} is not eligible for this CI run.`);
      continue;
    }

    const { data: collaborator } =
      await github.rest.repos.getCollaboratorPermissionLevel({
        ...repository,
        username: pullRequest.user.login,
      });
    if (!['admin', 'maintain', 'write'].includes(collaborator.permission)) {
      core.info(
        `PR #${candidate.number} was not opened by a write collaborator.`,
      );
      continue;
    }
    core.info(
      `PR #${candidate.number} author ${pullRequest.user.login} has ${collaborator.permission} access.`,
    );

    const files = await github.paginate(github.rest.pulls.listFiles, {
      ...pullRequestParameters,
      per_page: 100,
    });
    if (!isRecipeOnlyChange(files, pullRequest.changed_files)) {
      core.info(
        `PR #${candidate.number} is not limited to recipe/photo updates.`,
      );
      continue;
    }
    core.info(`PR #${candidate.number} contains only recipe/photo updates.`);

    const { data: current } = await github.rest.pulls.get(
      pullRequestParameters,
    );
    if (
      current.state !== 'open' ||
      current.draft ||
      current.base.ref !== 'main' ||
      current.head.sha !== run.head_sha ||
      current.base.sha !== pullRequest.base.sha
    ) {
      core.info(
        `PR #${candidate.number} changed during the eligibility check.`,
      );
      continue;
    }

    try {
      const { data: result } = await github.rest.pulls.merge({
        ...pullRequestParameters,
        sha: run.head_sha,
        merge_method: 'squash',
      });
      if (!result.merged) {
        core.warning(
          `PR #${candidate.number} was not merged: ${result.message}`,
        );
        continue;
      }
      core.info(`Merged recipe PR #${candidate.number} at ${run.head_sha}.`);
      await deleteMergedBranch(
        { github, repository, core },
        current,
        run.head_sha,
      );
    } catch (error) {
      if (![403, 405, 409].includes(error.status)) throw error;
      core.warning(
        `PR #${candidate.number} remains open: GitHub refused the merge (${error.status}). Review its checks and branch rules, then rerun validation.`,
      );
    }
  }
}

async function deleteMergedBranch(
  { github, repository, core },
  pullRequest,
  sha,
) {
  const { head, base, number } = pullRequest;
  if (
    head.repo?.full_name !== `${repository.owner}/${repository.repo}` ||
    !head.ref ||
    head.ref === base.ref ||
    head.ref === head.repo.default_branch
  ) {
    core.info(
      `PR #${number}: branch cleanup skipped for an external or base/default branch.`,
    );
    return;
  }

  const parameters = { ...repository, ref: `heads/${head.ref}` };
  let checkingReference = false;
  try {
    const { data: openPullRequests } = await github.rest.pulls.list({
      ...repository,
      state: 'open',
      head: `${repository.owner}:${head.ref}`,
      per_page: 1,
    });
    if (openPullRequests.length > 0) {
      core.info(`Keeping branch ${head.ref}: another open PR uses it.`);
      return;
    }

    checkingReference = true;
    const { data: reference } = await github.rest.git.getRef(parameters);
    if (
      reference.ref !== `refs/heads/${head.ref}` ||
      reference.object.sha !== sha
    ) {
      core.info(
        `Keeping branch ${head.ref}: it no longer points to the merged PR head.`,
      );
      return;
    }

    await github.rest.git.deleteRef(parameters);
    core.info(`Deleted merged recipe branch ${head.ref}.`);
  } catch (error) {
    if (checkingReference && error.status === 404) {
      core.info(`Merged recipe branch ${head.ref} is already absent.`);
      return;
    }
    core.warning(
      `PR #${number} was merged, but branch ${head.ref} could not be deleted (${error.status ?? 'API error'}).`,
    );
  }
}
