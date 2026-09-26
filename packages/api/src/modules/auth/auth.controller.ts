import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@/modules/users/entities/user.entity.js';
import { AuthService } from '@/modules/auth/auth.service.js';
import { RegisterDto } from '@/modules/auth/dto/register.dto.js';
import { SignInDto } from '@/modules/auth/dto/sign-in.dto.js';
import { SignInResultDto } from '@/modules/auth/dto/sign-in-result.dto.js';
import { Public } from '@/modules/auth/decorators/public.decorator.js';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard.js';

/**
 * Controller for authentication endpoints.
 */
@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Sign in a user with username and password.
   * @param signInDto The sign in data transfer object.
   * @returns The JWT access token.
   */
  @ApiOperation({
    summary: 'Sign in user',
    description: 'Authenticate user with username and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: SignInResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body(new ValidationPipe({ transform: true })) signInDto: SignInDto): Promise<SignInResultDto> {
    try {
      return await this.authService.signIn(signInDto);
    } catch {
      // Return generic error message for security
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Register a new user account.
   * @param registerDto The registration data transfer object.
   * @returns The created user entity.
   */
  @ApiOperation({
    summary: 'Register user',
    description: 'Create a new user account',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered',
    type: User,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body(new ValidationPipe({ transform: true })) registerDto: RegisterDto): Promise<User> {
    this.logger.log(`> register: ${registerDto.username}`);
    this.logger.log(`< register: ${registerDto.username}`);
    return await this.authService.register(registerDto);
  }
}
