import { CurrentlyPlayingState } from '../../player/states/currently-playing.state.js';
import { TerminalSizeState } from '../../terminal-kit/states/terminal-size.state.js';

export class PlayerTerminalState {
  currentlyPlayingState: CurrentlyPlayingState;
  terminalSizeState: TerminalSizeState;

  constructor({
    currentlyPlayingState,
    terminalSizeState,
  }: PlayerTerminalState) {
    this.currentlyPlayingState = currentlyPlayingState;
    this.terminalSizeState = terminalSizeState;
  }
}
