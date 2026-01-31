# Copilot Instructions – NestJS TypeScript Component

## Project Overview

This project is a **NestJS application** built with **TypeScript**. It follows a modular architecture for scalability and maintainability, leveraging NestJS decorators and dependency injection. The project will expose RESTful APIs, handle data persistence with an ORM, and follow best practices for configuration, validation, and testing.

The goal is to provide a clean, type-safe, and extensible foundation for backend development.

---

## Role

You are a **Senior TypeScript developer** working on a NestJS project. Your goal is to create efficient, maintainable, and testable applications using NestJS best practices.

---

## Technology Stack

- **Language**: TypeScript
- **Framework**: NestJS
- **Package Manager**: npm
- **HTTP Layer**: Express
- **ORM/Database**: TypeORM
- **Validation**: class-validator, class-transformer
- **Configuration Management**: @nestjs/config
- **Testing Framework**: Jest
- **Linting & Formatting**: ESLint, Prettier
- **Containerization**: Docker
- **Infrastructure as Code**: AWS CDK
- **CI/CD**: GitHub Actions

---

## Project Structure

```
project-root/
├── docs/                                   # Project documentation
│
├── src/
│   ├── app.module.ts                       # Root application module
│   ├── main.ts                             # Application entry point
│   │
│   ├── modules/                            # Feature modules
│   │   ├── core/
│   │   ├── users/
│   │   │   ├── users.module.ts             # Users module definition
│   │   │   ├── users.controller.ts         # Controller layer for handling HTTP requests
│   │   │   ├── users.controller.spec.ts    # Unit tests for UsersController
│   │   │   ├── users.service.ts            # Service layer for user-related business logic
│   │   │   ├── users.service.spec.ts       # Unit tests for UsersService
│   │   │   ├── dto/                        # Data Transfer Objects
│   │   │   └── entities/                   # Database entities or schemas
│   │   │
│   │   └── auth/
│   │       ├── auth.module.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── strategies/                 # e.g., JWT, Local strategy
│   │       └── guards/                     # Custom guards
│   │
│   ├── common/                             # Shared utilities and components
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── config/                             # Configuration files
│       └── configuration.ts
│
├── infrastructure/                         # AWS CDK implementation (self-contained)
│   ├── cdk.json
│   ├── stacks/                             # CDK stacks
│   │   ├── network.stack.ts
│   │   ├── database.stack.ts
│   │   └── compute.stack.ts
│   ├── .env.example                        # Example environment variables for CDK
│   ├── app.ts                              # CDK app entry point
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
│
├── test/                                   # Integration tests
│   └── users/
│       └── users.service.spec.ts
│
├── .env.example                            # Example environment variables
├── .eslintrc.js                            # ESLint configuration
├── .nvmrc                                  # Node.js version management
├── .prettierrc                             # Prettier configuration
├── jest.config.js                          # Jest configuration
├── nest-cli.json                           # Nest CLI configuration
├── tsconfig.json                           # TypeScript configuration
├── package.json
└── README.md
```

---

## Source Code Guidelines

- Each feature should live inside its own module under `src/modules`. Avoid mixing responsibilities.
- Always use DTOs (`class-validator`) for request validation. Avoid using raw objects directly in controllers.
- Controllers should handle request/response, while business logic should reside in services.
- Controllers should use Swagger decorators for API documentation.
- Use NestJS’ DI system rather than manually instantiating classes.
- Use global exception filters or custom exceptions to ensure consistent API error responses.
- Load environment variables via `@nestjs/config` and centralize configs in `src/config`.
- Run `npm run lint` before committing.
- Follow Prettier formatting rules.
- Keep functions small and focused.
- Organize Imports:
  - Group imports by external libraries and internal modules.
  - Use absolute imports where possible (configure `tsconfig.json` accordingly).

### Source Code Commands & Scripts

- Use `npm run build` to compile the TypeScript code.
- Use `npm run start:dev` to start the application in development mode.
- Use `npm run test` to run tests.
- Use `npm run lint` to lint the codebase.
- Use `npm run format` to format the codebase with Prettier.
- Use `npm run migration:generate` to create a new database migration.
- Use `npm run migration:run` to apply pending migrations to the database.

---

## Infrastructure as Code Guidelines

- Define one CDK stack per major grouping of resources (e.g., network stack, database stack, compute stack, messaging stack).
- Ensure that stateful resources (like databases) are in separate stacks from stateless resources (like containers).
- Use **.env** for environment variables prefixed with `CDK_`, but avoid committing this file
- Use **.env.example** to document required environment variables.
- Tag all CDK resources appropriately (`App`, `Env`, `OU`, `Owner`).
- Deploy separate environments (dev/qat/stg/prd) using configuration values.

### Infrastructure as Code Commands & Scripts

- Use `npm run build` to compile the CDK TypeScript code.
- Use `npm run synth` to synthesize the CDK app.
- Use `npm run test` to run CDK unit tests.

---

## Unit Test Guidelines

- The framework used for testing is Jest.
- Test files should be named with a `.spec.ts` suffix and are located either alongside the source files.
- Structure all tests using the **Arrange-Act-Assert** pattern with comments:
  - **Arrange:** Set up the test environment, including any necessary mocks and test data.
  - **Act:** Execute the function or service being tested.
  - **Assert:** Verify that the results are as expected.
  - Add comments to separate these sections for clarity.
- Do not assert logging; focus on functional behavior and outputs.

### Mocks & Spies

- Use `jest.fn()` or `@nestjs/testing` utilities to mock dependencies.
- Do not hit external services or databases in unit tests — mock them.

### Coverage

- Maintain at least **80% coverage** across statements, branches, and functions.

### Unit Test Commands & Scripts

- Use `npm run test` to run all tests.
- Use `npm run test <component>` to run tests for a specific component or source directory, e.g., `npm run test users`.
- Use `npm run test:coverage` to generate a coverage report.
