BRANCH ?= $(shell git branch --show-current)
VERSION ?= patch

.PHONY: publish-cli

## Bump, commit, tag, and publish the CLI release through GitHub Actions.
# Usage: make publish-cli VERSION=patch|minor|major|1.4.4
#   patch: increments the last number for backward-compatible fixes (1.4.3 -> 1.4.4)
#   minor: increments the middle number for backward-compatible features (1.4.3 -> 1.5.0)
#   major: increments the first number for breaking changes (1.4.3 -> 2.0.0)
#   1.4.4: publishes an explicit version number instead of calculating one
publish-cli:
	@test "$(BRANCH)" = "$$(git branch --show-current)" || { echo "BRANCH must be the checked-out branch"; exit 1; }
	@git diff --cached --quiet || { echo "Refusing to run with staged changes"; exit 1; }
	npm version "$(VERSION)" --workspace cli --include-workspace-root=false --no-git-tag-version
	git add cli/package.json cli/tests/package.test.ts package-lock.json
	@version="$$(node -p \"require('./cli/package.json').version\")"; git commit -m "chore(cli): release $$version"
	@version="$$(node -p \"require('./cli/package.json').version\")"; git tag -a "cli-v$$version" -m "Praxis Flow CLI $$version"
	git push origin "$(BRANCH)" --follow-tags
