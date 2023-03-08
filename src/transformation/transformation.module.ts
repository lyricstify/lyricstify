import { Module } from '@nestjs/common';
import { TransformationService } from './transformation.service.js';

@Module({
  providers: [TransformationService],
  exports: [TransformationService],
})
export class TransformationModule {}
