# Manifest-driven architecture: turning choices into a system

As an engineering system grows, it often begins with a collection of complete, hand-assembled variants. One Git branch might represent a frontend stack, another a backend stack, and another a particular combination of database, authentication, and deployment choices. This is straightforward at first: each variant is visible, runnable, and easy to explain in isolation.

It does not stay simple for long.

Every new option multiplies the number of variants that need to be created, tested, documented, and kept current. A bug fix made in one branch may need to be copied into several others. Two branches that began nearly identical slowly drift apart. The system starts organizing implementation around every possible *combination* rather than around the smaller capabilities that compose that combination.

Manifest-driven architecture is a response to that problem.

## The core idea

A manifest is structured data that declares intent. It describes *what* a component contributes and the conditions under which it applies, without making the caller understand every implementation detail.

For example, a module manifest might declare:

- files or templates it contributes;
- dependencies, scripts, or environment variables it requires;
- the configurations for which those contributions are valid;
- dependencies on other modules;
- explicit integration points or patches it needs to apply.

An engine reads those declarations, validates them, resolves the selected modules into an order, and produces the final result. The result might be a generated application, an infrastructure deployment, a CI pipeline, a workflow, or a runtime configuration.

This is a declarative model: callers state the desired outcome and a shared system performs the assembly. The alternative is usually imperative and distributed: each branch, script, or special-case code path embeds its own sequence of instructions for producing a result.

## A beginner-friendly way to picture it

Think of a restaurant order. A customer says, “I would like a vegetarian pizza with extra cheese.” They do not need to know where the dough is stored, how long the oven runs, or which cook performs each step. Their order is a declaration of the desired result. The kitchen has a repeatable process for validating the order, gathering compatible ingredients, and making the pizza.

A manifest plays the role of the order. The composition engine plays the role of the kitchen.

This does **not** mean the manifest is magic. The engine still contains ordinary code, and engineers still build and test the modules. The difference is where responsibilities live:

| Without manifests | With manifests |
| --- | --- |
| Each branch or script contains a full recipe. | Each module declares its contribution to a shared recipe. |
| The caller chooses a prebuilt variant. | The caller states the choices they want. |
| Variation is copied into many places. | Variation is modeled as data and reusable modules. |
| Compatibility is often discovered late. | Compatibility can be checked before assembly. |

### What happens, step by step

Suppose a person asks a system to create a TypeScript application with a web frontend, a PostgreSQL database, and Docker support. The flow is usually this:

1. **The person provides intent.** They answer prompts or write a configuration such as `language: TypeScript`, `database: PostgreSQL`, and `deployment: Docker`.
2. **The system validates the choices.** It checks that every value is known and that the combination is supported. For example, it can reject a deployment option that requires files the selected project type does not have.
3. **A resolver chooses modules.** The system maps the choices to building blocks such as `base-typescript`, `web-frontend`, `postgres`, and `docker`.
4. **Dependencies are added.** If the Docker module requires a particular base layout, or a background-job module requires a cache, the resolver can add those prerequisites automatically or explain the requirement.
5. **The modules are ordered.** A base must exist before a module can add files to it; a database must exist before another module can add a database-backed service. The ordering is part of the system’s contract, not an accident of whichever script ran first.
6. **The composer assembles the result.** It copies declared files, merges declared dependencies, creates example environment settings, and applies narrowly defined integration changes.
7. **The system refuses unsafe conflicts.** If two modules try to provide different versions of the same dependency or overwrite the same file without permission, composition stops with an explanation.
8. **The completed result is published.** A robust implementation builds in a temporary location first and moves the result into place only if every step succeeds. It also saves the effective configuration so the output can be understood or recreated later.

The same eight ideas work whether the “result” is a source repository, a cloud environment, a release pipeline, or a configured product account.

## From variants to composable capabilities

Consider a project generator with four independently useful choices:

| Choice | Example values |
| --- | --- |
| Language | TypeScript, JavaScript |
| Frontend | Next.js, Vite, Vue |
| Database | PostgreSQL, MySQL, none |
| Deployment | Docker, Kubernetes, none |

Representing every supported combination as a separate branch quickly becomes expensive. Even a modest catalog produces dozens of branches, and the actual number grows whenever another dimension is added.

With manifests, the system instead treats each choice as a module with a defined contract. A resolver can select the requested modules, add required dependencies, reject incompatible combinations, and hand the ordered set to a composer. The composer applies their declared contributions into one result.

The important change is not that the configuration happens to be JSON. JSON, YAML, TOML, or a typed object are only formats. The architectural shift is from **preassembled variants** to **validated composition**.

```mermaid
flowchart LR
    I[Desired intent] --> V[Validate configuration]
    V --> R[Resolve compatible modules]
    R --> C[Compose declared contributions]
    C --> O[Result: project, deployment, or workflow]
```

## Why teams make this change

### It controls combinatorial growth

