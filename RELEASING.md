# Releasing Praxis

Praxis uses two tag namespaces, mirroring the repository and CLI release split used by Rudder.

| Tag | Result |
| --- | --- |
| `vX.Y.Z` | Creates a repository-wide GitHub Release named `Praxis vX.Y.Z`. |
| `cli-vX.Y.Z` | Tests and publishes `@sidhxntt/praxiflow` to GitHub Packages, then creates a CLI GitHub Release. |

## Release checklist

1. Merge the release changes into `main` and wait for every required check to pass.
2. Confirm `package.json` and `cli/package.json` contain the intended version.
3. Confirm the CLI package can be built and packed:

   ```sh
   npm ci
   npm run check:cli
   npm pack --dry-run --workspace cli
   ```

4. Create annotated tags from the verified `main` commit:

   ```sh
   git switch main
   git pull --ff-only
   git tag -a vX.Y.Z -m "Praxis vX.Y.Z"
   git tag -a cli-vX.Y.Z -m "Praxis Flow CLI vX.Y.Z"
   git push origin vX.Y.Z cli-vX.Y.Z
   ```

5. Verify both workflows and releases:

   ```sh
   gh run list --workflow release.yml
   gh run list --workflow publish-cli.yml
   gh release view vX.Y.Z
   gh release view cli-vX.Y.Z
   ```

The CLI publisher authenticates to GitHub Packages with the workflow `GITHUB_TOKEN`; no maintainer npm token is required. A tag whose version does not match the relevant package version fails before publishing.

## Failed releases

Do not move or reuse a published tag. Fix the problem, increment the patch version, merge the correction, and create new repository and CLI tags. GitHub generated release notes are categorized by `.github/release.yml`.
