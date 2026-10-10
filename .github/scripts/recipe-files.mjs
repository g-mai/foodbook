const recipePath = /^recipes\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const photoPath =
  /^recipes\/images\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:avif|gif|jpe?g|png|webp)$/;

/** Require a complete diff of recipe/photo additions or updates. */
export function isRecipeOnlyChange(files, expectedCount) {
  return (
    files.length === expectedCount &&
    files.some(({ filename }) => recipePath.test(filename)) &&
    files.every(
      ({ filename, status }) =>
        ['added', 'modified'].includes(status) &&
        (recipePath.test(filename) || photoPath.test(filename)),
    )
  );
}
