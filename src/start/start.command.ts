import chalk from 'chalk';
import { Command, CommandRunner, Option } from 'nest-commander';
import { StartOptionsDto } from './dto/start-options.dto.js';
import { StartOptionsInterface } from './interfaces/start-options.interface.js';
import { StartService } from './start.service.js';

@Command({
  name: 'start',
  description: 'Start Lyricstify to show lyrics in your terminal',
})
export class StartCommand extends CommandRunner {
  constructor(private readonly startService: StartService) {
    super();
  }

  async run(inputs: string[], options: StartOptionsInterface) {
    if (inputs.length !== 0) {
      throw new Error(
        chalk.redBright(`${inputs.join(',')} is not valid command!`),
      );
    }

    this.startService.orchestra(new StartOptionsDto(options));
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
    flags: '--vertical-spacing <vertical-spacing>',
    description:
      'Sets amount of vertical space between lines of lyrics. (default: 0 or 1 if using romaji or translation)',
  })
  parseVerticalSpacing(val: string) {
    if (Number.isInteger(val) === false) {
      throw new Error(
        chalk.redBright('<vertical-spacing> should be a valid number'),
      );
    }

    const verticalSpacing = Number(val);

    if (verticalSpacing < 0) {
      throw new Error(
        chalk.redBright('<vertical-spacing> should be a positive integer'),
      );
    }

    return verticalSpacing;
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

  @Option({
    flags: '--indentation-char <indentation-char>',
    defaultValue: ' ',
    description:
      'Characters for indentation of vertically aligned center lyrics.',
  })
  parseIndentationChar(val: string) {
    return val;
  }

  @Option({
    flags: '--highlight-markup <highlight-markup>',
    defaultValue: '^+',
    description:
      'Markup style to the currently active lyrics. By default, the highlighted lyrics will be bolded, see https://github.com/cronvel/terminal-kit/blob/master/doc/markup.md for all available markups.',
  })
  parseHighlightMarkup(val: string) {
    return val;
  }
}
