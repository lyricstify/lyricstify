import { Module } from '@nestjs/common';
import { DataSourceService } from './data-source.service.js';

@Module({
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}
