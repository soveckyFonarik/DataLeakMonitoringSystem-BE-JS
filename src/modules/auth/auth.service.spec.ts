import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let httpService: HttpService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            userPass: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = { id: 1, uniqueLogin: 'user1', passwordHash };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await authService.validateUser('user1', password);
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await authService.validateUser('user1', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const password = 'pass1';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id: 1,
        uniqueLogin: 'user1',
        passwordHash: passwordHash,
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await authService.validateUser('user1', 'wrongpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 1, uniqueLogin: 'user1' };
      const token = await authService.login(user);
      expect(token).toEqual({ access_token: 'token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.uniqueLogin,
        sub: user.id,
      });
    });
  });
});
