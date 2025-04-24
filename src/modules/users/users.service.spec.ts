import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
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

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return all users', async () => {
    const users = [
      { id: 1, uniqueLogin: 'user1', passwordHash: 'hash1' },
      { id: 2, uniqueLogin: 'user2', passwordHash: 'hash2' },
    ];
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

    const result = await usersService.findAll();
    expect(result).toEqual(users);
  });

  it('should return user by id', async () => {
    const user = { id: 1, uniqueLogin: 'user1', passwordHash: 'hash1' };
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

    const result = await usersService.findOne(1);
    expect(result).toEqual(user);
  });
  describe('checkPasswordLeak', () => {
    it('should return true if password leaked', async () => {
      // SHA1 prefix for 'password' is 5BAA6
      const leakedSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse: AxiosResponse<string> = {
        data: `${leakedSuffix}:10\nOTHERHASH:5`,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await usersService.checkPasswordLeak('password');
      expect(result).toBe(true);
    });

    it('should return false if password not leaked', async () => {
      const mockResponse: AxiosResponse<string> = {
        data: `ABCDEF1234567890:1\n1234567890ABCDEF:2`,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await usersService.checkPasswordLeak('uniquepassword123');
      expect(result).toBe(false);
    });
  });
});
