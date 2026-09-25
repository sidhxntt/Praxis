# Template Catalog Grouping Design

## Goal

Reorganize `cli/templates/` into domain-based root folders without changing any public configuration value, resolver module ID, generated-project output, or template selection behavior. Update every internal path consumer, package rule, test, and documentation-context reference so the reorganized catalog can be released in the npm CLI package.

## Non-goals

- Change the `PraxisConfig` schema or any user-facing selection.
- Rename resolver module IDs such as `frontend.next` or `pro.capability.redis-cache`.
- Change manifest semantics, selector behavior, output scopes, generated files, or composition order.
- Alter the published UI-style names or their catalog data.
- Publish npm before the repository PR is merged and all required checks pass.

## Target catalog layout

```text
cli/templates/
  standard/
    base/workspace/
    frontend/{angular,astro,next,vite,vue}/
    backend/express/
    database/{mongo,postgres}/
    auth/{clerk,self-hosted,supabase}/
    cache/{memcached,redis}/
    deployment/{docker,railway,render,vercel}/
    styling/tailwind-shadcn/
  pro/
    core/
    runtime/{django,gin}/
    capabilities/<capability>/
    infrastructure/
      compose/
      kubernetes/
      terraform/{shared,aws,azure,gcp}/
  ui/
    catalog/
    shared/
    styles/<style>/
    designs/
```

Every leaf that is currently a composable module retains its `manifest.json` and every file below it. `ui/catalog`, `ui/shared`, and `ui/designs` remain supporting catalog assets rather than resolver-selected modules.

## Stable module IDs and path registry

The module ID remains the compatibility contract. For example, existing configs and the resolver continue to emit:

```text
base.workspace
frontend.next
backend.express
database.postgres
auth.self-hosted
cache.redis
deployment.docker
styling.tailwind-shadcn
ui.apple
pro.core
pro.django
pro.gin
pro.capability.redis-cache
pro.compose
pro.kubernetes
pro.terraform.aws
```

The composer must stop deriving a module directory by joining `templatesRoot` with the module ID. It will use a single module-location function that maps every supported ID family to its grouped relative directory. The function will be used for both manifest loading and overlay roots. Unknown IDs must continue to fail before a filesystem path is read.

The mapping rules are:

| Module ID family | Grouped directory |
| --- | --- |
| `base.workspace` | `standard/base/workspace` |
| `frontend.<name>` | `standard/frontend/<name>` |
| `backend.express` | `standard/backend/express` |
| `database.<name>` | `standard/database/<name>` |
| `auth.<name>` | `standard/auth/<name>` |
| `cache.<name>` | `standard/cache/<name>` |
| `deployment.<name>` | `standard/deployment/<name>` |
| `styling.tailwind-shadcn` | `standard/styling/tailwind-shadcn` |
| `ui.<name>` | `ui/styles/<name>` |
| `pro.core` | `pro/core` |
| `pro.django`, `pro.gin` | `pro/runtime/<django-or-gin>` |
| `pro.capability.<name>` | `pro/capabilities/<name>` |
| `pro.compose`, `pro.kubernetes` | `pro/infrastructure/<compose-or-kubernetes>` |
| `pro.terraform.<name>` | `pro/infrastructure/terraform/<name>` |

## File and consumer migration

1. Move each existing template directory to its target path with no content edits.
2. Add the module-location function to composer code and update the compose flow to retain the resolved module root alongside each loaded manifest.
3. Update UI tooling to use `ui/catalog`, `ui/shared`, `ui/styles`, and `ui/designs` rather than `ui.catalog`, `ui.shared`, `ui.<style>`, and `designs`.
4. Update the template-context library so its returned authoritative-source paths use the new grouped locations. The resolver still returns existing module IDs.
5. Update direct-path tests, package tests, and UI tests to point at the grouped paths. Add coverage that verifies representative standard, Pro, and UI module IDs resolve to their new locations while an unknown ID is rejected.
6. Update `cli/package.json` file include/exclude patterns. The npm tarball must include runtime templates, UI styles, the catalog, the gallery, and required generated `DESIGN.md` files; it must continue to exclude source-only UI design specifications and development-only assets.
7. Update documentation that names the old paths, especially architecture context source lists and package-layout documentation.

## Safety and compatibility constraints

- Preserve atomic composition: all files are still composed under a staging directory and published only after success.
- Preserve generated-project independence: no generated project may require Praxis at runtime.
- Preserve current resolver order and manifest selector behavior.
- Keep all filesystem lookups confined below `templatesRoot`.
- Do not leave compatibility copies of every old root directory in the npm tarball. The registry is the compatibility layer; duplicate catalogs would obscure the source of truth and inflate the package.

## Verification

The implementation must pass the context and generated-project contract checks returned by the template context resolver:

```bash
npm run docs:context:check
npm --workspace cli test -- tests/generator/lifecycle.test.ts
npm --workspace cli test -- tests/generator/proRuntime.test.ts
npm --workspace cli test -- tests/generator/proCapabilities.test.ts
npm --workspace cli test -- tests/generator/proMatrix.test.ts
```

It must additionally pass the catalog-specific checks:

```bash
npm --workspace cli test -- tests/composer/compose.test.ts tests/generator/matrix.test.ts tests/package.test.ts
npm --workspace cli test -- tests/ui
npm --workspace cli pack --dry-run
```

The npm package inspection must confirm that grouped runtime template paths are included and source-only `ui/designs` paths are excluded.

## Release sequence

1. Commit the migration on `refactor/template-catalog-groups`.
2. Push the branch and open a PR into `main`.
3. Wait for all required GitHub checks to pass, address any verified failure, and merge the PR.
4. Switch the local primary checkout to `main` and fast-forward it from `origin/main`.
5. Bump the CLI patch version, pack and inspect the artifact, publish to npm, then verify the published version and its package contents.

Publishing occurs only from the merged `main` commit so GitHub and npm refer to the same catalog structure.
