/**
 * TypeORM Migration Configuration
 * ------------------------------
 * This file sets up the TypeORM DataSource for running migrations only.
 *
 * - Not used by the NestJS application runtime.
 * - Used by TypeORM CLI and scripts for database migrations.
 * - Loads environment variables using dotenv and @nestjs/config.
 * - Uses ConfigService to read DB connection settings (host, port, user, password, database).
 * - Configures entities and migrations paths for TypeORM.
 * - Synchronize is disabled for safety in production.
 * - Logging is enabled for debugging queries and migrations.
 *
 * Usage:
 *   - Update your .env file with DB_* variables as needed.
 *   - Entities should be placed in src/modules/[feature]/entities/.
 *   - Migrations should be placed in src/migrations/.
 *   - This config is imported by TypeORM CLI for migration commands.
 *   - See package.json scripts for migration commands.
 */
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { migrations } from '@/migrations/index.js';

// Load environment variables
config();

const configService = new ConfigService();

// Replicate __dirname safely in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USER', 'nestuser'),
  password: configService.get('DB_PASS', 'nestpassword'),
  database: configService.get('DB_DATABASE', 'nestdb'),
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: migrations,
  synchronize: false,
  logging: true,
});
