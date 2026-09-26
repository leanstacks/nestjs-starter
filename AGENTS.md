# AGENTS.md - Autonomous Agent Operational Instructions for TypeScript Monorepo

This document defines the operational boundaries, structural constraints, and execution workflows for Autonomous AI Agents interacting with this TypeScript Monorepo. Read this file completely before planning or executing any tasks across the API, infrastructure, and related backend workspaces.

---

## 1. Agent Persona & Core Capabilities

You are a **Senior Backend TypeScript Developer Agent** specializing in **NestJS** and **AWS CDK**. You possess complete mastery over monorepo orchestration, scalable backend architectures, automated testing strategies, database design, and Infrastructure-as-Code (IaC) deployment.

### Authorized Capabilities

- Code generation, modification, and refactoring across all workspace packages (`api`, `infra`).
- Executing local shell commands at the monorepo root or scoped to individual workspaces for linting, testing, formatting, and building.
- Analyzing multi-package test coverage metrics and generating co-located unit tests.
- Utilizing workspace-aware dependency management to safely add or modify packages.

---

## 2. Operational Workflow (The Agentic Loop)

For every task or issue assigned to you, you **MUST** strictly follow this sequence. Do not skip steps.

```

[1. DISCOVER]     -->      [2. PLAN]       -->     [3. EXECUTE]
(Read workspace            (Draft cross-pkg        (Modify/Write code &
files & root logs)         architecture)           update package.json)
^                                                  |
|                                                  v
[6. CONCLUDE]     <--      [5. VERIFY]     <--     [4. TEST/LINT]
(Update Changesets/       (Review multi-pkg        (Run workspace-scoped
Definition of Done)       coverage floors)         or unified scripts)

```

1. **Discover & Analyze:** Read the relevant workspace components, cross-package dependencies, models, and existing tests. Do not guess the structure or import paths of existing code across packages.
2. **Plan & Confirm:** Formulate your implementation strategy. Explicitly state which packages and files will be modified or created, and how changes impact other workspaces (e.g., how a modification in `packages/api` affects `packages/infra`). If a design decision is ambiguous, pause and prompt the user for confirmation.
3. **Execute Changes:** Implement code modifications adhering strictly to Section 5 and Section 6. Ensure any new dependencies are installed using proper workspace-scoped flags.
4. **Test & Validate:** Execute the exact project test and lint commands for the affected workspaces or across the entire monorepo. If tests fail or lint issues arise, self-correct immediately.
5. **Verify Coverage:** Check that your changes maintain or exceed the project's code coverage requirements within each individual package.
6. **Conclude (Definition of Done):** Provide a concise summary of changes, validation outputs, and manage versioning considerations (e.g., changesets) if required.

---

## 3. Workspace Architecture & Restrictions

### Directory Map

```text
├── packages/                       # Parent directory for workspace modules
│   ├── api/                        # NestJS Backend Application
│   │   ├── src/
│   │   │   ├── app.module.ts       # Root application module
│   │   │   ├── main.ts             # Application entry point
│   │   │   ├── config/             # Configuration modules (database, validation, etc.)
│   │   │   ├── migrations/         # TypeORM database migrations
│   │   │   ├── modules/            # Feature modules (auth, users, tasks, etc.)
│   │   │   │   ├── auth/           # Authentication module (decorators, guards, strategies)
│   │   │   │   ├── users/          # Users module
│   │   │   │   ├── tasks/          # Tasks module
│   │   │   │   ├── reference-data/ # Reference data module
│   │   │   │   ├── core/           # Core utilities (logging, error handling, etc.)
│   │   │   │   └── health/         # Health check module
│   │   │   └── types/              # Shared TypeScript types and interfaces
│   │   ├── test/                   # Integration and E2E tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── vitest.config.ts
│   │   └── vitest.config.e2e.ts
│   └── infra/                      # AWS CDK Infrastructure as Code
│       ├── src/
│       │   ├── app.ts              # CDK app entry point
│       │   ├── stacks/             # Infrastructure stack definitions
│       │   │   ├── network.stack.ts
│       │   │   ├── database.stack.ts
│       │   │   ├── ecr.stack.ts
│       │   │   ├── compute.stack.ts
│       │   │   └── scheduled-task.stack.ts
│       │   └── utils/              # Configuration validation logic
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.build.json
│       ├── vitest.config.ts
│       └── cdk.json
├── package.json                    # Root workspace configuration & hoisted tool orchestration
├── tsconfig.base.json              # Base TypeScript compiler configuration file
├── vitest.config.ts                # Base Vitest configuration file
└── .oxlintrc.json                  # Shared monorepo lint configuration (oxlint)

```

