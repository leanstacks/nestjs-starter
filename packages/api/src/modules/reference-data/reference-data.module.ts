import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferenceDataController } from '@/modules/reference-data/reference-data.controller.js';
import { TaskPriorityService } from '@/modules/reference-data/task-priority.service.js';
import { TaskPriority } from '@/modules/reference-data/entities/task-priority.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([TaskPriority])],
  controllers: [ReferenceDataController],
  providers: [TaskPriorityService],
  exports: [TaskPriorityService], // Export service so other modules can use it
})
export class ReferenceDataModule {}
