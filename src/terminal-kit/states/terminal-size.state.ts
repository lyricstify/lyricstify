export class TerminalSizeState {
  width: number;
  height: number;
  isResized: boolean;

  constructor({ width, height, isResized }: TerminalSizeState) {
    this.width = width;
    this.height = height;
    this.isResized = isResized;
  }
}
