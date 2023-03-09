import { Module } from '@nestjs/common';
import { AuthorizationModule } from './authorization/authorization.module.js';
import { ClientModule } from './client/client.module.js';
import { LyricModule } from './lyric/lyric.module.js';
import { PlayerModule } from './player/player.module.js';
import { RefreshTokenModule } from './refresh-token/refresh-token.module.js';
import { TerminalKitModule } from './terminal-kit/terminal-kit.module.js';
import { TokenModule } from './token/token.module.js';
import { TransformationModule } from './transformation/transformation.module.js';

@Module({
  imports: [
    AuthorizationModule,
    ClientModule,
    RefreshTokenModule,
    TokenModule,
    LyricModule,
    PlayerModule,
    TokenModule,
    TransformationModule,
    TerminalKitModule,
  ],
})
export class ReplModule {}
