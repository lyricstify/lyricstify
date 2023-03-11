import { Test, TestingModule } from '@nestjs/testing';
import { rm } from 'fs/promises';
import { resolve } from 'path';
import { DataSourceRepository } from './data-source.repository.js';
import { DataSourceService } from './data-source.service.js';

describe('DataSourceService', () => {
  const configDir = resolve('.tests');
  let dataSourceService: DataSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DataSourceService,
          useFactory: () => new DataSourceService(configDir),
        },
      ],
    }).compile();

    dataSourceService = module.get(DataSourceService);
  });

  afterEach(async () => {
    await rm(configDir, { recursive: true });
  });

  describe('access', () => {
    it('return type should be an instance of data source repository', () => {
      const dataSourceRepository = dataSourceService.access('test.json');

      expect(dataSourceRepository).toBeInstanceOf(DataSourceRepository);
    });

    it('should be able to return null if data is empty', async () => {
      const dataSourceRepository = dataSourceService.access('test.json');

      expect(await dataSourceRepository.find()).toBe(null);
    });

    it('should be able to save data', async () => {
      const dataSourceRepository = dataSourceService.access('test.json');
      const data = { id: 10 };

      expect(await dataSourceRepository.replace(data)).toEqual(data);
      expect(await dataSourceRepository.find()).toEqual(data);
    });
  });
});
