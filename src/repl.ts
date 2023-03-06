import { repl } from '@nestjs/core';
import { ReplModule } from './repl.module.js';

async function bootstrap() {
  const replServer = await repl(ReplModule);
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}
bootstrap();
