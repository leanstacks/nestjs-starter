# Monorepo Guide

This project is organized as an **npm workspaces monorepo**. This guide explains the workspace layout and the conventions used for npm, TypeScript, and Vitest configuration so new engineers can quickly understand how the pieces fit together.

## Table of Contents

- [Workspace Layout](#workspace-layout)
- [npm Workspaces & package.json](#npm-workspaces--packagejson)
- [TypeScript Configuration](#typescript-configuration)
- [Vitest Configuration](#vitest-configuration)
- [Linting & Formatting](#linting--formatting)
- [Running Scripts](#running-scripts)
- [Adding Dependencies](#adding-dependencies)
- [Adding a New Package](#adding-a-new-package)

## Workspace Layout

```
├── package.json          # Root workspace configuration & hoisted tooling
├── tsconfig.base.json    # Base TypeScript configuration, extended by packages
├── vitest.config.ts      # Base Vitest configuration, extended by packages
├── .oxlintrc.json        # Shared oxlint configuration
└── packages/
    ├── api/              # NestJS web application (@nestjs-starter/api)
    └── infra/            # AWS CDK infrastructure as code (@nestjs-starter/infra)
```

Each package under `packages/` is a self-contained npm workspace with its own `package.json`, dependencies, and scripts, while common tooling and configuration are centralized at the repository root.

## npm Workspaces & package.json

The root `package.json` declares the workspaces and hoists dependencies shared across packages:

```json
{
  "workspaces": ["packages/api", "packages/infra"]
}
```

- **Hoisting**: `npm install` at the root resolves and hoists dependencies for all workspaces into the top-level `node_modules`, with a single `package-lock.json`. Always run `npm install` from the repository root, not from within a package directory.
- **Root scripts** fan out to every workspace using `--workspaces --if-present`, so a package without a given script is simply skipped:

  ```json
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:coverage": "npm run test:coverage --workspaces --if-present",
    "test:e2e": "npm run test:e2e --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "lint:fix": "npm run lint:fix --workspaces --if-present",
    "clean": "npm run clean --workspaces --if-present"
  }
  ```

- **Package-specific scripts** (e.g., `start`, `start:dev`, CDK `deploy`/`synth`/`diff`) live only in the relevant package's `package.json`, since they don't apply to every workspace.
- **Formatting** (`format`, `format:check`) runs Prettier once at the root against the entire repository rather than per-package, since Prettier doesn't need workspace awareness.
- **Package naming**: workspace packages are scoped as `@nestjs-starter/api` and `@nestjs-starter/infra`.

## TypeScript Configuration

`tsconfig.base.json` at the root defines shared compiler options (target, module resolution, strictness, decorator metadata, etc.). Each package extends it and overrides only what it needs:

```json
// packages/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```json
// packages/infra/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "."
  }
}
```

Per **AGENTS.md**, never use relative paths to cross workspace boundaries (e.g., `../../packages/api/...`). Import shared packages by their workspace name instead.

## Vitest Configuration

All packages use [Vitest](https://vitest.dev/) as the unified test runner. The root `vitest.config.ts` defines the shared test configuration (globals, `node` environment, coverage provider `v8`, coverage reporters), and each package merges its own overrides on top using `mergeConfig`:

```typescript
// packages/api/vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.ts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      root: './',
    },
  }),
);
```

- Unit tests are **co-located** with the source files they test (`*.test.ts` or `*.spec.ts`), per the co-location principle in AGENTS.md.
- The `packages/api` package has an additional `vitest.config.e2e.ts` for end-to-end tests (matching `test/**/*.e2e-spec.ts`), run via `npm run test:e2e`.
- The `packages/infra` package excludes the CDK app entry point (`src/app.ts`) from tests and coverage, since it only wires stacks together.
- Coverage floor: unit test coverage for modified code paths must remain at or above **70%** in each package (see [AGENTS.md](../AGENTS.md)).

## Linting & Formatting

- **oxlint** is the Linter for this project. Each package runs `oxlint --type-aware` scoped to its own source directories (e.g., `oxlint --type-aware src/ test/` in `packages/api`), sharing the root `.oxlintrc.json` configuration.
- **Prettier** formats the entire repository from the root; there is no per-package Prettier configuration.
- A pre-commit hook (Husky, `.husky/precommit`) runs `npm run format:check`, `npm run lint`, and `npm run test` before allowing a commit.

## Running Scripts

Run scripts from the repository root, optionally scoped to a single package with `-w <path>` or `--workspace <path>`:

```bash
# Run a script in every workspace
npm run test

# Run a script in a single workspace
npm run start -w packages/api
npm run synth -w packages/infra

# Install a dependency into a single workspace
npm install <package> -w packages/api
```

You can also `cd packages/api` (or `packages/infra`) and run scripts directly with `npm run <script>`, since npm workspaces symlink the hoisted `node_modules` into each package.

## Adding Dependencies

- Use `npm install <package> -w <workspace-name>` to add a dependency scoped to one package (e.g., `npm install lodash -w packages/api`).
- Only add a dependency at the root (without `-w`) if it is truly shared tooling used across every package (e.g., `prettier`, `vitest`, `typescript`).
- Never manually edit a package's `node_modules`; always reinstall from the root so the hoisted lockfile stays consistent.

## Adding a New Package

1. Create a new directory under `packages/<name>` with its own `package.json` (using the `@nestjs-starter/<name>` naming convention).
2. Add a `tsconfig.json` that extends `../../tsconfig.base.json`.
3. Add a `vitest.config.ts` that merges `../../vitest.config.ts` with any package-specific overrides.
4. Run `npm install` from the repository root to register the new workspace.
5. Add package-specific scripts (`build`, `test`, etc.) to the new package's `package.json` so they're picked up by the root's `--workspaces --if-present` scripts.
