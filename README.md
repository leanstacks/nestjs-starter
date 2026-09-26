# NestJS Starter

[![Continuous Integration](https://github.com/leanstacks/nestjs-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/leanstacks/nestjs-starter/actions/workflows/ci.yml)
&nbsp;
&nbsp;
[![Code Quality](https://github.com/leanstacks/nestjs-starter/actions/workflows/code-quality.yml/badge.svg)](https://github.com/leanstacks/nestjs-starter/actions/workflows/code-quality.yml)

## Overview

This is a starter kit for creating new NestJS application components. It provides efficient and scalable server-side applications using the [NestJS](https://nestjs.com/) framework and TypeScript with a well-structured foundation for rapid development.

## Features

This starter project implements production-ready NestJS patterns and features. Use them as-is, extend them, or remove them based on your specific requirements.

### Core Application Features

- **Modular Architecture** - Feature-based module organization (Tasks, Users, Auth, Reference Data, Health)
- **RESTful API Endpoints** - Fully functional CRUD operations with validation
- **API Versioning** - URI-based versioning supporting multiple API versions
- **Request Validation** - Automatic validation using `class-validator` and DTOs
- **Pagination** - Built-in pagination support for list endpoints
- **Caching** - In-memory caching with configurable TTL for improved performance
- **Scheduled Tasks** - Cron-based task scheduling for background operations

### Database & Persistence

- **TypeORM Integration** - PostgreSQL database with TypeORM for entity management
- **Database Migrations** - Version-controlled schema changes and data seeding
- **Read Replicas** - Support for read-only database connections to reduce load
- **Entity Relationships** - Demonstrates foreign key relationships and data associations
- **Connection Pooling** - Optimized database connection management

### Authentication & Security

- **JWT Authentication** - Token-based authentication using JSON Web Tokens
- **Passport Integration** - Strategy-based authentication with Passport.js (JWT and Local strategies)
- **Global Auth Guard** - Default protection for all endpoints with opt-out using `@Public()` decorator
- **Password Hashing** - Secure password storage using bcrypt
- **User Management** - Complete user registration and profile management
- **Custom Decorators** - `@AuthUser()` decorator for accessing authenticated user context
- **Security Middleware** - Helmet for HTTP header security
- **CORS Configuration** - Cross-origin resource sharing with configurable origins

### Logging & Monitoring

- **Structured Logging** - Production-ready JSON logging with Pino
- **Formatted Development Logs** - Pretty-printed logs for local development
- **Configurable Log Levels** - Environment-specific logging verbosity
- **SQL Query Logging** - Optional TypeORM query logging for debugging
- **Custom TypeORM Logger** - Integration between TypeORM and Pino logging

### Health Checks & Monitoring

- **Health Check Endpoints** - Built-in health monitoring using `@nestjs/terminus`
- **Database Health Checks** - Validates database connectivity
- **Version Information** - Application version tracking and reporting
- **Custom Health Indicators** - Extensible health check framework

### API Documentation

- **Swagger/OpenAPI** - Automatic API documentation generation
- **Interactive API Explorer** - Swagger UI for testing endpoints
- **Schema Documentation** - Comprehensive DTO and entity documentation
- **Authentication in Swagger** - Bearer token support in API docs

### Configuration Management

- **Environment Variables** - Centralized configuration using `@nestjs/config`
- **Type-Safe Config** - TypeScript interfaces for configuration validation
- **Schema Validation** - Environment variable validation on startup
- **Multiple Environments** - Support for development, quality, staging, and production configurations

### DevOps & Infrastructure

- **Docker Support** - Multi-stage Dockerfile for optimized container images
- **Docker Compose** - Local development setup with PostgreSQL and pgAdmin
- **AWS CDK Infrastructure** - Complete infrastructure as code using TypeScript
  - Aurora Serverless v2 PostgreSQL database
  - ECS Fargate compute with autoscaling
  - Application Load Balancer with health checks
  - ECR for container image storage
  - Route 53 DNS and SSL certificates
  - Scheduled task infrastructure for cron jobs
- **GitHub Actions** - CI/CD pipelines for testing, building, and deployment
- **Comprehensive Documentation** - Detailed guides for configuration, infrastructure, and Docker

### Code Quality & Testing

- **Unit Tests** - Comprehensive test coverage using Vitest
- **End-to-End Tests** - Integration tests for API endpoints
- **Pre-commit Hooks** - Husky for automated linting and formatting
- **oxlint** - Fast, type-aware code quality enforcement
- **Prettier** - Consistent code formatting
- **Coverage Reports** - Test coverage tracking and reporting

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

- Copy `packages/api/.env.example` to `packages/api/.env` and adjust values as needed.
- See the [Configuration Guide](docs/configuration-guide.md) for details.

3. **Run the application:**

```bash
npm run start -w packages/api
```

## Monorepo Structure

This project is organized as an **npm workspaces monorepo** with two packages:

- `packages/api` - The NestJS web application
- `packages/infra` - The AWS CDK infrastructure as code

Common tooling (linting, formatting, base TypeScript config, base Vitest config) is centralized at the project root and extended by each package. See the [Monorepo Guide](docs/monorepo-guide.md) for details on the workspace conventions.

## Available Scripts

Run the following scripts from the project root. Most delegate to each workspace package via `--workspaces --if-present`. Target a single package with `-w packages/api` or `-w packages/infra` (e.g., `npm run start -w packages/api`).

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| npm run build         | Compile the TypeScript source code in all packages |
| npm run clean         | Remove build output and temporary files            |
| npm run lint          | Run oxlint to check code quality                   |
| npm run lint:fix      | Fix code quality issues with oxlint                |
| npm run format        | Format code using Prettier                         |
| npm run format:check  | Check code formatting without changing files       |
| npm run test          | Run unit tests in all packages                     |
| npm run test:e2e      | Run end-to-end tests (API package)                 |
| npm run test:coverage | Run test coverage in all packages                  |

Package-specific scripts, such as `start`, `start:dev`, `start:prod`, and CDK deployment commands, are defined in each package's `package.json`. See [packages/api/README.md](packages/api/README.md) and [packages/infra/README.md](packages/infra/README.md).

## Project Structure

```
├── .github/                             # GitHub workflows and configuration
|
├── docs/                                # Project documentation
|
├── packages/
│   ├── api/                             # NestJS web application
│   │   ├── src/                        # Application source code
│   │   ├── test/                       # End-to-end tests
│   │   ├── .env.example                # Example environment variables
│   │   ├── package.json                # Package metadata and scripts
│   │   ├── tsconfig.json               # Extends the root tsconfig.base.json
│   │   ├── vitest.config.ts            # Extends the root vitest.config.ts
│   │   └── README.md                   # API package documentation
│   └── infra/                           # AWS CDK Infrastructure as Code
│       ├── src/                        # CDK app and stack definitions
│       ├── .env.example                # Example environment variables
│       ├── package.json                # Package metadata and scripts
│       ├── tsconfig.json               # Extends the root tsconfig.base.json
│       ├── vitest.config.ts            # Extends the root vitest.config.ts
│       └── README.md                   # Infra package documentation
|
├── package.json                         # Root workspace configuration & scripts
├── tsconfig.base.json                   # Base TypeScript configuration
├── vitest.config.ts                     # Base Vitest configuration
└── README.md                            # Project documentation
```

## Documentation Hub

For all guides and references—including configuration, the monorepo structure, Docker, DevOps, and API documentation—see the [Documentation Table of Contents](docs/README.md).

## Additional Information

For more information, see the [NestJS Documentation](https://docs.nestjs.com/).

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
