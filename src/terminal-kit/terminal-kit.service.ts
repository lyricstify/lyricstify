import { Injectable } from '@nestjs/common';
import terminalKit from 'terminal-kit';

@Injectable()
export class TerminalKitService {
  spawn() {
    const terminal = terminalKit.terminal;

    terminal.fullscreen(true);
    terminal.grabInput(false);

    const document = terminal.createDocument();
    const textBox = new terminalKit.TextBox({
      parent: document,
      scrollable: true,
      autoWidth: true,
      autoHeight: true,
    });

    terminal.hideCursor();
    document.focusNext();

    return { terminal, textBox };
  }

  close(terminal: terminalKit.Terminal) {
    terminal.hideCursor(false);
    terminal.styleReset();
    terminal.fullscreen(false);
    terminal.processExit(0);
  }
}
