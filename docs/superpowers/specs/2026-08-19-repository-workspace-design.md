# Praxis Repository Workspace Design

## Goal

Organize the Praxis repository as a two-product npm workspace. The public website lives entirely in `web/`; Praxis Flow and Praxis Pro live entirely in `cli/`. The repository root provides shared documentation and stable orchestration commands.

## Target layout

```text
Praxis/
├── .github/
├── cli/
│   ├── docs/
│   ├── scripts/
│   ├── src/
│   ├── templates/
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── web/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
├── LICENSE.txt
├── README.md
├── package.json
└── package-lock.json
```

Generated output and installed dependencies remain ignored and are not repository structure.

## Package ownership

The root package is private and declares `cli` and `web` as npm workspaces. It owns repository-wide convenience scripts only. The CLI package retains its publishable package name, executable mapping, version, runtime dependencies, build, test, and prepublish behavior. The web package retains its Next.js application dependencies and scripts.

Root scripts provide explicit entry points for both products, including CLI test/build/check commands and web development/build commands. Commands use npm workspace targeting so contributors can install once at the root.

## Migration behavior

The existing `wrapper/` directory becomes `web/`. Existing CLI-owned root directories and files move under `cli/`, including source, templates, tests, scripts, CLI documentation, TypeScript configuration, and package metadata. Shared repository documentation and licensing stay at the root.

The move must not change CLI behavior, generated project output, template composition, npm binary behavior, or website behavior. Package-relative paths are updated where needed.

## Integrations

GitHub Actions install dependencies from the workspace root and run the relevant workspace scripts. CLI publishing operates from `cli/`. Vercel uses `web/` as its project root or equivalent build configuration. Documentation references commands and paths from the new repository root.

## Verification

Completion requires all of the following:

1. A clean worktree with no former `wrapper/` directory and no CLI implementation left at the repository root.
2. A successful root workspace install.
3. The complete CLI test suite and TypeScript build passing through root workspace scripts.
4. A successful production build of the web workspace.
5. CI and Vercel checks passing on the pull request.
6. The pull request merged into `main`, with the resulting merge commit verified on `origin/main`.

## Failure handling

If workspace migration exposes package-relative assumptions, fix those assumptions within the owning package rather than adding root-level compatibility copies. CI and deployment configuration must fail clearly when either workspace is broken.
