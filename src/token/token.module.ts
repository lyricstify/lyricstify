import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module.js';
import { DataSourceModule } from '../common/data-source/data-source.module.js';
import { DataSourceRepository } from '../common/data-source/data-source.repository.js';
import { DataSourceService } from '../common/data-source/data-source.service.js';
import { TokenService } from './token.service.js';
import { ConfigModule } from '../config/config.module.js';

@Module({
  imports: [ConfigModule, DataSourceModule, HttpModule, RefreshTokenModule],
  providers: [
    TokenService,
    {
      inject: [DataSourceService],
      provide: DataSourceRepository,
      useFactory: (dataSourceService: DataSourceService) =>
        dataSourceService.access('token.json'),
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