A branch-per-combination model scales with the number of combinations. A manifest model scales more closely with the number of reusable modules and their explicitly supported interactions. That is still real work—compatibility must be designed and tested—but it avoids duplicating entire implementations for every variation.

### It makes intent inspectable

A manifest provides a compact record of why a result looks the way it does. Instead of inferring configuration from a branch name, a long script, or a generated tree, engineers can inspect the selected configuration and module declarations.

That improves reviews, support, debugging, and reproducibility. Given the same version of the composition engine, module catalog, and validated manifest, a system should be able to reproduce the same result.

### It separates policy from mechanism

The configuration expresses policy: “use this framework,” “enable this capability,” or “deploy this service.” The resolver and composer implement the mechanism: ordering, copying, merging, patching, validation, and publishing.

This separation allows one reliable mechanism to serve many product decisions. It also gives maintainers one place to improve safety and diagnostics instead of teaching every branch or bespoke script the same lessons.

### It establishes explicit contracts

Well-designed manifests make integration points visible. A module can declare the files it owns, the dependencies it needs, and the anchors it expects to modify. Conflicting ownership or incompatible versions can fail early and clearly instead of silently producing a partially working result.

This is a key difference between disciplined composition and merely scattering configuration files around a repository.

### It supports automation and tooling

Because manifests are structured, machines can validate them before execution, generate documentation, calculate dependency graphs, enforce organization-wide rules, and test a meaningful matrix of combinations. People can also review them more easily than ad hoc shell logic.

This is why the same broad idea appears in many mature engineering systems: Kubernetes resource manifests, infrastructure-as-code definitions, package manifests, build metadata, deployment descriptors, and feature/configuration catalogs all make desired state legible to shared tooling.

## Concrete use cases

The following examples use different domains, but they all share the same shape: a person or system provides desired state; a validator and resolver select compatible building blocks; a shared engine produces or enforces the result.

### 1. Application and project generation

This is the closest example to Praxis. A team may need starter projects for different languages, frontends, databases, authentication styles, caching systems, and deployment targets.

**Without composition:** the team maintains branches such as `next-postgres-docker`, `vue-mysql-docker`, and `next-postgres-kubernetes`. A security fix to a shared login component must be copied into every relevant branch. Adding one more database or deployment option creates many new branch combinations.

**With composition:** each concern becomes a module. A frontend manifest declares its files and browser dependencies; a PostgreSQL module declares its client library, environment variables, and migration setup; a Docker module declares container files and integration anchors. The user selects the desired stack, and the composer constructs only that stack.

**Why it helps:** engineers improve the PostgreSQL module once instead of editing every starter that happens to use PostgreSQL. The generator can reject unsupported choices before creating a repository.

### 2. Infrastructure and cloud environments

Infrastructure-as-code is one of the clearest examples of manifest-driven thinking. A team describes resources such as networks, databases, application services, identity policies, and monitoring alerts. Tools turn those declarations into cloud-provider API calls.

For example, a service manifest might say it needs a private network, two running instances, access to a database, a domain name, and a monitoring policy. A platform resolver can select approved modules for each resource and apply company rules, such as encryption or required tags.

**Why it helps:** the desired environment is reviewable in source control. An engineer can see the difference between “one instance” and “two instances” before deploying it. A shared platform can apply security defaults consistently instead of relying on every team to remember them.

**Beginner distinction:** a manifest declares the desired state—“there should be two instances”—rather than a one-off sequence such as “log in, create one instance, then create another.” The infrastructure tool determines what actions are needed to make reality match the declaration.

### 3. Continuous integration and delivery (CI/CD)

Most organizations run the same broad delivery stages: install dependencies, test, build, scan for security problems, publish artifacts, and deploy. Different applications may need different runtimes, databases, release rules, or environments.

Instead of every repository maintaining a long, copied pipeline definition, a platform can offer manifests such as `node-service`, `python-service`, `container-build`, `staging-deploy`, and `production-deploy`. A project selects the modules it needs; the platform combines them into a pipeline with the right ordering and permissions.

For example, `production-deploy` can require that `test`, `security-scan`, and `staging-deploy` have succeeded. The resolver makes that dependency explicit, and the pipeline engine enforces it.

**Why it helps:** release policy changes—such as adding a vulnerability scan—can be made in one maintained module. Teams get a consistent baseline without losing the ability to declare the capabilities unique to their service.

### 4. Data pipelines

A data platform often needs to ingest data, validate it, transform it, store it, and make it available to analysts or applications. These stages are composable: a pipeline might select a source connector, a schema check, a transformation module, a schedule, and a destination.

Imagine a marketing team wants daily reporting from an advertising platform. Its pipeline manifest could declare:

- source: advertising API;
- schedule: daily at 06:00;
- validation: reject records without a campaign identifier;
- transformation: convert spending to the company currency;
- destination: analytics warehouse;
- owner: marketing-operations.

The data platform validates that the connector exists, creates the schedule, grants the right permissions, applies the transformation, and records ownership and alerts.

