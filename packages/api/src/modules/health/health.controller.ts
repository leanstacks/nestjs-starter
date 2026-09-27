import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';

import { VersionHealthIndicator } from '@/modules/health/indicators/version.health.js';
import { Public } from '@/modules/auth/decorators/public.decorator.js';

@Public()
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly version: VersionHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  checkHealth() {
    return this.health.check([async () => this.db.pingCheck('database'), () => this.version.getValue('version')]);
  }
}
