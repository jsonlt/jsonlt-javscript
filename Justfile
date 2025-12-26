set shell := ['uv', 'run', '--frozen', 'bash', '-euxo', 'pipefail', '-c']
set unstable
set positional-arguments

project := "jsonlt"
pnpm := "pnpm exec"

# List available recipes
default:
  @just --list

# Run benchmarks
benchmark *args:
  {{pnpm}} vitest bench "$@"

# Build distribution packages
build: clean
  {{pnpm}} tsup

# Clean build artifacts
clean:
  #!/usr/bin/env bash
  rm -rf dist coverage .vitest

# Format code
format:
  codespell --toml pyproject.toml -w
  {{pnpm}} biome format --write .

# Fix code issues
fix:
  {{pnpm}} biome format --write .
  {{pnpm}} biome check --write .

# Fix code issues including unsafe fixes
fix-unsafe:
  {{pnpm}} biome check --write --unsafe

# Run all linters
lint:
  {{pnpm}} biome check .
  {{pnpm}} tsc --noEmit
  codespell --toml pyproject.toml
  yamllint --strict .
  {{pnpm}} markdownlint-cli2 "**/*.md"

# Lint Markdown files
lint-markdown:
  {{pnpm}} markdownlint-cli2 "**/*.md"

# Lint TypeScript code
lint-typescript:
  {{pnpm}} biome lint .
  {{pnpm}} tsc --noEmit

# Lint prose in Markdown files
lint-prose:
  vale CODE_OF_CONDUCT.md CONTRIBUTING.md README.md SECURITY.md

# Check spelling
lint-spelling:
  codespell --toml pyproject.toml

# Check types
lint-types:
  {{pnpm}} tsc --noEmit

# Lint web files (JS, JSON, TS)
lint-web:
  {{pnpm}} biome check .

# Install all dependencies (Python + Node.js)
install: install-node install-python

# Install only Node.js dependencies
install-node:
  #!/usr/bin/env bash
  pnpm install --frozen-lockfile

# Install pre-commit hooks
install-prek:
  prek install

# Install only Python dependencies
install-python:
  #!/usr/bin/env bash
  uv sync --frozen

# Run pre-commit hooks on changed files
prek:
  prek

# Run pre-commit hooks on all files
prek-all:
  prek run --all-files

# Publish to npm (requires npm auth)
publish-npm: build
  {{pnpm}} npm publish --access public

# Publish to npm with dry run
publish-npm-dry: build
  {{pnpm}} npm publish --access public --dry-run

# Generate SBOM for current environment
sbom output="sbom.cdx.json":
  uv run --isolated --group release cyclonedx-py environment --of json -o {{output}}

# Run tests (excludes benchmarks by default)
test *args:
  {{pnpm}} vitest run "$@"

# Run all tests including slow tests
test-all *args:
  {{pnpm}} vitest run "$@"

# Run conformance tests
test-conformance *args:
  {{pnpm}} vitest run --project conformance "$@"

# Run tests with coverage
test-coverage *args:
  {{pnpm}} vitest run --coverage "$@"

# Run unit tests
test-unit *args:
  {{pnpm}} vitest run --project unit "$@"

# Run only failed tests from last run
test-failed *args:
  {{pnpm}} vitest run --reporter=verbose --changed "$@"

# Watch mode for tests
test-watch *args:
  {{pnpm}} vitest "$@"

# Sync Vale styles and dictionaries
vale-sync:
  vale sync
