import { Module } from '@nestjs/common';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module.js';
import { ClientModule } from '../client/client.module.js';
import { InitializeCommand } from './initialize.command.js';
import { InitializeQuestion } from './initialize.question.js';
import { InitializeService } from './initialize.service.js';
import { CommandValidationModule } from '../command-validation/command-validation.module.js';

@Module({
  imports: [ClientModule, RefreshTokenModule, CommandValidationModule],
  providers: [InitializeQuestion, InitializeCommand, InitializeService],
})
export class InitializeModule {}
