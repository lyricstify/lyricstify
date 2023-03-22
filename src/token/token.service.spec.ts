import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { Observable, of } from 'rxjs';
import { createFakeAxiosResponse } from '../../test/utils/common/create-fake-axios-response.js';
import { createRandomRefreshTokenEntity } from '../../test/utils/refresh-token/create-random-refresh-token-entity.js';
import { createRandomTokenResponse } from '../../test/utils/token/create-random-token-response.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { RefreshTokenService } from '../refresh-token/refresh-token.service.js';
import { TokenEntity } from './entities/token.entity.js';
import { TokenService } from './token.service.js';
import { createRandomTokenEntity } from '../../test/utils/token/create-random-token.entity.js';
import { ConfigService } from '../config/config.service.js';

describe('TokenService', () => {
  let tokenService: TokenService;
  let tokenRepository: DataSourceRepository<TokenEntity>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: ConfigService,
          useValue: {
            retryDelay: 0,
            retryCount: 0,
            timeout: 0,
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === DataSourceRepository) {
          return { replace: jest.fn(), find: jest.fn() };
        }

        if (token === HttpService) {
          return { post: jest.fn() };
        }

        if (token === RefreshTokenService) {
          return { findOneOrCreateFromExistingClient: jest.fn() };
        }

        return {};
      })
      .compile();

    tokenService = module.get(TokenService);
    tokenRepository = module.get(DataSourceRepository);
    httpService = module.get(HttpService);
  });

  describe('replaceFrom', () => {
    it('should be able to replace token created from refresh token entity and return new token entity', async () => {
      const refreshTokenEntity = createRandomRefreshTokenEntity({});
      const tokenResponse = createRandomTokenResponse({});

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(createFakeAxiosResponse({ data: tokenResponse })));
      jest
        .spyOn(tokenRepository, 'replace')
        .mockImplementation((data) => Promise.resolve(data));

      expect(await tokenService.replaceFrom(refreshTokenEntity)).toMatchObject(
        expect.objectContaining({
          value: tokenResponse.access_token,
          type: tokenResponse.token_type,
          scope: tokenResponse.scope,
        }),
      );
    });

    it('should be able to handle and provide an error status if an error from axios is thrown', async () => {
      const refreshTokenEntity = createRandomRefreshTokenEntity({});
      const errorMessage = faker.lorem.sentences();

      jest.spyOn(httpService, 'post').mockReturnValue(
        new Observable((subscriber) => {
          subscriber.error(new AxiosError(errorMessage));
        }),
      );

      await expect(
        tokenService.replaceFrom(refreshTokenEntity),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should be able to find token and return token entity if available', async () => {
      const tokenEntity = createRandomTokenEntity({});

      jest.spyOn(tokenRepository, 'find').mockResolvedValue(tokenEntity);

      expect(await tokenService.findOne()).toEqual(tokenEntity);
    });
  });

  describe('findOneOrFail', () => {
    it('should be able to throw an error if token not found', async () => {
      jest.spyOn(tokenRepository, 'find').mockResolvedValue(null);

      await expect(tokenService.findOneOrFail()).rejects.toThrowError();
    });
  });

  describe('findOneOrCreateFromExistingRefreshToken', () => {
    it('should be able to return the token entity if the token is available and not expired', async () => {
      const tokenEntity = createRandomTokenEntity({
        createdAt: new Date().getTime(),
        expiresInSeconds: 3600,
      });

      jest.spyOn(tokenRepository, 'find').mockResolvedValue(tokenEntity);

      expect(
        await tokenService.findOneOrCreateFromExistingRefreshToken(),
      ).toEqual(tokenEntity);
    });

    it('should be able to fetch a new token from the existing refresh token if the token already expired or is not available', async () => {
      const now = new Date();

      const expiredTokenEntity = createRandomTokenEntity({
        createdAt: new Date().setHours(now.getHours() - 2),
        expiresInSeconds: 3600,
      });
      const newTokenEntity = createRandomTokenEntity({
        createdAt: now.getTime(),
        expiresInSeconds: 3600,
      });

      jest.spyOn(tokenRepository, 'find').mockResolvedValue(expiredTokenEntity);
      jest.spyOn(tokenService, 'replaceFrom').mockResolvedValue(newTokenEntity);

      expect(
        await tokenService.findOneOrCreateFromExistingRefreshToken(),
      ).toEqual(newTokenEntity);
    });
  });
});
