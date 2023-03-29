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
    flags: '--romanize',
    defaultValue: false,
    description:
      'Add romanized sentences to the output lyrics if the lyrics contain characters that can be romanized.',
  })
  parseRomanize() {
    return true;
  }

  @Option({
    flags: '--romanization-provider <romanization-provider>',
    defaultValue: 'kuroshiro',
    description:
      'Specify the provider used during the romanization\n' +
      '• "gcloud" (EXPERIMENTAL) romanization using Google Translation Cloud service, this romanization provides more accurate romanization sentences but since the current status is experimental so it may be unstable and can cause some errors.\n' +
      '• "kuroshiro" romanization using https://kuroshiro.org/ language library, only able to romanize Japanese sentences and has fewer romanization sentences but more stable compared to the gcloud.',
    choices: true,
    name: 'romanization provider choices',
  })
  parseRomanizationProvider(val: string) {
    this.commandValidationService.validateRomanizationProviderOrFail(val);

    return val;
  }

  @OptionChoiceFor({ name: 'romanization provider choices' })
  chosenForRomanizationProviderChoices() {
    return this.commandValidationService.romanizationProviderChoices();
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
      'Specify how the lyrics should be horizontally aligned on the screen.',
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

  @Option({
    flags: '--sync-type <sync-type>',
    defaultValue: 'none',
    description:
      'Controls the synchronization type for displaying lyrics.\n' +
      '• "none" means not modifying synchronizations that are already given from Spotify, this may cause lyrics not perfectly synced in your next songs that played automatically.\n' +
      '• "autoplay" can be used if your songs are played automatically, but your lyrics also may not sync perfectly if you control tracks manually (e.g switching between songs, seeking, or pausing and resuming manually)\n' +
      '• "balance" may be used if you let your songs play automatically but sometimes you also control tracks manually',
    choices: true,
    name: 'sync type choices',
  })
  parseSyncType(val: string) {
    this.commandValidationService.validateSyncTypeOrFail(val);

    return val;
  }

  @OptionChoiceFor({ name: 'sync type choices' })
  chosenForSyncTypeChoices() {
    return this.commandValidationService.syncTypeChoices();
  }
}
