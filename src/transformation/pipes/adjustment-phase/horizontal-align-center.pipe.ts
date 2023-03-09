import terminalKit from 'terminal-kit';
import { AdjustmentPipeFunction } from '../../interfaces/adjustment-pipe-function.interface.js';

export const horizontalAlignCenter = (
  indentationChar = ' ',
): AdjustmentPipeFunction => {
  return ({ lyrics, options }) => {
    const alignedLyrics = lyrics.map((lines) => {
      const alignedLines = lines.map((line) => {
        const textWidth = terminalKit.stringWidth(line);
        const indentationLength = Math.floor(
          (options.maxWidth - textWidth) / 2,
        );

        if (indentationLength < 0) {
          return line;
        }

        const indentation = indentationChar.repeat(indentationLength);

        return `${indentation}${line}`;
      });

      return alignedLines;
    });

    return { lyrics: alignedLyrics, options };
  };
};
