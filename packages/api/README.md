# NestJS Starter API

This package contains the NestJS web application for the NestJS Starter project. It provides a modular, production-ready REST API built with [NestJS](https://nestjs.com/) and TypeScript.

This is one package within an npm workspaces monorepo. See the root [README.md](../../README.md) and the [Monorepo Guide](../../docs/monorepo-guide.md) for details on the overall workspace structure.

## Overview

- **Feature Modules**: `auth`, `users`, `tasks`, `reference-data`, `health`, and `core` under `src/modules/`
- **Database**: PostgreSQL via TypeORM, with version-controlled migrations in `src/migrations/`
- **Authentication**: JWT-based authentication with a global auth guard (opt-out via `@Public()`)
- **API Documentation**: Swagger UI available at `/apidoc` when the application is running
- **API Versioning**: URI-based versioning (e.g., `/v1/...`)

For details on configuration, security, API documentation, and Docker usage, see the [Documentation Table of Contents](../../docs/README.md).

## Getting Started

1. **Install dependencies** (from the monorepo root):

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Adjust values as needed. See the [Configuration Guide](../../docs/configuration-guide.md) for details.

3. **Run the application** (from this directory, or use `-w packages/api` from the root):

   ```bash
   npm run start:dev
   ```

## Available Scripts

| Script                     | Description                                       |
| -------------------------- | ------------------------------------------------- |
| npm run build              | Compile the TypeScript source code                |
| npm run clean              | Remove build output and coverage reports          |
| npm run start              | Start the application                             |
| npm run start:dev          | Start in watch mode                               |
| npm run start:debug        | Start in watch mode with the debugger attached    |
| npm run start:prod         | Start in production mode from the compiled output |
| npm run lint               | Run oxlint to check code quality                  |
| npm run lint:fix           | Fix code quality issues with oxlint               |
| npm run format             | Format source files using Prettier                |
| npm run test               | Run unit tests with Vitest                        |
| npm run test:watch         | Run unit tests in watch mode                      |
| npm run test:coverage      | Run unit tests with coverage                      |
| npm run test:debug         | Run unit tests with the debugger attached         |
| npm run test:e2e           | Run end-to-end tests with Vitest                  |
| npm run migration:generate | Generate a new TypeORM migration                  |
| npm run migration:run      | Run pending TypeORM migrations                    |
| npm run migration:revert   | Revert the most recent TypeORM migration          |
| npm run schema:drop        | Drop the database schema                          |

## Testing

Unit tests are co-located with their source files (`*.test.ts` or `*.spec.ts`) and run with [Vitest](https://vitest.dev/). End-to-end tests live in `test/` and use the `*.e2e-spec.ts` suffix.

## License

This project is licensed under the MIT License - see [LICENSE](../../LICENSE) file for details.
