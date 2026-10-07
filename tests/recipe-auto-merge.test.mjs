import assert from 'node:assert/strict';
import test from 'node:test';
import autoMergeRecipes from '../.github/scripts/auto-merge-recipes.mjs';

const recipeFiles = [
  { filename: 'recipes/tomato-pasta.md', status: 'added' },
  { filename: 'recipes/images/tomato-pasta.webp', status: 'added' },
];

function createHarness(options = {}) {
  const repository = { owner: 'g-mai', repo: 'my-foodbook' };
  const pullRequest = {
    number: 7,
    state: 'open',
    draft: false,
    user: { login: 'g-mai', type: 'User' },
    base: {
      ref: 'main',
      sha: 'base-commit',
      repo: { full_name: 'g-mai/my-foodbook' },
    },
    head: { sha: 'validated-commit' },
    changed_files: 2,
    ...options.pullRequest,
  };
  const run = {
    event: 'pull_request',
    status: 'completed',
    conclusion: 'success',
    workflow_id: 12,
    head_sha: 'validated-commit',
    ...options.run,
  };
  const mergeRequests = [];
  const logs = [];
  const fileRequests = [];
  const permissionRequests = [];
  let pullRequestReads = 0;
  const github = {
    rest: {
      actions: {
        getWorkflow: async (parameters) => {
          assert.equal(parameters.workflow_id, run.workflow_id);
          return {
            data: {
              path: '.github/workflows/validate.yml',
              ...options.workflow,
            },
          };
        },
      },
      repos: {
        listPullRequestsAssociatedWithCommit: async (parameters) => {
          assert.equal(parameters.commit_sha, run.head_sha);
          return { data: options.candidates ?? [{ number: 7 }] };
        },
        getCollaboratorPermissionLevel: async (parameters) => {
          permissionRequests.push(parameters);
          if (options.permissionError) throw options.permissionError;
          return { data: { permission: options.permission ?? 'write' } };
        },
      },
      pulls: {
        get: async () => {
          pullRequestReads += 1;
          return {
            data: {
              ...pullRequest,
              ...(pullRequestReads > 1 ? options.current : {}),
            },
          };
        },
        listFiles: async (parameters) => {
          fileRequests.push(parameters);
          return { data: options.files ?? recipeFiles };
        },
        merge: async (parameters) => {
          mergeRequests.push(parameters);
          if (options.mergeError) throw options.mergeError;
          return { data: options.result ?? { merged: true } };
        },
      },
    },
    paginate: async (method, parameters) => (await method(parameters)).data,
  };
  return {
    github,
    context: { repo: repository, payload: { workflow_run: run } },
    core: {
      info: (message) => logs.push(message),
      warning: (message) => logs.push(message),
    },
    mergeRequests,
    fileRequests,
    permissionRequests,
    logs,
  };
}

test('owner and current write collaborators can merge only the validated head commit', async () => {
  for (const permission of ['admin', 'maintain', 'write']) {
    const harness = createHarness({ permission });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, [
      {
        owner: 'g-mai',
        repo: 'my-foodbook',
        pull_number: 7,
        sha: 'validated-commit',
        merge_method: 'squash',
      },
    ]);
    assert.equal(harness.permissionRequests[0].username, 'g-mai');
    assert.equal(harness.fileRequests[0].per_page, 100);
  }
});

test('outside contributors, previous contributors, read users, and triage users are not auto-merged', async () => {
  for (const permission of ['none', 'read', 'triage']) {
    const harness = createHarness({
      permission,
      pullRequest: {
        user: { login: 'outside-contributor', type: 'User' },
        author_association: 'CONTRIBUTOR',
      },
    });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
    assert.deepEqual(harness.fileRequests, []);
  }
});

test('unsuccessful, unfinished, non-PR, and wrong-workflow CI runs cannot merge', async () => {
  for (const options of [
    { run: { conclusion: 'failure' } },
    { run: { conclusion: 'cancelled' } },
    { run: { conclusion: 'skipped' } },
    { run: { conclusion: null } },
    { run: { status: 'in_progress' } },
    { run: { event: 'push' } },
    { workflow: { path: '.github/workflows/unrelated.yml' } },
  ]) {
    const harness = createHarness(options);
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
  }
});

