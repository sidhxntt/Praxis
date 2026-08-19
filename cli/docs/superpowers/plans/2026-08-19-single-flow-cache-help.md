# Single Flow, Cache Modules, and Help Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make bare Praxis Flow launch the composable custom wizard, add complete help, and scaffold Redis or Memcached caching alongside backend projects.

**Architecture:** Command parsing produces only `create` or `help`; bare invocation becomes a custom create command and the legacy runner is removed from dispatch. Cache selection becomes part of the versioned backend configuration and resolves to manifest-driven modules that patch Express lifecycle and optionally Docker Compose. Existing schema-version-1 config files without cache normalize to `none` at the file-loading boundary.

**Tech Stack:** TypeScript, Clack prompts, Vitest, manifest overlays/patches, Express 5, `redis`, `memjs`, Docker Compose.

---

### Task 1: Canonical command routing and help

**Files:**
- Modify: `src/cli/command.ts`
- Modify: `src/cli/run.ts`
- Create: `src/cli/help.ts`
- Modify: `src/index.ts`
- Delete: `src/legacy/runLegacy.ts`
- Test: `tests/cli/command.test.ts`
- Test: `tests/cli/run.test.ts`
- Create: `tests/cli/help.test.ts`

- [ ] **Step 1: Write failing parser tests**

Assert that `parseCommand([])` returns `{ kind: "create", mode: "custom", installDependencies: true }`; that `help`, `--help`, and `-h` return `{ kind: "help" }`; and that `legacy` throws an error containing `praxiflow help`.

- [ ] **Step 2: Run parser tests and verify RED**

Run `npm test -- tests/cli/command.test.ts`. Expected: failures because bare invocation is legacy and help is unsupported.

- [ ] **Step 3: Implement parser behavior**

Replace the legacy command union with:

```ts
export type ParsedCommand =
  | { kind: "help" }
  | {
      kind: "create";
      projectName?: string;
      mode: "quick" | "custom" | "config";
      configPath?: string;
      installDependencies: boolean;
    };
```

Normalize no arguments to custom create. Accept optional `create` as the first argument, and parse the remaining positional name/options identically. Return help for the three help spellings. Unknown input must say `Run "praxiflow help" for usage.`

- [ ] **Step 4: Write dispatch/help tests and verify RED**

Assert bare dispatch calls `create`, help dispatch writes `formatHelp()` once, and help text includes canonical, quick, config, no-install, and help commands. Run `npm test -- tests/cli/run.test.ts tests/cli/help.test.ts`; expected failures because dispatch still requires legacy.

- [ ] **Step 5: Implement dispatch and help**

Create `formatHelp(): string` with a stable plain-text usage table. Change `runCli` dependencies to `{ create, write? }`, dispatch help without prompts, remove `runLegacy` from `src/index.ts`, and delete its file. Keep the old installer/controller source untouched because it is no longer reachable and may be removed separately.

- [ ] **Step 6: Run CLI tests and commit**

Run `npm test -- tests/cli`. Expected: all CLI tests pass. Commit with `feat: make custom flow the default`.

### Task 2: Cache configuration and prompt

**Files:**
- Modify: `src/config/schema.ts`
- Modify: `src/config/load.ts`
- Modify: `src/config/resolver.ts`
- Modify: `src/workflow/answers.ts`
- Modify: `src/workflow/runCreate.ts`
- Test: `tests/config/schema.test.ts`
- Test: `tests/config/load.test.ts`
- Test: `tests/config/resolver.test.ts`
- Test: `tests/workflow/answers.test.ts`

- [ ] **Step 1: Write failing schema and migration tests**

Add expectations for `backend.cache` accepting `redis`, `memcached`, and `none`; rejecting other values; quick mode defaulting to `none`; and `loadConfigFile` mapping an otherwise valid cache-less v1 backend to `cache: "none"`.

- [ ] **Step 2: Run configuration tests and verify RED**

Run `npm test -- tests/config tests/workflow/answers.test.ts`. Expected: cache assertions fail because the field does not exist.

- [ ] **Step 3: Implement types, validation, and migration**

Add `CacheProvider = "redis" | "memcached" | "none"`, require `cache` in backend config, include it in allowed keys, and validate it. In `loadConfigFile`, parse JSON, add `cache: "none"` only when a backend object lacks the property, then validate. Do not silently normalize direct `validateConfig` calls.

- [ ] **Step 4: Add the custom prompt and answer mapping**

For backend/fullstack projects, prompt after authentication:

```ts
const cache = await select<CacheProvider>("Cache", [
  ["redis", "Redis"],
  ["memcached", "Memcached"],
  ["none", "None"],
]);
```

Pass it through `answersToConfig`. Frontend projects omit it with the rest of backend config.

- [ ] **Step 5: Resolve cache modules**

Append `cache.redis` or `cache.memcached` after the backend/database/auth modules when cache is not `none`. Add exact module-order assertions.

