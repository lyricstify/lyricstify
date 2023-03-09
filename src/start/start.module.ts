import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module.js';
import { TerminalKitModule } from '../terminal-kit/terminal-kit.module.js';
import { TransformationModule } from '../transformation/transformation.module.js';
import { StartOrchestraObservable } from './observables/start-orchestra.observable.js';
import { StartCommand } from './start.command.js';
import { StartService } from './start.service.js';

@Module({
  imports: [TerminalKitModule, PlayerModule, TransformationModule],
  providers: [StartService, StartOrchestraObservable, StartCommand],
})
export class StartModule {}