test('closed, draft, retargeted, stale, and bot-authored PRs cannot merge', async () => {
  for (const pullRequest of [
    { state: 'closed' },
    { draft: true },
    { base: { ref: 'other', repo: { full_name: 'g-mai/my-foodbook' } } },
    { base: { ref: 'main', repo: { full_name: 'someone/another-repo' } } },
    { head: { sha: 'new-unvalidated-commit' } },
    { user: { login: 'recipe-bot', type: 'Bot' } },
  ]) {
    const harness = createHarness({ pullRequest });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
  }
});

test('code, configuration, executable images, nested recipes, deletions, and renames require manual review', async () => {
  for (const file of [
    { filename: 'src/pages/index.astro', status: 'modified' },
    { filename: '.github/workflows/validate.yml', status: 'modified' },
    { filename: 'package.json', status: 'modified' },
    { filename: 'recipes/images/script.svg', status: 'added' },
    { filename: 'recipes/images/script.js', status: 'added' },
    { filename: 'recipes/nested/pasta.md', status: 'added' },
    { filename: 'recipes/Pasta.md', status: 'added' },
    { filename: 'recipes/tomato-pasta.md', status: 'removed' },
    {
      filename: 'recipes/tomato-pasta.md',
      previous_filename: 'src/code.mjs',
      status: 'renamed',
    },
  ]) {
    const harness = createHarness({ files: [recipeFiles[0], file] });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
  }
});

test('empty, image-only, and incomplete file lists are not eligible', async () => {
  for (const files of [[], [recipeFiles[1]], [recipeFiles[0]]]) {
    const harness = createHarness({ files });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
  }
});

test('the complete paginated diff is checked, including later non-recipe files', async () => {
  const files = Array.from({ length: 100 }, () => recipeFiles[0]);
  files.push({ filename: 'AGENTS.md', status: 'modified' });
  const harness = createHarness({
    files,
    pullRequest: { changed_files: files.length },
  });
  await autoMergeRecipes(harness);
  assert.deepEqual(harness.mergeRequests, []);
});

test('recipe updates and supported raster photos are eligible', async () => {
  for (const extension of ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif']) {
    const harness = createHarness({
      files: [
        { filename: 'recipes/tomato-pasta.md', status: 'modified' },
        {
          filename: `recipes/images/tomato-pasta.${extension}`,
          status: 'modified',
        },
      ],
    });
    await autoMergeRecipes(harness);
    assert.equal(harness.mergeRequests.length, 1);
  }
});

test('head, base, readiness, and state changes during inspection stop the merge', async () => {
  for (const current of [
    { head: { sha: 'unvalidated-commit' } },
    { base: { ref: 'main', sha: 'new-base' } },
    { base: { ref: 'another-branch', sha: 'base-commit' } },
    { draft: true },
    { state: 'closed' },
  ]) {
    const harness = createHarness({ current });
    await autoMergeRecipes(harness);
    assert.deepEqual(harness.mergeRequests, []);
  }
});

test('permission lookup errors fail closed rather than guessing who is trusted', async () => {
  const harness = createHarness({
    permissionError: new Error('API unavailable'),
  });
  await assert.rejects(autoMergeRecipes(harness), /API unavailable/);
  assert.deepEqual(harness.mergeRequests, []);
});

test('GitHub branch protection and last-moment SHA conflicts are never bypassed or retried', async () => {
  for (const status of [403, 405, 409]) {
    const harness = createHarness({
      mergeError: Object.assign(new Error('Merge refused'), { status }),
    });
    await autoMergeRecipes(harness);
    assert.equal(harness.mergeRequests.length, 1);
    assert.equal(harness.mergeRequests[0].sha, 'validated-commit');
    assert.ok(harness.logs.some((message) => message.includes('remains open')));
    assert.ok(
      !harness.logs.some((message) => message.startsWith('Merged recipe')),
    );
  }
});

test('a refused merge response is not reported as a successful publication', async () => {
  const harness = createHarness({
    result: { merged: false, message: 'Blocked' },
  });
  await autoMergeRecipes(harness);
  assert.ok(harness.logs.some((message) => message.includes('not merged')));
  assert.ok(
    !harness.logs.some((message) => message.startsWith('Merged recipe')),
  );
});