- [ ] **Step 6: Run focused tests and commit**

Run `npm test -- tests/config tests/workflow/answers.test.ts`. Expected: all pass. Commit with `feat: add cache selection to project config`.

### Task 3: Redis and Memcached template modules

**Files:**
- Create: `templates/cache.redis/manifest.json`
- Create: `templates/cache.redis/files/typescript/src/lib/cache.ts`
- Create: `templates/cache.redis/files/javascript/src/lib/cache.js`
- Create: `templates/cache.memcached/manifest.json`
- Create: `templates/cache.memcached/files/typescript/src/lib/cache.ts`
- Create: `templates/cache.memcached/files/javascript/src/lib/cache.js`
- Modify: `src/composer/manifest.ts`
- Modify: `src/composer/compose.ts`
- Test: `tests/generator/matrix.test.ts`
- Test: `tests/composer/compose.test.ts`

- [ ] **Step 1: Write failing generation tests**

Generate TypeScript Redis and JavaScript Memcached backends. Assert the selected client dependency, `CACHE_URL`, cache helper, startup/shutdown patch, `/api/cache` route, and absence of the unselected client.

- [ ] **Step 2: Run matrix tests and verify RED**

Run `npm test -- tests/generator/matrix.test.ts`. Expected: resolver/manifests fail because cache modules do not exist.

- [ ] **Step 3: Implement Redis module**

Use `redis` version `6.2.1`, default URL `redis://localhost:6379`, `connectCache`, `disconnectCache`, and async `cacheGet`/`cacheSet`. Patch Express imports, startup tasks, and an example route that sets `praxis:example` then reads it.

- [ ] **Step 4: Implement Memcached module**

Use `memjs` version `1.3.2` and `@types/memjs` version `1.3.3` for TypeScript, default server `localhost:11211`, readiness check via a short-lived set/get, `disconnectCache`, and Promise-based get/set helpers. Apply the same Express marker contract and example route.

- [ ] **Step 5: Add cache manifest selector support**

Add optional `cache?: "redis" | "memcached" | "none"` to overlays, patches, package contributions, and environment contributions. Extend selector matching and test that nonmatching cache contributions are filtered.

- [ ] **Step 6: Run matrix/composer tests and commit**

Run `npm test -- tests/generator/matrix.test.ts tests/composer/compose.test.ts`. Expected: all pass. Commit with `feat: add Redis and Memcached modules`.

### Task 4: Conditional Docker cache services

**Files:**
- Modify: `templates/deployment.docker/manifest.json`
- Modify: `tests/generator/matrix.test.ts`

- [ ] **Step 1: Write failing Docker assertions**

For Redis, assert Compose contains `redis:7-alpine`, backend `CACHE_URL=redis://cache:6379`, and `depends_on: cache`. For Memcached, assert `memcached:1.6-alpine` and `CACHE_URL=cache:11211`. For none, assert no cache service.

- [ ] **Step 2: Run matrix tests and verify RED**

Run `npm test -- tests/generator/matrix.test.ts`. Expected: cache service assertions fail.

- [ ] **Step 3: Add conditional Compose patches**

Add cache-filtered patches for backend and fullstack Compose files. Insert a `cache` service and backend environment/depends-on entries without creating `.env` secrets. Keep frontend-only Compose unchanged.

- [ ] **Step 4: Verify generated Compose and commit**

Run the matrix tests, generate both cache variants, and run `docker compose config --quiet` in each. Commit with `feat: add cache services to Docker output`.

### Task 5: Documentation, smoke testing, and release verification

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Test: all tests

- [ ] **Step 1: Update documentation**

Document bare custom flow, cache prompt/options, help commands, explicit legacy removal, quick/config aliases, and cache environment setup. Remove text describing branch-based generation as an available workflow.

- [ ] **Step 2: Bump the minor version**

Change package version from `1.3.0` to `1.4.0` and update the lockfile through `npm install --package-lock-only`.

- [ ] **Step 3: Run full local verification**

Run `npm run check`, `npm audit --omit=dev`, `npm pack --dry-run`, and `git diff --check`. Expected: all exit zero, all tests pass, and cache templates appear in the tarball.

- [ ] **Step 4: Run CLI smoke tests**

Run `node dist/index.js help` and verify it exits zero without prompting. Generate from a cache-enabled config with `--no-install` and verify the project name prompt is skipped only when a name is supplied in config/arguments.

- [ ] **Step 5: Build generated projects**

Install and build a TypeScript/Redis project and a JavaScript/Memcached project. Run production audits and `docker compose config --quiet` for both. Expected: zero build failures, zero production vulnerabilities, valid Compose.

- [ ] **Step 6: Relink and commit**

Run `npm link`, verify `praxiflow help`, and commit remaining documentation/version changes with `chore: release Praxis Flow 1.4.0`.
