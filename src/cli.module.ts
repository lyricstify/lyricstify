import { Module } from '@nestjs/common';
import { InitializeModule } from './initialize/initialize.module.js';
import { PipeModule } from './pipe/pipe.module.js';
import { StartModule } from './start/start.module.js';

@Module({
  imports: [InitializeModule, StartModule, PipeModule],
})
export class CliModule {}
