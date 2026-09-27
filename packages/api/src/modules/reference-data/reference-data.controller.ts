import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TaskPriority } from '@/modules/reference-data/entities/task-priority.entity.js';
import { GetTaskPriorityParamsDto } from '@/modules/reference-data/dto/get-task-priority-params.dto.js';
import { TaskPriorityService } from '@/modules/reference-data/task-priority.service.js';

@ApiTags('Reference Data')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'refdata', version: '1' })
export class ReferenceDataController {
  private readonly logger = new Logger(ReferenceDataController.name);

  constructor(private readonly taskPriorityService: TaskPriorityService) {}

  @Get('taskpriorities')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all task priority levels' })
  @ApiOkResponse({ description: 'List of all task priority levels', type: [TaskPriority] })
  async getTaskPriorities(): Promise<TaskPriority[]> {
    this.logger.log('> getTaskPriorities');
    const taskPriorities = await this.taskPriorityService.findAll();
    this.logger.log('< getTaskPriorities');
    return taskPriorities;
  }

  @Get('taskpriorities/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch a specific task priority level by its code' })
  @ApiOkResponse({ description: 'The task priority level with the specified code', type: TaskPriority })
  @ApiNotFoundResponse({ description: 'Task priority level not found' })
  async getTaskPriority(
    @Param(new ValidationPipe({ transform: true })) params: GetTaskPriorityParamsDto,
  ): Promise<TaskPriority> {
    this.logger.log(`> getTaskPriority: ${params.code}`);
    const taskPriority = await this.taskPriorityService.findOne(params.code);
    this.logger.log(`< getTaskPriority: ${params.code}`);
    return taskPriority;
  }
}
