import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { map, of } from 'rxjs';
import { TransformationService } from '../transformation/transformation.service.js';
import { PipeOrchestraObservable } from './observables/pipe-orchestra.observable.js';
import { PipeService } from './pipe.service.js';
import { ContentState } from './states/content.state.js';

describe('PipeService', () => {
  let pipeService: PipeService;
  let pipeOrchestraObservable: PipeOrchestraObservable;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PipeService],
    })
      .useMocker((token) => {
        if (token === PipeOrchestraObservable) {
          return { run: jest.fn() };
        }

        if (token === TransformationService) {
          return { initializationPipesFrom: jest.fn().mockReturnValue([]) };
        }

        return {};
      })
      .compile();

    pipeService = module.get(PipeService);
    pipeOrchestraObservable = module.get(PipeOrchestraObservable);
  });

  describe('orchestra', () => {
    it('should be able to send currently active lyrics to stdout', (done) => {
      const contentState = new ContentState({ content: faker.lorem.lines() });
      const consoleSpy = jest.spyOn(console, 'info').mockReturnValue();

      jest
        .spyOn(pipeOrchestraObservable, 'run')
        .mockReturnValue(of(contentState));

      const { orchestraSubscriber } = pipeService.orchestra({
        delay: 0,
        romaji: false,
        translateTo: false,
        syncType: 'none',
      });

      expect(consoleSpy).toHaveBeenCalledWith(contentState.content);

      orchestraSubscriber.add(done);
    });

    it('should be able to send an error message to stderr', (done) => {
      const errorMessage = faker.lorem.sentences();
      const contentState = new ContentState({ content: faker.lorem.lines() });
      const consoleSpy = jest.spyOn(console, 'error').mockReturnValue();

      jest.spyOn(pipeOrchestraObservable, 'run').mockReturnValue(
        of(contentState).pipe(
          map(() => {
            throw new Error(errorMessage);
          }),
        ),
      );

      const { orchestraSubscriber } = pipeService.orchestra({
        delay: 0,
        romaji: false,
        translateTo: false,
        syncType: 'none',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );

      orchestraSubscriber.add(done);
    });
  });
});
