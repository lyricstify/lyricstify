import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { createRandomClientEntity } from '../../test/utils/client/create-random-client-entity.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { ClientService } from './client.service.js';
import { ClientEntity } from './entities/client.entity.js';

describe('ClientService', () => {
  let clientService: ClientService;
  let clientDataSourceRepository: DataSourceRepository<ClientEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService],
    })
      .useMocker((token) => {
        if (token === DataSourceRepository) {
          return {
            replace: jest.fn(),
            find: jest.fn(),
          };
        }

        return {};
      })
      .compile();

    clientService = module.get(ClientService);
    clientDataSourceRepository = module.get(DataSourceRepository);
  });

  describe('replace', () => {
    it('should be able to replace client and return client entity', async () => {
      const clientEntity = createRandomClientEntity({});

      jest
        .spyOn(clientDataSourceRepository, 'replace')
        .mockImplementation((data) => Promise.resolve(data));

      expect(await clientService.replace(clientEntity)).toEqual(clientEntity);
    });
  });

  describe('findOne', () => {
    it('should be able to find client and return client entity if available', async () => {
      const clientEntity = createRandomClientEntity({});

      jest
        .spyOn(clientDataSourceRepository, 'find')
        .mockResolvedValue(clientEntity);

      expect(await clientService.findOne()).toEqual(clientEntity);
    });
  });

  describe('findOneOrFail', () => {
    it('should be able to throw an error if client not found', async () => {
      jest.spyOn(clientDataSourceRepository, 'find').mockResolvedValue(null);

      await expect(clientService.findOneOrFail()).rejects.toThrowError();
    });
  });
});
