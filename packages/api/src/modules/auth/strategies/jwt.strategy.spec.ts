import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy.js';
import { JwtPayloadDto } from '@/modules/auth/dto/jwt-payload.dto.js';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return payload', () => {
    // Arrange
    const payload: JwtPayloadDto = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      sub: 'user-sub',
      username: 'johndoe',
    };

    // Act
    const result = strategy.validate(payload);

    // Assert
    expect(result).toEqual(payload);
  });
});
