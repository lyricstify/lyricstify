import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { TestingModule } from '@nestjs/testing';
import { rm } from 'fs/promises';
import { CommandTestFactory } from 'nest-commander-testing';
import { resolve } from 'path';
import { of } from 'rxjs';
import { CliModule } from '../src/cli.module.js';
import { ClientService } from '../src/client/client.service.js';
import { DataSourceService } from '../src/common/data-source/data-source.service.js';
import { RefreshTokenService } from '../src/refresh-token/refresh-token.service.js';
import { createFakeAxiosResponse } from './utils/common/create-fake-axios-response.js';
import { createRandomInitializeOptionsDto } from './utils/initialize/create-random-initialize-options-dto.js';
import { createRandomRefreshTokenResponse } from './utils/refresh-token/create-random-refresh-token-response.js';

describe('InitializeCommand (e2e)', () => {
  let commandInstance: TestingModule;
  let clientService: ClientService;
  let refreshTokenService: RefreshTokenService;

  const configDir = resolve('.tests/initialize.e2e-spec');
  const code = faker.random.alphaNumeric(260, { casing: 'mixed' });
  const initializeOptions = createRandomInitializeOptionsDto({});
  const refreshTokenResponse = createRandomRefreshTokenResponse({});

  jest.spyOn(console, 'info').mockReturnValue();
  jest.unstable_mockModule('../src/http.js', () => ({
    bootstrap: jest.fn().mockReturnValue(code),
  }));

  beforeEach(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [CliModule],
    })
      .overrideProvider(DataSourceService)
      .useValue(new DataSourceService(configDir))
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn().mockImplementation((url, data) => {
          if (
            url === 'https://accounts.spotify.com/api/token' &&
            data instanceof URLSearchParams &&
            data.get('grant_type') === 'authorization_code'
          ) {
            return of(createFakeAxiosResponse({ data: refreshTokenResponse }));
          }

          return of();
        }),
      })
      .compile();

    clientService = commandInstance.get(ClientService);
    refreshTokenService = commandInstance.get(RefreshTokenService);
  });

  afterEach(async () => {
    await rm(configDir, { recursive: true });
  });

  describe('init', () => {
    it('should be able to create client entity', async () => {
      CommandTestFactory.setAnswers([
        `I'm ready!`,
        initializeOptions.id,
        initializeOptions.secret,
        initializeOptions.redirectUriPort,
      ]);

      await CommandTestFactory.run(commandInstance, ['init']);

      expect(await clientService.findOne()).toMatchObject({
        id: initializeOptions.id,
        secret: initializeOptions.secret,
        code,
        redirectUri: expect.stringContaining(initializeOptions.redirectUriPort),
      });
    });

    it('should be able to create refresh token', async () => {
      CommandTestFactory.setAnswers([
        `I'm ready!`,
        initializeOptions.id,
        initializeOptions.secret,
        initializeOptions.redirectUriPort,
      ]);

      await CommandTestFactory.run(commandInstance, ['init']);

      expect(await refreshTokenService.findOne()).toMatchObject({
        value: refreshTokenResponse.refresh_token,
        scope: refreshTokenResponse.scope,
        type: refreshTokenResponse.token_type,
      });
    });
  });
});
