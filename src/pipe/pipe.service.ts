import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { CreateInitializationPipesDto } from '../transformation/dto/create-initialization-pipes.dto.js';
import { TransformationService } from '../transformation/transformation.service.js';
import { PipeOptionsDto } from './dto/pipe-options.dto.js';
import { PipeOrchestraObservable } from './observables/pipe-orchestra.observable.js';

@Injectable()
export class PipeService {
  constructor(
    private readonly pipeOrchestraObservable: PipeOrchestraObservable,
    private readonly transformationService: TransformationService,
  ) {}

  orchestra({
    delay,
    romanize: romanizeSentences,
    romanizationProvider,
    translateTo: translateSentences,
    syncType,
    hideSourceLyrics,
  }: PipeOptionsDto) {
    const orchestra$ = this.pipeOrchestraObservable.run({
      delay,
      syncType,
      initializationPipes: this.transformationService.initializationPipesFrom(
        new CreateInitializationPipesDto({
          romanizationProvider,
          romanizeSentences,
          spaceBetweenLines: false,
          translateSentences,
          hideSourceLyrics,
        }),
      ),
    });

    const orchestraSubscriber = orchestra$.subscribe({
      error: (e) => {
        const message = this.handleErrorMessage(e);
        console.error(chalk.redBright(message));
      },
      next: ({ content }) => {
        console.info(content);
      },
    });

    return { orchestraSubscriber };
  }

  private handleErrorMessage(e: unknown) {
    if (typeof e === 'string') {
      return e;
    }

    if (e instanceof Error) {
      return e.message;
    }

    return 'An error occurred while using the pipe command.';
  }
}
