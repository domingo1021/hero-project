import { Test, TestingModule } from '@nestjs/testing';

import { CacheService } from '#cache/cache.service';
import { ExternalHttpService } from '#http/http.service';
import { AuthService } from '#auth/auth.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let cacheService: CacheService;
  let httpApi: ExternalHttpService;

  let spyCacheGet: jest.SpyInstance;
  let spyCacheSet: jest.SpyInstance;
  let spyHttpApiAuthenticate: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CacheService,
          useValue: {
            get: spyCacheGet,
            set: spyCacheSet,
          },
        },
        {
          provide: ExternalHttpService,
          useValue: {
            authenticate: spyHttpApiAuthenticate,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    cacheService = module.get<CacheService>(CacheService);
    httpApi = module.get<ExternalHttpService>(ExternalHttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    it('should return isAuthenticated as true if the username and password are valid and found in cache', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const cachedHashPass = 'hashedpassword';
      spyCacheGet.mockResolvedValueOnce(cachedHashPass);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser(username, password);

      expect(result).toEqual({ isAuthenticated: true });
      expect(cacheService.get).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, cachedHashPass);
      expect(httpApi.authenticate).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });

    it('should return isAuthenticated as true if the username and password are valid and not found in cache', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';
      spyCacheGet.mockResolvedValueOnce(null);
      spyHttpApiAuthenticate.mockResolvedValueOnce(true);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      spyCacheSet.mockResolvedValueOnce(undefined);

      const result = await service.validateUser(username, password);

      expect(result).toEqual({ isAuthenticated: true });
      expect(cacheService.get).toHaveBeenCalledWith(username);
      expect(spyHttpApiAuthenticate).toHaveBeenCalledWith(username, password);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(spyCacheSet).toHaveBeenCalledWith(username, hashedPassword);
    });

    it('should return isAuthenticated as false if the username and password are invalid', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      spyCacheGet.mockResolvedValueOnce(null);
      spyHttpApiAuthenticate.mockResolvedValueOnce(false);

      const result = await service.validateUser(username, password);

      expect(result).toEqual({ isAuthenticated: false });
      expect(spyCacheGet).toHaveBeenCalledWith(username);
      expect(spyHttpApiAuthenticate).toHaveBeenCalledWith(username, password);
      expect(spyCacheSet).not.toHaveBeenCalled();
    });
  });
});