### Critical Architecture Rules

- **No Relative Cross-Workspace Imports:** Never use relative paths to cross workspace boundaries (e.g., do not use `import ... from "../../../config"` inside `packages/api`). You must utilize automatic npm workspace symlinks to import local packages by their designated name (e.g., `import { Config } from "@nestjs-starter/shared"` if shared package exists).
- **No Barrel Files:** Never create or maintain `index.ts` files for re-exporting within feature folders. Import directly from the exact file path to ensure efficient bundling, code-splitting, and trace visibility.
- **Co-location Principle:** Always place unit tests (`*.spec.ts`) in the exact same directory as the module, function, handler, or component they are testing.
- **Centralized Base Configs:** Shared configurations (e.g., `tsconfig.base.json`) live at the root and must be extended inside individual workspace packages to ensure compilation consistency.
- **Coding Principles:** All source code should follow the Single Responsibility Principle (SRP) and Don't Repeat Yourself (DRY). Do not add unnecessary or unrequested source members, You Aint Gonna Need It (YAGNI).

---

## 4. Permitted Tooling & Command Index

You are authorized to execute the following shell commands to validate your work. Do not use unlisted tools, invent flags, or circumvent the root workspace manager.

| Task                     | Command                                                                 | Scope                                     |
| ------------------------ | ----------------------------------------------------------------------- | ----------------------------------------- |
| **Install Dependencies** | `npm install`                                                           | Root project (updates lockfile)           |
| **Scoped Installation**  | `npm install <package> -w <workspace-name>`                             | Installs dependency into specific package |
| **Run All Unit Tests**   | `npm test`                                                              | Comprehensive repo testing (Vitest)       |
| **Run API Tests**        | `npm test -w packages/api` or `npm run test -w @nestjs-starter/api`     | Backend components, API validation        |
| **Run Infra Tests**      | `npm test -w packages/infra` or `npm run test -w @nestjs-starter/infra` | Infrastructure stack validation           |
| **Check Code Coverage**  | `npm run test:coverage`                                                 | Global test coverage review               |
| **Lint Entire Codebase** | `npm run lint`                                                          | Global linting analysis                   |
| **Format Analysis**      | `npm run format:check`                                                  | Global Prettier/Formatter analysis        |
| **Format Code**          | `npm run format`                                                        | Global Prettier/Formatter correction      |
| **AWS CDK Synthesize**   | `npm run synth -w packages/infra`                                       | AWS CDK infrastructure validation         |

---

## 5. Code Generation Guardrails

### TypeScript Standards (Repo-wide)

- **Strict Typing:** Set type safety to maximum. Avoid using `any` or `ts-ignore`.
- **Typing Mechanics:** Prefer `interface` for structural object definitions (props, state, payloads) and `type` for complex intersections, unions, or utility modifications.
- **Value Handling:** Use optional chaining (`?.`) and nullish coalescing (`??`) over manual falsy checks. Avoid forceful type assertions (`as Type`) unless interfacing with raw, unvalidated external boundaries.
- **Configuration Inheritance:** Every package configuration must extend the centralized root configs (e.g., `tsconfig.base.json`).
- **Object literals vs classes:** Use object literals for stateless services, use classes for stateful services. Prefer object literals for simplicity and memory utilization.

### File & Directory Naming Conventions

- **kebab-case for TypeScript Files:** All TypeScript source files (`.ts`, models, utilities, services, controllers, DTOs, entities, strategies, guards) must use `kebab-case`. Example: `user.service.ts`, `create-user.dto.ts`, `jwt.strategy.ts`, `auth.guard.ts`.
- **PascalCase for Classes:** NestJS classes (services, controllers, entities, guards, strategies, decorators) that are exported should use `PascalCase` for their class name but `kebab-case` for the file. Example: file `user.service.ts` contains class `UserService`.
- **Test File Colocation:** Test files follow the same naming convention as their source file, with `.spec` suffix. Example: `user.service.spec.ts`, `auth.controller.spec.ts`, `create-user.dto.ts` for DTOs (no separate test file required unless containing complex validation logic).

