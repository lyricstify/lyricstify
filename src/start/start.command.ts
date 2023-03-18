import {
  Command,
  CommandRunner,
  Option,
  OptionChoiceFor,
} from 'nest-commander';
import { StartOptionsDto } from './dto/start-options.dto.js';
import { StartOptionsInterface } from './interfaces/start-options.interface.js';
import { StartService } from './start.service.js';
import { CommandValidationService } from '../command-validation/command-validation.service.js';

@Command({
  name: 'start',
  description: 'Start Lyricstify to show lyrics in your terminal',
})
export class StartCommand extends CommandRunner {
  constructor(
    private readonly startService: StartService,
    private readonly commandValidationService: CommandValidationService,
  ) {
    super();
  }

  async run(inputs: string[], options: StartOptionsInterface) {
    this.commandValidationService.validateInputsCommandOrFail(inputs);
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
    const verticalSpacing = Number(val);

    this.commandValidationService.validateVerticalSpacingOptionOrFail(
      verticalSpacing,
    );

    return verticalSpacing;
  }

  @Option({
    flags: '--delay <delay>',
    defaultValue: 2000,
    description:
      'Sets delay time (in ms) between HTTP requests to the Spotify API.',
  })
  parseDelay(val: string) {
    const delay = Number(val);

    this.commandValidationService.validateDelayOptionOrFail(delay);

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
    flags: '--horizontal-align <horizontal-align>',
    defaultValue: 'center',
    description:
      'Characters for indentation of vertically aligned center lyrics.',
    choices: true,
    name: 'horizontal align choices',
  })
  parseHorizontalAlign(val: string) {
    this.commandValidationService.validateHorizontalAlignOptionOrFail(val);

    return val;
  }

  @OptionChoiceFor({ name: 'horizontal align choices' })
  chosenForHorizontalAlignChoices() {
    return this.commandValidationService.horizontalAlignChoices();
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
