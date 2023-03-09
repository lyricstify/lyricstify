import chalk from 'chalk';
import { Command, CommandRunner, Option } from 'nest-commander';
import { PipeOptionsDto } from './dto/pipe-options.dto.js';
import { PipeOptionsInterface } from './interfaces/pipe-options.interface.js';
import { PipeService } from './pipe.service.js';

@Command({
  name: 'pipe',
  description: 'Send currently Lyricstify active lyrics to stdout',
})
export class PipeCommand extends CommandRunner {
  constructor(private readonly pipeService: PipeService) {
    super();
  }

  async run(inputs: string[], options: PipeOptionsInterface) {
    if (inputs.length !== 0) {
      throw new Error(
        chalk.redBright(`${inputs.join(',')} is not valid command!`),
      );
    }

    this.pipeService.orchestra(new PipeOptionsDto(options));
  }

  @Option({
    flags: '--romaji',
    defaultValue: false,
    description:
      'Add romanized Japanese sentences to the output lyrics if the lyrics contain Japanese characters.',
  })
  parseRomaji() {
    return true;
  }

  @Option({
    flags: '--delay <delay>',
    defaultValue: 2000,
    description:
      'Sets delay time (in ms) between HTTP requests to the Spotify API.',
  })
  parseDelay(val: string) {
    if (Number.isInteger(val) === false) {
      throw new Error(chalk.redBright('<delay> should be a valid number'));
    }

    const delay = Number(val);

    if (delay < 100) {
      throw new Error(
        chalk.redBright(
          '<delay> should be a positive integer with a minimum value of 100.',
        ),
      );
    }

    return delay;
  }

  @Option({
    flags: '--translate-to <translate-to>',
    defaultValue: false,
    description:
      '(EXPERIMENTAL) Add lyrics translation. The value should be ISO-639 code, see https://cloud.google.com/translate/docs/languages for all available language codes.',
  })
  parseTranslateTo(val: string) {
    return val;
  }
}
