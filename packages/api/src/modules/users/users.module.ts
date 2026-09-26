import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from '@/modules/users/users.service.js';
import { UsersController } from '@/modules/users/users.controller.js';
import { User } from '@/modules/users/entities/user.entity.js';

/**
 * Users module for managing user-related functionality.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([User], 'read-only')],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
