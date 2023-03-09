import { Injectable } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import terminalKit from 'terminal-kit';
import { ObservableRunner } from '../../common/interfaces/observable-runner.interface.js';
import { KeypressEventInterface } from '../interfaces/keypress-event.interface.js';

interface RunOptions {
  terminal: terminalKit.Terminal;
}

@Injectable()
export class KeypressEventObservable implements ObservableRunner {
  run({ terminal }: RunOptions) {
    return fromEvent(terminal, 'key') as Observable<KeypressEventInterface>;
  }
}
