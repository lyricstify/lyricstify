import { Module } from '@nestjs/common';
import { DataSourceService } from './data-source.service.js';

@Module({
  providers: [
    {
      provide: DataSourceService,
      useValue: new DataSourceService(),
    },
  ],
  exports: [DataSourceService],
})
export class DataSourceModule {}
