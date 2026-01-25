# NestJS Starter

[![Continuous Integration](https://github.com/mwarman/nestjs-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/mwarman/nestjs-playground/actions/workflows/ci.yml)
&nbsp;
&nbsp;
[![Code Quality](https://github.com/mwarman/nestjs-playground/actions/workflows/code-quality.yml/badge.svg)](https://github.com/mwarman/nestjs-playground/actions/workflows/code-quality.yml)

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

- **Unit Tests** - Comprehensive test coverage using Jest
- **End-to-End Tests** - Integration tests for API endpoints
- **Pre-commit Hooks** - Husky for automated linting and formatting
- **ESLint** - Code quality enforcement with NestJS-specific rules
- **Prettier** - Consistent code formatting
- **Coverage Reports** - Test coverage tracking and reporting

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

- Copy `.env.example` to `.env` and adjust values as needed.
- See the [Configuration Guide](docs/configuration-guide.md) for details.

3. **Run the application:**

```bash
npm run start
```

## Available Scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| npm run build        | Compile the TypeScript source code           |
| npm run clean        | Remove build output and temporary files      |
| npm run lint         | Run ESLint to check code quality             |
| npm run lint:fix     | Fix code quality issues with ESLint          |
| npm run format       | Format code using Prettier                   |
| npm run format:check | Check code formatting without changing files |
| npm run start        | Start the application (development)          |
| npm run start:dev    | Start in watch mode                          |
| npm run start:prod   | Start in production mode                     |
| npm run test         | Run unit tests                               |
| npm run test:e2e     | Run end-to-end tests                         |
| npm run test:cov     | Run test coverage                            |

## Project Structure

```
├── .github/                             # GitHub workflows and configuration
|
├── docs/                                # Project documentation
|  ├── configuration-guide.md            # Configuration guide
|  └── devops-guide.md                   # DevOps guide
|
├── infrastructure/                      # AWS CDK Infrastructure as Code
│   ├── stacks/                          # AWS CDK stacks
|   └── app.ts                           # AWS CDK application
|
├── src/                                 # Main application source code
│   ├── app.module.ts                    # App module
│   ├── main.ts                          # Application entry point
│   ├── modules/
│   │   └── tasks/                       # Example feature module
│   │       ├── tasks.module.ts          # Tasks module definition
│   │       ├── tasks.controller.ts      # Tasks controller
│   │       ├── tasks.controller.spec.ts # Tasks controller unit tests
│   │       ├── tasks.service.ts         # Tasks service
│   │       ├── tasks.service.spec.ts    # Tasks service unit tests
│   │       ├── dto/                     # DTOs for tasks
│   │       └── entities/                # Entities for tasks
│   └── config/                          # Configuration-related code
│       └── configuration.ts             # Configuration loader
├── test/                                # End-to-end tests
│   ├── tasks.e2e-spec.ts                # E2E test spec
│   └── jest-e2e.json                    # Jest E2E config
|
├── .env.example                         # Example environment variables
├── package.json                         # Project metadata and scripts
├── tsconfig.json                        # TypeScript configuration
├── nest-cli.json                        # NestJS CLI configuration
└── README.md                            # Project documentation
```

## Documentation Hub

For all guides and references—including configuration, Docker, DevOps, and API documentation—see the [Documentation Table of Contents](docs/README.md).

## Additional Information

For more information, see the [NestJS Documentation](https://docs.nestjs.com/).

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
