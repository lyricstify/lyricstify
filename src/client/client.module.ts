import { Module } from '@nestjs/common';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { DataSourceService } from '../common/data-source/data-source.service.js';
import { DataSourceModule } from '../common/data-source/data-source.module.js';
import { ClientService } from './client.service.js';

@Module({
  imports: [DataSourceModule],
  providers: [
    ClientService,
    {
      inject: [DataSourceService],
      provide: DataSourceRepository,
      useFactory: (dataSourceService: DataSourceService) =>
        dataSourceService.access('client.json'),
    },
  ],
  exports: [ClientService],
})
export class ClientModule {}
