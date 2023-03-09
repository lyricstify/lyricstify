import { ContentState } from '../../pipe/states/content.state.js';

export class TerminalContentState extends ContentState {
  cursor: number;

  constructor({ content, cursor }: TerminalContentState) {
    super({ content });
    this.cursor = cursor;
  }
}