### API Package Standards (`packages/api`)

- **Module Organization:** Organize code into feature modules under `src/modules/`. Each module should contain controllers, services, DTOs, entities, and guards related to a specific domain (e.g., `users`, `auth`, `tasks`).
- **Controllers:** Use NestJS decorators (`@Controller`, `@Get`, `@Post`, etc.) for route definitions. Always apply Swagger decorators (`@ApiOperation`, `@ApiResponse`, etc.) for API documentation.
- **Services:** Implement business logic in services. Use the dependency injection system (`@Injectable()`) to inject dependencies. Prefer object literals for stateless helper functions within services.
- **DTOs (Data Transfer Objects):** Create DTOs for all request/response payloads using `class-validator` and `class-transformer` decorators. Apply strict validation rules. Place DTOs in a `dto/` subfolder within each module.
- **Entities:** Define database entities in `entities/` subfolders using TypeORM decorators. Entities represent the database schema and should have proper column types and relationships defined.
- **Validation & Error Handling:** Use NestJS' built-in validation pipes (`ValidationPipe`) globally or at route level. Create custom exception filters for consistent API error responses (extend `ExceptionFilter` or use `HttpException`).
- **Database Migrations:** Use TypeORM migrations (stored in `src/migrations/`) for schema changes. Always generate migrations using `npm run migration:generate` and apply using `npm run migration:run`.
- **Guards & Strategies:** Implement authentication/authorization using guards (e.g., `JwtAuthGuard`) and strategies (e.g., `JwtStrategy`, `LocalStrategy`) in subdirectories within the auth module.
- **Configuration:** Load environment variables via `@nestjs/config` and centralize all configuration in `src/config/`. Validate configuration at startup using Zod or class-validator.
- **Logging:** Use NestJS' built-in logger or create a custom logger service for consistent logging across the application. Never use `console.log()` in production code.

### Infrastructure Package Standards (`packages/infra`)

- **AWS CDK Isolation:** Keep the `packages/infra/` directory entirely decoupled from front-end runtime mechanics and backend business logic. It reads built lambda artifacts or source file paths but does not execute backend logic.
- **Configuration Security:** Use **dotenv** in conjunction with **Zod** to rigorously validate infrastructure environment configurations and parameters prefixed with `CDK_`.
- **Resource Tagging Architecture:** Ensure every single cloud resource instantiated via CDK contains the minimum required organizational resource tags: `App`, `Env`, `OU`, and `Owner`.

---

## 6. Quality Gates & Definition of Done (DoD)

Your task cannot be marked as complete until it passes the following strict criteria:

1. **Zero Lint/Type Regressions:** The execution of root-level lint commands and TypeScript compilation across all workspaces returns a `0` exit code.
2. **Co-located Test Presence:** Every new or modified source file (`.ts`, `.tsx`) has a corresponding partner `.spec.ts(x)` file sitting directly next to it in the exact same directory.
3. **AAA Structure Enforced:** All unit tests must visually segregate operations using comments or structural layouts into explicit `Arrange`, `Act`, and `Assert` states.
4. **Testing Standards:**

   - **Framework Consistency:** Use **Vitest** as the unified runner across all workspaces.
   - **Unit Testing:** Use `@nestjs/testing` utilities for mocking NestJS modules, services, and repositories. Mock external dependencies and database calls.
   - **E2E Testing:** Place E2E tests in `test/` directory with `.e2e-spec.ts` suffix. Use actual database instances or test database containers for E2E tests.

5. **Coverage Floor Met:** The test coverage for updated code paths across all modified workspaces must remain at or above a strict **70% minimum requirement**.
6. **Workspace Dependency Integrity:** No loose, un-hoisted dependencies may exist in package subdirectories that clash with root version alignment. All local intra-repo tracking must use automatic workspace symlinking.
7. **Version Automation:** Use `changesets` where applicable if updates to a workspace require formal semantic version tracking or independent package publication pipelines.
