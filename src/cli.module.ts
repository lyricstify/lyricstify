import { Module } from '@nestjs/common';
import { InitializeModule } from './initialize/initialize.module.js';
import { StartModule } from './start/start.module.js';

@Module({
  imports: [InitializeModule, StartModule],
})
export class CliModule {}
