import { Module } from '@nestjs/common';
import { AuthorizationModule } from './authorization/authorization.module.js';

@Module({
  imports: [AuthorizationModule],
})
export class HttpModule {}
