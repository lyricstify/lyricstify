import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { KeypressEventInterface } from '../terminal-kit/interfaces/keypress-event.interface.js';
import { KeypressEventObservable } from '../terminal-kit/observables/keypress-event.observable.js';
import { TerminalKitService } from '../terminal-kit/terminal-kit.service.js';
import { CreateAdjustmentPipesDto } from '../transformation/dto/create-adjustment-pipes.dto.js';
import { CreateInitializationPipesDto } from '../transformation/dto/create-initialization-pipes.dto.js';
import { CreateUpdateProgressPipesDto } from '../transformation/dto/create-update-progress-pipes.dto.js';
import { TransformationService } from '../transformation/transformation.service.js';
import { StartOptionsDto } from './dto/start-options.dto.js';
import { StartOrchestraObservable } from './observables/start-orchestra.observable.js';

@Injectable()
export class StartService {
  constructor(
    private readonly terminalKeypressEvent: KeypressEventObservable,
    private readonly terminalKitService: TerminalKitService,
    private readonly startOrchestraObservable: StartOrchestraObservable,
    private readonly transformationService: TransformationService,
  ) {}

  orchestra({
    delay,
    romanize: romanizeSentences,
    romanizationProvider,
    verticalSpacing: spaceBetweenLines,
    translateTo: translateSentences,
    highlightMarkup,
    horizontalAlign,
    syncType,
    hideSourceLyrics,
  }: StartOptionsDto) {
    const { terminal, textBox } = this.terminalKitService.spawn();
    const keypress$ = this.terminalKeypressEvent.run({ terminal });
    const orchestra$ = this.startOrchestraObservable.run({
      terminal,
      delay,
      syncType,
      initializationPipes: this.transformationService.initializationPipesFrom(
        new CreateInitializationPipesDto({
          romanizeSentences,
          romanizationProvider,
          spaceBetweenLines,
          translateSentences,
          hideSourceLyrics,
        }),
      ),
      adjustmentPipes: this.transformationService.adjustmentPipesFrom(
        new CreateAdjustmentPipesDto({
          horizontalAlign,
        }),
      ),
      updateProgressPipes: this.transformationService.updateProgressPipesFrom(
        new CreateUpdateProgressPipesDto({
          highlightMarkup,
        }),
      ),
    });

    const keypressSubscriber = keypress$.subscribe(
      ([key]: KeypressEventInterface) => {
        if (key === 'CTRL_C') {
          this.terminalKitService.close(terminal);
        }
      },
    );

    const orchestraSubscriber = orchestra$.subscribe({
      error: (e) => {
        const message = this.handleErrorMessage(e);

        this.terminalKitService.close(terminal);
        console.error(chalk.redBright(message));
      },
      next: ({ content, cursor }) => {
        textBox.setContent(content, true);
        textBox.scrollTo(0, cursor);
      },
    });

    return { keypressSubscriber, orchestraSubscriber };
  }

  private handleErrorMessage(e: unknown) {
    if (typeof e === 'string') {
      return e;
    }

    if (e instanceof Error) {
      return e.message;
    }

    return 'An error occurred while using the start command.';
  }
}
