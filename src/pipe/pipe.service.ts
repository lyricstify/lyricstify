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
    romaji: romanizeJapaneseSentences,
    translateTo: translateSentences,
  }: PipeOptionsDto) {
    const orchestra$ = this.pipeOrchestraObservable.run({
      delay,
      initializationPipes: this.transformationService.initializationPipesFrom(
        new CreateInitializationPipesDto({
          romanizeJapaneseSentences,
          spaceBetweenLines: false,
          translateSentences,
        }),
      ),
    });

    orchestra$.subscribe({
      error: (e) => {
        const message = (() => {
          if (typeof e === 'string') {
            return e;
          }

          if (e instanceof Error) {
            return e.message;
          }

          return 'An error occurred while using the start command.';
        })();

        console.error(chalk.redBright(message));
      },
      next: ({ content }) => {
        console.info(content);
      },
    });
  }
}
