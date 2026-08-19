# Praxis terminology

| Term | Precise meaning |
| --- | --- |
| **Workspace** | One package in the repository: `cli/` or `web/`. |
| **Project** | The output repository requested by a user. |
| **Project type** | `frontend`, `backend`, `fullstack`, or `pro-backend`. |
| **Configuration** | A validated `PraxisConfig` object and the serialized `praxis.config.json` written to an output. |
| **Module** | A directory under `cli/templates/` with a `manifest.json`; for example `backend.express` or `pro.capability.redis-cache`. |
| **Manifest** | The declarative description of a module's overlays, packages, environment keys, and patches. |
| **Overlay** | A directory tree copied into an output scope when its selectors match. |
| **Selector** | Optional conditions such as language, framework, project type, Pro stack, capability, or cloud. All specified conditions must match. |
| **Scope** | Where a contribution is applied: `root`, `frontend`, or `backend`. |
| **Patch** | An exact, single string replacement applied after overlays. A missing or ambiguous target fails generation. |
| **Token** | A placeholder such as `{{projectName}}` replaced while files are copied or patched. |
| **Capability** | A user-selectable Praxis Pro concern such as `jwt-auth`, `redis-cache`, `kubernetes`, or `terraform`. |
| **Requested capabilities** | The exact Pro capabilities selected by the user. |
| **Resolved capabilities** | Requested capabilities plus deterministic implications, in canonical order. |
| **UI style** | One of 40 landing-page design directions represented by `ui.<style>` modules. |
| **Starter mode** | Framework-native Tailwind/shadcn scaffolding without a styled landing page or `DESIGN.md`. |
| **Template mode** | A selected `ui.<style>` module that replaces the starter page and copies its design guide/assets. |
| **Generated project** | A standalone output. It contains no runtime dependency on the Praxis source repository. |

## “Template” is overloaded

In ordinary conversation, “template” may mean the complete generated application. In the codebase, template modules are smaller composable units. A fullstack output can combine a workspace module, frontend module, styling module, UI module, backend module, database module, auth module, cache module, and several deployment modules.

The authoritative list selected for a configuration comes from [`resolveModules`](../cli/src/config/resolver.ts), not from the number of directories under `cli/templates/`.

