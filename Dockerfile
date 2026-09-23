# Multi-stage Dockerfile for NestJS application

# Stage 1: Build stage
FROM node:24.21.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production runtime stage
FROM node:24.21.0-alpine AS runner

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set the npm package of the application within the monorepo
ARG WORKSPACE_DIR=packages/api
ENV WORKSPACE_DIR=$WORKSPACE_DIR

# Copy package.json and package-lock.json to the working directory
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/$WORKSPACE_DIR/package*.json ./$WORKSPACE_DIR/

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/$WORKSPACE_DIR/dist ./$WORKSPACE_DIR/dist

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory to the nestjs user
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
# CMD ["node", "$WORKSPACE_DIR/dist/main"]
CMD ["sh", "-c", "exec node $WORKSPACE_DIR/dist/main"]
