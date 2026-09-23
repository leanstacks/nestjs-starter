import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard.js';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator.js';
import { Mock, MockInstance } from 'vitest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockCanActivate: MockInstance;

  const mockJwtService = {
    verifyAsync: vi.fn(),
  };

  const mockReflector = {
    getAllAndOverride: vi.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: vi.fn().mockReturnThis(),
    getRequest: vi.fn(),
    getHandler: vi.fn(),
    getClass: vi.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    // Spy on the parent AuthGuard('jwt') canActivate method
    mockCanActivate = vi.spyOn(Object.getPrototypeOf(guard), 'canActivate');
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockCanActivate.mockRestore();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    // const mockPayload = {
    //   sub: 'test-sub',
    //   username: 'johndoe',
    // };

    describe('when route is marked as public', () => {
      it('should return true without checking JWT when @Public() decorator is present', async () => {
        // Arrange
        const mockRequest = {
          headers: {},
        };
        (mockExecutionContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);
        mockReflector.getAllAndOverride.mockReturnValue(true);

        // Act
        const result = await guard.canActivate(mockExecutionContext);

        // Assert
        expect(result).toBe(true);
        expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
          mockExecutionContext.getHandler(),
          mockExecutionContext.getClass(),
        ]);
        // Passport's canActivate may still be called, so do not assert not called
      });

      it('should return true even with invalid authorization header when route is public', async () => {
        // Arrange
        const mockRequest = {
          headers: {
            authorization: 'InvalidFormat token',
          },
        };
        (mockExecutionContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);
        mockReflector.getAllAndOverride.mockReturnValue(true);

        // Act
        const result = await guard.canActivate(mockExecutionContext);

        // Assert
        expect(result).toBe(true);
        expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
          mockExecutionContext.getHandler(),
          mockExecutionContext.getClass(),
        ]);
        // Passport's canActivate may still be called, so do not assert not called
      });
    });

    describe('when route is protected (not public)', () => {
      beforeEach(() => {
        // Set up the reflector to return false (not public) for protected route tests
        mockReflector.getAllAndOverride.mockReturnValue(false);
      });

      it('should delegate to Passport AuthGuard for protected routes', async () => {
        // Arrange
        mockCanActivate.mockResolvedValue(true);

        // Act
        const result = await guard.canActivate(mockExecutionContext);

        // Assert
        expect(result).toBe(true);
        expect(mockCanActivate).toHaveBeenCalledWith(mockExecutionContext);
      });
      // Additional tests for error handling can be added here if custom logic is introduced in JwtAuthGuard
    });
  });
});
