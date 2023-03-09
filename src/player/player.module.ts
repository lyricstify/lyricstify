import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LyricModule } from '../lyric/lyric.module.js';
import { TokenModule } from '../token/token.module.js';
import { GraduallyUpdateProgressObservable } from './observables/gradually-update-progress.observable.js';
import { PollCurrentlyPlayingObservable } from './observables/poll-currently-playing.observable.js';
import { PlayerService } from './player.service.js';

@Module({
  imports: [HttpModule, TokenModule, LyricModule],
  providers: [
    PlayerService,
    PollCurrentlyPlayingObservable,
    GraduallyUpdateProgressObservable,
  ],
  exports: [
    PlayerService,
    PollCurrentlyPlayingObservable,
    GraduallyUpdateProgressObservable,
  ],
})
export class PlayerModule {}
