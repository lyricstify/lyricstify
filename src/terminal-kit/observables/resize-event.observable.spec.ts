import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Test, TestingModule } from '@nestjs/testing';
import { take } from 'rxjs';
import terminalKit from 'terminal-kit';
import { ResizeEventObservable } from './resize-event.observable.js';

describe('ResizeEventObservable', () => {
  let resizeEventObservable: ResizeEventObservable;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResizeEventObservable],
    }).compile();

    resizeEventObservable = module.get(ResizeEventObservable);
  });

  describe('run', () => {
    it('should be able to emit the terminal size state to the observer', async () => {
      const width = 100;
      const height = 50;
      const terminal = terminalKit.terminal;
      terminal.width = width;
      terminal.height = height;

      const resizeEvent$ = resizeEventObservable
        .run({ terminal })
        .pipe(take(1));

      const observerSpy = subscribeSpyTo(resizeEvent$);
      await observerSpy.onComplete();
      const terminalSizeState = observerSpy.getFirstValue();

      expect(terminalSizeState.width).toBe(width);
      expect(terminalSizeState.height).toBe(height);
      expect(terminalSizeState.isResized).toBe(true);
    });
  });
});
