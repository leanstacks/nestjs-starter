/**
 * Tasks Module
 *
 * This module handles all task-related functionalities, including task creation,
 * management, and scheduling. It integrates with the Reference Data Module for
 * additional data requirements.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferenceDataModule } from '@/modules/reference-data/reference-data.module.js';
import { TaskPriority } from '@/modules/reference-data/entities/task-priority.entity.js';

import { TasksController } from '@/modules/tasks/tasks.controller.js';
import { TasksService } from '@/modules/tasks/tasks.service.js';
import { TasksSchedulerService } from '@/modules/tasks/tasks-scheduler.service.js';
import { Task } from '@/modules/tasks/entities/task.entity.js';

@Module({
  imports: [
    ReferenceDataModule,
    TypeOrmModule.forFeature([Task, TaskPriority]),
    TypeOrmModule.forFeature([Task, TaskPriority], 'read-only'),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksSchedulerService],
})
export class TasksModule {}
