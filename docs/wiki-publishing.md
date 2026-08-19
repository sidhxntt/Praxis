# Publishing the Praxis documentation to GitHub Wiki

Markdown under `docs/` is the source of truth. GitHub Wiki is a generated read surface, not a second authoring location.

## Automatic publication

On a successful push to `main` that changes managed documentation or Wiki tooling, `.github/workflows/wiki.yml`:

1. checks out the repository;
2. runs `npm run docs:check`;
3. clones `https://github.com/sidhxntt/Praxis.wiki.git`;
4. renders managed pages into the Wiki checkout;
5. commits and pushes only when content changed.

The repository Wiki must be enabled and initialized with one page before its Git repository exists. The workflow uses the repository-scoped `GITHUB_TOKEN`; repository settings must allow Actions write access.

## Local validation

```bash
npm run docs:check

wiki_dir="$(mktemp -d)"
npm run docs:wiki -- "$wiki_dir"
find "$wiki_dir" -maxdepth 1 -type f -print | sort
```

Inspect at least `Home.md`, `_Sidebar.md`, `Code-Architecture.md`, and `Generated-Backends.md` before publishing a structural change.

## Managed page map

| Source | Wiki page |
| --- | --- |
| `docs/index.md` | `Home` |
| `docs/overview.md` | `Overview` |
| `docs/architecture.md` | `Architecture` |
| `docs/terminology.md` | `Terminology` |
| `docs/repository-map.md` | `Repository-Map` |
| `docs/code-architecture.md` | `Code-Architecture` |
| `docs/generation-pipeline.md` | `Generation-Pipeline` |
| `docs/manifest-system.md` | `Manifest-System` |
| `docs/standard-projects.md` | `Standard-Projects` |
| `docs/praxis-pro.md` | `Praxis-Pro` |
| `docs/generated-backends.md` | `Generated-Backends` |
| `docs/ui-templates.md` | `UI-Templates` |
| `docs/testing.md` | `Testing` |
| `docs/agent-guide.md` | `Agent-Guide` |
| `docs/wiki-publishing.md` | `Wiki-Publishing` |

The renderer also manages `_Sidebar.md` and `_Footer.md`. It does not delete other Wiki files; obsolete unmanaged pages must be reviewed and removed deliberately.

## Maintenance rules

- Change source Markdown, never only the Wiki copy.
- Keep source links repository-relative so they work on GitHub and can be validated locally.
- Mark future direction explicitly and never mix it into current architecture diagrams.
- Do not include credentials, private deployment data, or raw incident logs.
- Update the page map, sidebar, renderer, and link tests together when adding a page.

