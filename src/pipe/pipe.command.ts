import {
  Command,
  CommandRunner,
  Option,
  OptionChoiceFor,
} from 'nest-commander';
import { CommandValidationService } from '../command-validation/command-validation.service.js';
import { PipeOptionsDto } from './dto/pipe-options.dto.js';
import { PipeOptionsInterface } from './interfaces/pipe-options.interface.js';
import { PipeService } from './pipe.service.js';

@Command({
  name: 'pipe',
  description: 'Send currently Lyricstify active lyrics to stdout',
})
export class PipeCommand extends CommandRunner {
  constructor(
    private readonly pipeService: PipeService,
    private readonly commandValidationService: CommandValidationService,
  ) {
    super();
  }

  async run(inputs: string[], options: PipeOptionsInterface) {
    this.commandValidationService.validateInputsCommandOrFail(inputs);
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
