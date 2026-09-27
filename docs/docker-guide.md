# Docker Guide

This guide provides comprehensive instructions for building, running, and managing Docker containers for the NestJS Starter application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Monorepo Build Context](#monorepo-build-context)
- [Building the Docker Image](#building-the-docker-image)
- [Running the Container](#running-the-container)
- [Environment Variables](#environment-variables)
- [Container Management](#container-management)
- [Cleanup](#cleanup)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have Docker installed on your system:

- **Docker Desktop** (recommended for Windows and macOS)
- **Docker Engine** (for Linux)

Verify your installation:

```bash
docker --version
docker-compose --version
```

## Monorepo Build Context

This project is an npm workspaces monorepo (see the [Monorepo Guide](./monorepo-guide.md)), and the root `Dockerfile` is a multi-stage build designed to package a single workspace package into a runtime image.

- **Build context is the repository root.** Always run `docker build` from the project root, not from within `packages/api`, since the Dockerfile copies the whole workspace (`COPY . .`) and runs `npm ci`/`npm run build` across all packages before selecting one for the runtime stage.
- **`WORKSPACE_DIR` build argument** selects which package's build output is copied into the final runtime image. It defaults to `packages/api` and is used to compute the package's `package.json` path (`$WORKSPACE_DIR/package.json`), compiled output (`$WORKSPACE_DIR/dist`), and the container's start command (`node $WORKSPACE_DIR/dist/main`).

## Building the Docker Image

The application uses a multi-stage Dockerfile for optimized production builds.

### Basic Build

Build the Docker image with a tag (run from the repository root):

```bash
docker build -t nestjs-starter .
```

### Build with a Custom WORKSPACE_DIR

Override the `WORKSPACE_DIR` build argument to package a different workspace (defaults to `packages/api`):

```bash
docker build --build-arg WORKSPACE_DIR=packages/api -t nestjs-starter .
```

### Build with Custom Tag

```bash
docker build -t nestjs-starter:latest .
docker build -t nestjs-starter:v1.0.0 .
```

### Build with No Cache

Force a fresh build without using cached layers:

```bash
docker build --no-cache -t nestjs-starter .
```

### Build for Specific Platform

Build for a specific platform (useful for cross-platform deployment):

```bash
# For ARM64 (Apple Silicon, ARM servers)
docker build --platform linux/arm64 -t nestjs-starter:arm64 .

# For AMD64 (Intel/AMD x86_64)
docker build --platform linux/amd64 -t nestjs-starter:amd64 .
```

## Running the Container

### Basic Run

Start the container, map port 3000, and set `APP_PORT` so the application listens on the exposed port (see [Configuration Guide](./configuration-guide.md); the application defaults to port 3001 if `APP_PORT` is not set):

```bash
docker run -p 3000:3000 -e APP_PORT=3000 nestjs-starter
```

### Run in Detached Mode

Run the container in the background:

```bash
docker run -d -p 3000:3000 -e APP_PORT=3000 --name nestjs-app nestjs-starter
```

### Run with Custom Port Mapping

Map to a different host port:

```bash
docker run -d -p 8080:3000 -e APP_PORT=3000 --name nestjs-app nestjs-starter
```

Access the application at `http://localhost:8080`

### Run with Restart Policy

Automatically restart the container if it stops:

```bash
docker run -d -p 3000:3000 --name nestjs-app --restart unless-stopped nestjs-starter
```

## Environment Variables

### Passing Environment Variables

#### Single Environment Variable

```bash
docker run -p 3000:3000 -e NODE_ENV=production nestjs-starter
```

#### Multiple Environment Variables

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e APP_PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=nestuser \
  -e DB_PASS=nestpassword \
  -e DB_DATABASE=nestdb \
  nestjs-starter
```

#### Using Environment File

Create a `.env` file (see [Configuration Guide](./configuration-guide.md) for the full list of supported variables):

```env
NODE_ENV=production
APP_PORT=3000
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USER=nestuser
DB_PASS=nestpassword
DB_DATABASE=nestdb
LOGGING_LEVEL=info
```

Run with environment file:

```bash
docker run -p 3000:3000 --env-file .env nestjs-starter
```

#### Environment Variables in Detached Mode

```bash
docker run -d -p 3000:3000 \
  --name nestjs-app \
  --env-file .env \
  --restart unless-stopped \
  nestjs-starter
```

### Common Environment Variables

For a complete list of supported environment variables and their descriptions, see the [Configuration Guide](./configuration-guide.md).

The following are commonly used environment variables when running the application in Docker. The container's `EXPOSE 3000` only documents the intended port; the application itself listens on the port from `APP_PORT`, so set it explicitly to match your port mapping.

| Variable        | Description                                | Default      | Example                          |
| --------------- | ------------------------------------------ | ------------ | -------------------------------- |
| `NODE_ENV`      | Node.js environment                        | `production` | `production`, `development`      |
| `APP_PORT`      | Application port (see Configuration Guide) | `3001`       | `3000`, `8080`                   |
| `LOGGING_LEVEL` | Logging level (see Configuration Guide)    | `log`        | `debug`, `info`, `warn`, `error` |
| `DB_HOST`       | PostgreSQL database host                   | `localhost`  | `host.docker.internal`, `db`     |

## Container Management

### List Running Containers

```bash
docker ps
```

### List All Containers (including stopped)

```bash
docker ps -a
```

### View Container Logs

```bash
# View logs
docker logs nestjs-app

# Follow logs in real-time
docker logs -f nestjs-app

# View last 100 lines
docker logs --tail 100 nestjs-app
```

### Execute Commands in Running Container

```bash
# Open interactive shell
docker exec -it nestjs-app sh

# Run a single command
docker exec nestjs-app node --version
```

### Stop Container

```bash
docker stop nestjs-app
```

### Start Stopped Container

```bash
docker start nestjs-app
```

### Restart Container

```bash
docker restart nestjs-app
```

### Remove Container

```bash
# Stop and remove
docker stop nestjs-app
docker rm nestjs-app

# Force remove (stops and removes)
docker rm -f nestjs-app
```

## Cleanup

### Remove Unused Resources

#### Remove Stopped Containers

```bash
docker container prune
```

#### Remove Unused Images

```bash
docker image prune
```

#### Remove All Unused Resources

```bash
docker system prune
```

#### Remove Everything (including volumes)

```bash
docker system prune -a --volumes
```

### Remove Specific Resources

#### Remove Specific Image

```bash
docker rmi nestjs-starter
docker rmi nestjs-starter:v1.0.0
```

#### Remove Multiple Images

```bash
docker rmi $(docker images nestjs-starter -q)
```

## Development Workflow

### Local Development vs. Docker

The runtime stage of the Dockerfile only contains the compiled `$WORKSPACE_DIR/dist` output and production dependencies — there is no NestJS CLI, TypeScript compiler, or watch process in the image, so mounting source files into a running container will not enable live-reload. For day-to-day development, run the application directly on your host instead:

```bash
npm run start:dev -w packages/api
```

Use the Docker image to validate production-like builds, or with [Docker Compose](./docker-compose-guide.md) to run the local PostgreSQL and pgAdmin services alongside it.

### Docker Compose for Development

The project's root `docker-compose.yml` runs PostgreSQL and pgAdmin only (see the [Docker Compose Guide](./docker-compose-guide.md)). The following illustrates adding the application itself to a compose file, passing the `WORKSPACE_DIR` build argument and the application's environment variables (see [Configuration Guide](./configuration-guide.md)):

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      args:
        WORKSPACE_DIR: packages/api
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - APP_PORT=3000
      - DB_HOST=db
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      - POSTGRES_DB=nestdb
      - POSTGRES_USER=nestuser
      - POSTGRES_PASSWORD=nestpassword
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with Docker Compose:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Quick Development Commands

```bash
# Build and run in one command
docker build -t nestjs-starter . && docker run -p 3000:3000 -e APP_PORT=3000 nestjs-starter

# Rebuild and restart
docker stop nestjs-app || true
docker rm nestjs-app || true
docker build -t nestjs-starter .
docker run -d -p 3000:3000 -e APP_PORT=3000 --name nestjs-app nestjs-starter
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 nestjs-starter
```

#### Container Exits Immediately

Check logs for errors:

```bash
docker logs nestjs-app
```

Run with interactive mode to debug:

```bash
docker run -it nestjs-starter sh
```

#### Image Build Fails

Build with verbose output:

```bash
docker build --progress=plain -t nestjs-starter .
```

#### Container Cannot Connect to External Services

Check network configuration:

```bash
# Inspect container network
docker inspect nestjs-app

# Use host network (Linux only)
docker run --network host nestjs-starter
```

### Debugging Commands

```bash
# Inspect image
docker inspect nestjs-starter

# Check image history
docker history nestjs-starter

# Check container stats
docker stats nestjs-app

# Export container filesystem
docker export nestjs-app > container.tar
```

### Health Checks

Add health check to Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/v1/health || exit 1
```

Check health status:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Best Practices

1. **Use .dockerignore**: Keep build context small
2. **Multi-stage builds**: Separate build and runtime dependencies
3. **Non-root user**: Run containers with non-root user for security
4. **Environment variables**: Use for configuration, never hardcode secrets
5. **Health checks**: Implement health check endpoints
6. **Resource limits**: Set memory and CPU limits in production
7. **Logging**: Use structured logging and external log aggregation
8. **Security scanning**: Regularly scan images for vulnerabilities

```bash
# Example with resource limits
docker run -d -p 3000:3000 \
  --name nestjs-app \
  --memory="512m" \
  --cpus="1.0" \
  --restart unless-stopped \
  nestjs-starter
```

## Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Container Security Best Practices](https://docs.docker.com/engine/security/)
