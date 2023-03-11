import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { ClientService } from './client.service.js';
import { ClientEntity } from './entities/client.entity.js';

describe('ClientService', () => {
  let clientService: ClientService;
  let clientDataSourceRepository: DataSourceRepository<ClientEntity>;

  const clientEntity = new ClientEntity({
    code: 'code',
    id: 'id',
    redirectUri: 'redirectUri',
    secret: 'secret',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService],
    })
      .useMocker((token) => {
        if (token === DataSourceRepository) {
          return {
            replace: jest.fn((data) => Promise.resolve(data)),
            find: jest.fn().mockReturnValue(Promise.resolve(clientEntity)),
          };
        }

        return {};
      })
      .compile();

    clientService = module.get(ClientService);
    clientDataSourceRepository = module.get(DataSourceRepository);
  });

  describe('replace', () => {
    it('should be able to replace client', async () => {
      expect(await clientService.replace(clientEntity)).toBe(clientEntity);
    });
  });

  describe('findOne', () => {
    it('should be able to find client', async () => {
      expect(await clientService.findOne()).toBe(clientEntity);
    });
  });

  describe('findOneOrFail', () => {
    it('should be able to throw an error if client not found', async () => {
      jest
        .spyOn(clientDataSourceRepository, 'find')
        .mockReturnValue(Promise.resolve(null));

      await expect(clientService.findOneOrFail()).rejects.toThrowError();
    });
  });
});
