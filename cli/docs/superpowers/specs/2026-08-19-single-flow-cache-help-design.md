# Praxis Flow: Single Interactive Flow, Cache Modules, and Help

## Goals

- Make `praxiflow` the single canonical interactive experience.
- Start with the existing splash, ask for the project name, and then run the composable custom questionnaire.
- Remove access to the old branch-cloning workflow, including `praxiflow legacy`.
- Add Redis, Memcached, and no-cache choices for backend and fullstack projects.
- Add discoverable help through `praxiflow help`, `praxiflow --help`, and `praxiflow -h`.

## Command behavior

`praxiflow` launches custom mode with no positional project name. The flow displays the Praxis splash first, prompts for the project name, and then asks project type, language, framework, database, authentication, cache, deployment, package manager, dependency installation, and Git initialization as applicable.

`praxiflow create` and `praxiflow create --custom` remain compatibility aliases for the same custom flow. A positional name may still be supplied for scripts or repeat use. `praxiflow create --quick` and `praxiflow create --config <file>` remain automation paths. `praxiflow legacy` becomes an unknown command and the old branch-based runner is removed from CLI dispatch.

Help exits successfully without starting prompts. It lists the canonical interactive command, compatibility aliases, quick/config modes, `--no-install`, and help flags with short examples.

## Configuration and cache modules

Backend configuration gains a required `cache` field with values `redis`, `memcached`, or `none`. Frontend-only configurations have no backend cache field. Quick mode uses `none` so it does not introduce an unexpected service. Existing version-1 configuration files without `cache` are normalized to `none` when loaded, while newly emitted configurations always contain the field.

The resolver adds `cache.redis` or `cache.memcached` after the backend module when selected. Each module contributes:

- a pinned client dependency;
- TypeScript and JavaScript cache helpers;
- `CACHE_URL` in `.env.example`;
- server startup connection/readiness and graceful shutdown integration;
- a small `/api/cache` example endpoint that demonstrates a set/get operation.

Redis uses the official `redis` client. Memcached uses `memjs`. Connection failures abort startup with the existing generator server error path rather than silently disabling caching.

When Docker is selected, the generated Compose file includes the matching Redis or Memcached service and injects its internal `CACHE_URL` into the backend. Without Docker, the user supplies `CACHE_URL` from `.env`.

## Composition architecture

Manifest selectors gain an optional cache selector so Docker overlays and patches can be conditional without mixing Redis and Memcached artifacts. Cache modules follow the existing database-module conventions: overlays, package contributions, environment contributions, and persistent server markers. Composition remains atomic and path-confined.

## Error handling

- Unsupported cache values fail configuration validation with a direct message.
- Cache selections are rejected for frontend-only projects through the existing backend shape validation.
- Cache patch targets must exist; composition cleans staging output on failure.
- `legacy` and unknown commands return a nonzero exit with a pointer to `praxiflow help`.

## Testing and verification

- Parser tests prove bare invocation selects custom mode and all help spellings return help.
- Dispatch tests prove bare invocation calls the composable workflow and never the legacy runner.
- Schema, config-loading, answer-mapping, and resolver tests cover all cache values and backward-compatible normalization.
- Composer and generation matrix tests verify Redis/Memcached files, packages, environment keys, server patches, and Docker services.
- CLI smoke tests verify help output and a noninteractive config generation.
- Generated TypeScript/Redis and JavaScript/Memcached projects are installed, built, audited, and Docker-validated.
- The full Praxis test/build/package verification remains the release gate.
