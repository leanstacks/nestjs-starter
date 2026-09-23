import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { StringValue } from 'ms';

import { UsersModule } from '@/modules/users/users.module.js';
import { AuthController } from '@/modules/auth/auth.controller.js';
import { AuthService } from '@/modules/auth/auth.service.js';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy.js';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy.js';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard.js';

/**
 * Authentication module that provides JWT-based authentication functionality.
 */
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  /** Providing APP_GUARD applies JWT authentication globally */
  providers: [AuthService, LocalStrategy, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  exports: [AuthService],
})
export class AuthModule {}
