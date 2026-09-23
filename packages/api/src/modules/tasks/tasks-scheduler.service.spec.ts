/* eslint-disable @typescript-eslint/unbound-method */
import type { Mocked } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { TasksSchedulerService } from '@/modules/tasks/tasks-scheduler.service.js';
import { TasksService } from '@/modules/tasks/tasks.service.js';

// Mock the CronJob constructor
const mockCronJob = {
  start: vi.fn(),
};
vi.mock('cron', () => ({
  CronJob: vi.fn(function (_schedule: string, _callback: () => void) {
    return mockCronJob;
  }),
}));

describe('TasksSchedulerService', () => {
  let service: TasksSchedulerService;
  let tasksService: Mocked<TasksService>;
  let configService: Mocked<ConfigService>;
  let schedulerRegistry: Mocked<SchedulerRegistry>;
  let loggerLogSpy: Mocked<Logger>['log'];
  let loggerErrorSpy: Mocked<Logger>['error'];

  beforeEach(async () => {
    const mockTasksService = {
      removeAll: vi.fn(),
    };

    const mockConfigService = {
      get: vi.fn(),
    };

    const mockSchedulerRegistry = {
      addCronJob: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksSchedulerService,
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
      ],
    }).compile();

    service = module.get<TasksSchedulerService>(TasksSchedulerService);
    tasksService = module.get(TasksService);
    configService = module.get(ConfigService);
    schedulerRegistry = module.get(SchedulerRegistry);

    // Mock the logger to avoid console output during tests
    loggerLogSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    loggerErrorSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockCronJob.start.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize cron job with configuration schedule', () => {
      // Arrange
      const cronSchedule = '0 */5 * * * *';
      configService.get.mockReturnValue(cronSchedule);

      // Act
      service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('SCHEDULE_TASK_CLEANUP_CRON');
      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith('cleanup-tasks', expect.any(Object));
      expect(mockCronJob.start).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith(`Initializing task cleanup cron job with schedule: ${cronSchedule}`);
      expect(loggerLogSpy).toHaveBeenCalledWith('Task cleanup cron job initialized and started');
    });

    it('should handle missing cron schedule configuration', () => {
      // Arrange
      configService.get.mockReturnValue(undefined);

      // Act
      service.onModuleInit();

      // Assert
      expect(configService.get).toHaveBeenCalledWith('SCHEDULE_TASK_CLEANUP_CRON');
      expect(loggerLogSpy).toHaveBeenCalledWith(
        'SCHEDULE_TASK_CLEANUP_CRON not configured - task cleanup job will not be scheduled',
      );
      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });
  });

  describe('handleTaskCleanup', () => {
    it('should successfully remove all tasks and log the result', async () => {
      // Arrange
      const expectedDeletedCount = 5;
      tasksService.removeAll.mockResolvedValue(expectedDeletedCount);

      // Act
      await service.handleTaskCleanup();

      // Assert
      expect(tasksService.removeAll).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith('> handleTaskCleanup - Starting scheduled task cleanup');
      expect(loggerLogSpy).toHaveBeenCalledWith(
        `handleTaskCleanup - Successfully removed ${expectedDeletedCount} tasks`,
      );
      expect(loggerLogSpy).toHaveBeenCalledWith('< handleTaskCleanup - Completed scheduled task cleanup');
    });

    it('should handle errors gracefully and log them', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      tasksService.removeAll.mockRejectedValue(error);

      // Act
      await service.handleTaskCleanup();

      // Assert
      expect(tasksService.removeAll).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith('> handleTaskCleanup - Starting scheduled task cleanup');
      expect(loggerErrorSpy).toHaveBeenCalledWith('handleTaskCleanup - Error occurred during task cleanup', error);
      expect(loggerLogSpy).toHaveBeenCalledWith('< handleTaskCleanup - Completed scheduled task cleanup');
    });

    it('should remove zero tasks when database is empty', async () => {
      // Arrange
      const expectedDeletedCount = 0;
      tasksService.removeAll.mockResolvedValue(expectedDeletedCount);

      // Act
      await service.handleTaskCleanup();

      // Assert
      expect(tasksService.removeAll).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith(
        `handleTaskCleanup - Successfully removed ${expectedDeletedCount} tasks`,
      );
    });
  });
});
