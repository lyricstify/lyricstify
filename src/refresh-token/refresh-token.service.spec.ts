import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError } from 'axios';
import { Observable, of } from 'rxjs';
import { createRandomClientEntity } from '../../test/utils/client/create-random-client-entity.js';
import { createFakeAxiosResponse } from '../../test/utils/common/create-fake-axios-response.js';
import { createRandomRefreshTokenEntity } from '../../test/utils/refresh-token/create-random-refresh-token-entity.js';
import { createRandomRefreshTokenResponse } from '../../test/utils/refresh-token/create-random-refresh-token-response.js';
import { ClientService } from '../client/client.service.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { ConfigService } from '../config/config.service.js';
import { RefreshTokenEntity } from './entities/refresh-token.entity.js';
import { RefreshTokenService } from './refresh-token.service.js';

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let refreshTokenRepository: DataSourceRepository<RefreshTokenEntity>;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
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
          return {
            replace: jest.fn(),
            find: jest.fn(),
          };
        }

        if (token === HttpService) {
          return { post: jest.fn() };
        }

        if (token === ClientService) {
          return { findOneOrFail: jest.fn() };
        }

        return {};
      })
      .compile();

    refreshTokenService = module.get(RefreshTokenService);
    refreshTokenRepository = module.get(DataSourceRepository);
    httpService = module.get(HttpService);
  });

  describe('replaceFrom', () => {
    it('should be able to replace refresh token from client entity and return new refresh token entity', async () => {
      const clientEntity = createRandomClientEntity({});
      const refreshTokenResponse = createRandomRefreshTokenResponse({});

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(
          of(createFakeAxiosResponse({ data: refreshTokenResponse })),
        );
      jest
        .spyOn(refreshTokenRepository, 'replace')
        .mockImplementation((data) => Promise.resolve(data));

      expect(await refreshTokenService.replaceFrom(clientEntity)).toMatchObject(
        expect.objectContaining({
          value: refreshTokenResponse.refresh_token,
          type: refreshTokenResponse.token_type,
          scope: refreshTokenResponse.scope,
        }),
      );
    });

    it('should be able to handle and provide an error status if an error from axios is thrown', async () => {
      const clientEntity = createRandomClientEntity({});
      const errorMessage = faker.lorem.sentences();

      jest.spyOn(httpService, 'post').mockReturnValue(
        new Observable((subscriber) => {
          subscriber.error(new AxiosError(errorMessage));
        }),
      );

      await expect(
        refreshTokenService.replaceFrom(clientEntity),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe('findOne', () => {
    it('should be able to find client and return client entity if available', async () => {
      const refreshTokenEntity = createRandomRefreshTokenEntity({});

      jest
        .spyOn(refreshTokenRepository, 'find')
        .mockResolvedValue(refreshTokenEntity);

      expect(await refreshTokenService.findOne()).toEqual(refreshTokenEntity);
    });
  });

  describe('findOneOrFail', () => {
    it('should be able to throw an error if client not found', async () => {
      jest.spyOn(refreshTokenRepository, 'find').mockResolvedValue(null);

      await expect(refreshTokenService.findOneOrFail()).rejects.toThrowError();
    });
  });

  describe('findOneOrCreateFromExistingClient', () => {
    it('should be able to fetch a new refresh token from the existing client if the refresh token is not available', async () => {
      const refreshTokenEntity = createRandomRefreshTokenEntity({});

      jest.spyOn(refreshTokenRepository, 'find').mockResolvedValue(null);
      jest
        .spyOn(refreshTokenService, 'replaceFrom')
        .mockResolvedValue(refreshTokenEntity);

      expect(
        await refreshTokenService.findOneOrCreateFromExistingClient(),
      ).toEqual(refreshTokenEntity);
    });
  });
});
