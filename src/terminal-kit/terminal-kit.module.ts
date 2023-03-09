import { Module } from '@nestjs/common';
import { KeypressEventObservable } from './observables/keypress-event.observable.js';
import { ResizeEventObservable } from './observables/resize-event.observable.js';
import { TerminalKitService } from './terminal-kit.service.js';

@Module({
  providers: [
    TerminalKitService,
    ResizeEventObservable,
    KeypressEventObservable,
  ],
  exports: [TerminalKitService, ResizeEventObservable, KeypressEventObservable],
})
export class TerminalKitModule {}
