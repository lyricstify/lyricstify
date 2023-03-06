import { Module } from '@nestjs/common';
import { InitializeModule } from './initialize/initialize.module.js';

@Module({
  imports: [InitializeModule],
})
export class CliModule {}
