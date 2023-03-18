import { Module } from '@nestjs/common';
import { CommandValidationService } from './command-validation.service.js';

@Module({
  providers: [CommandValidationService],
  exports: [CommandValidationService],
})
export class CommandValidationModule {}