**Why it helps:** every pipeline follows the same operational rules for monitoring, data ownership, retries, and quality checks. A beginner can focus on describing the data they need rather than rebuilding scheduler and alerting logic from scratch.

### 5. Product features and tenant configuration

Software sold to multiple customers often has features that must be enabled differently for different accounts. A feature manifest can describe a capability, the plans that include it, prerequisites, limits, permissions, and user-interface exposure.

For example, an `advanced-analytics` capability may require that an account is on a business plan, may enable a set of reports, may grant access only to administrators, and may depend on data retention being enabled. A configuration service validates those rules when an account’s settings change.

**Why it helps:** product managers and engineers can inspect one definition of the feature’s rules. The application does not need scattered `if customer is X` checks across unrelated code. Importantly, this does not replace authorization code; the manifest describes the policy, while the product still enforces it at runtime.

### 6. Developer workspaces and local environments

Onboarding can be painful when every engineer needs a different collection of language runtimes, databases, editors, linters, secrets, and local services. A workspace manifest can declare the project’s development requirements.

For a web application, it might select a Node runtime, a package manager, a local PostgreSQL container, required environment-variable names, formatting tools, and common editor extensions. A setup tool reads the manifest and prepares a consistent local environment.

**Why it helps:** “works on my machine” becomes less likely because the project declares what a machine needs. New contributors can use the same setup definition as existing maintainers.

### 7. Hardware and embedded systems

The pattern is not limited to cloud software. In hardware or embedded development, a product configuration can declare its board model, processor, peripherals, memory profile, sensors, and communication protocol. Build tooling uses that configuration to select the correct drivers, compiler flags, test fixtures, and firmware modules.

For example, selecting a board with a particular temperature sensor can pull in its driver and calibration configuration while rejecting a radio protocol that the board does not support.

**Why it helps:** hardware variation is expressed as an explicit configuration rather than as many nearly identical firmware forks. Engineers can see which capabilities a device is expected to have and test the supported matrix deliberately.

## Praxis as one example

Praxis originally had branch-specific starters: a branch represented a whole preassembled template. Its current model captures the chosen project shape in a validated configuration and resolves it into ordered modules. Each module has a manifest that can contribute files, package metadata, environment keys, and narrowly defined patches.

The benefit is not simply fewer branches. It is that a database, cache, UI style, backend stack, or deployment layer can be maintained as a capability with a clear contract and then composed with compatible capabilities. The output configuration also becomes a record of what was generated.

The same pattern would work for many other systems. In infrastructure, modules may contribute cloud resources and policies. In CI, they may contribute jobs, permissions, and release steps. In a data platform, they may contribute sources, transformations, schedules, and quality checks. The manifest represents the contract; the shared engine is responsible for safe assembly.

## What a healthy manifest system needs

Manifests do not remove complexity. They move complexity into a place where it can be named, validated, and managed. A strong system normally includes the following safeguards:

- **A schema:** reject malformed or incomplete declarations before composition begins.
- **Compatibility rules:** make supported and unsupported combinations explicit.
- **Deterministic resolution:** the same valid input should select modules in the same order.
- **Conflict detection:** fail when two modules claim incompatible ownership of the same file, dependency, or setting.
- **Explicit extension points:** use narrow, stable integration anchors rather than broad, implicit rewrites.
- **Provenance:** record the effective configuration and versions used to create an output.
- **Matrix testing:** test representative valid combinations, important boundaries, and known invalid combinations.
- **Atomic publication:** build in a staging area and publish only after the full composition succeeds.

Without these guardrails, configuration can become a different kind of sprawl: opaque files whose interactions are difficult to predict. Declarative architecture earns its value through clear semantics and dependable validation.

## Tradeoffs and limits

A manifest-driven approach is not automatically the right answer. It introduces a composition engine, a schema, rules for precedence, and a need to design module boundaries carefully. Debugging may require tracing from user intent through resolution to the final output. For a tiny system with only one stable variant, a single direct implementation is often clearer.

It is a good fit when variations are real, recurring, and independently meaningful; when teams need consistent outcomes across those variations; and when a shared engine can enforce rules more reliably than many copies of almost-the-same implementation.

It is a poor fit when the proposed “modules” are not genuinely reusable, when every integration is a unique exception, or when the manifest becomes a disguised programming language with uncontrolled side effects. In those cases, simplify the domain or keep the logic in ordinary code with well-defined interfaces.

## The larger lesson

Manifest-driven architecture is a way of treating choices as first-class engineering data. It asks teams to model the stable pieces of a system, define their contracts, and let a common engine assemble supported combinations.

That makes change more deliberate. Instead of copying and editing a complete variant, an engineer adds or improves one capability, declares how it interacts with the rest of the system, and lets validation reveal what is safe to combine. For systems like Praxis—and for many infrastructure, platform, and workflow problems—that is the path from a growing pile of variants to an architecture that can keep evolving.
