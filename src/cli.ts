import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli.module.js';

const bootstrap = async () => {
  await CommandFactory.run(CliModule, ['error']);
};
bootstrap();
