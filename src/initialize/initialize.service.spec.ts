import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { createRandomInitializeOptionsDto } from '../../test/utils/initialize/create-random-initialize-options-dto.js';
import { ClientService } from '../client/client.service.js';
import { RefreshTokenService } from '../refresh-token/refresh-token.service.js';
import { InitializeService } from './initialize.service.js';

describe('InitializeService', () => {
  let initializeService: InitializeService;
  let clientService: ClientService;

  jest.unstable_mockModule('../http.js', () => ({
    bootstrap: jest
      .fn()
      .mockReturnValue(faker.random.alphaNumeric(260, { casing: 'mixed' })),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializeService],
    })
      .useMocker((token) => {
        if (token === ClientService) {
          return { replace: jest.fn() };
        }

        if (token === RefreshTokenService) {
          return { replaceFrom: jest.fn() };
        }

        return {};
      })
      .compile();

    initializeService = module.get(InitializeService);
    clientService = module.get(ClientService);
  });

  describe('authorize', () => {
    it('should be able to give a success status if no error occurs', async () => {
      const initializeOptionsDto = createRandomInitializeOptionsDto({});

      const result = await initializeService.authorize(initializeOptionsDto);

      expect(result.status).toBe('SUCCESS');
    });

    it('should be able to handle and provide an error status if an error is thrown', async () => {
      const initializeOptionsDto = createRandomInitializeOptionsDto({});

      jest.spyOn(clientService, 'replace').mockImplementation(() => {
        throw new Error();
      });

      const result = await initializeService.authorize(initializeOptionsDto);

      expect(result.status).toBe('ERROR');
    });
  });
});
