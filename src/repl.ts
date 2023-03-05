import { repl } from '@nestjs/core';
import { CliModule } from './cli.module.js';

async function bootstrap() {
  const replServer = await repl(CliModule);
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}
bootstrap();
