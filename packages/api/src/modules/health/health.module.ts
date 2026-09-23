import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from '@/modules/health/health.controller.js';
import { VersionHealthIndicator } from '@/modules/health/indicators/version.health.js';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [VersionHealthIndicator],
})
export class HealthModule {}
