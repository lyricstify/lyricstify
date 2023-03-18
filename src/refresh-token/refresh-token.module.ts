import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { DataSourceService } from '../common/data-source/data-source.service.js';
import { DataSourceModule } from '../common/data-source/data-source.module.js';
import { RefreshTokenService } from './refresh-token.service.js';
import { ConfigModule } from '../config/config.module.js';

@Module({
  imports: [ConfigModule, HttpModule, DataSourceModule],
  providers: [
    RefreshTokenService,
    {
      inject: [DataSourceService],
      provide: DataSourceRepository,
      useFactory: (dataSourceService: DataSourceService) =>
        dataSourceService.access('refresh-token.json'),
    },
  ],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
