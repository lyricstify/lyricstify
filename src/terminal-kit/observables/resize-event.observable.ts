import { Injectable } from '@nestjs/common';
import { fromEvent, map, Observable, pairwise, startWith } from 'rxjs';
import terminalKit from 'terminal-kit';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import { ResizeEventInterface } from '../interfaces/resize-event.interface.js';
import { TerminalSizeState } from '../states/terminal-size.state.js';

interface RunOptions {
  terminal: terminalKit.Terminal;
}

@Injectable()
export class ResizeEventObservable implements ObservableRunner {
  run({ terminal }: RunOptions) {
    return (
      fromEvent(terminal, 'resize') as Observable<ResizeEventInterface>
    ).pipe(
      startWith<ResizeEventInterface>(
        [0, 0],
        [terminal.width, terminal.height],
      ),
      pairwise(),
      map(this.convertToTerminalSizeState),
    );
  }

  private convertToTerminalSizeState([
    [prevWidth, prevHeight],
    [currentWidth, currentHeight],
  ]: [ResizeEventInterface, ResizeEventInterface]) {
    return new TerminalSizeState({
      height: currentHeight,
      width: currentWidth,
      isResized: prevWidth !== currentWidth || prevHeight !== currentHeight,
    });
  }
}
