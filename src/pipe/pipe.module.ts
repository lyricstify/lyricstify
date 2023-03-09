import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module.js';
import { TransformationModule } from '../transformation/transformation.module.js';
import { PipeOrchestraObservable } from './observables/pipe-orchestra.observable.js';
import { PipeCommand } from './pipe.command.js';
import { PipeService } from './pipe.service.js';

@Module({
  imports: [PlayerModule, TransformationModule],
  providers: [PipeService, PipeOrchestraObservable, PipeCommand],
})
export class PipeModule {}
