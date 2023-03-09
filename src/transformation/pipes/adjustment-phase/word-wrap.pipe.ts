import terminalKit from 'terminal-kit';
import { splitStringByWidth } from '../../../common/utils/split-string-by-width.util.js';
import { AdjustmentPipeFunction } from '../../interfaces/adjustment-pipe-function.interface.js';

export const wordWrap: AdjustmentPipeFunction = ({ lyrics, options }) => {
  const wrappedLyrics = lyrics.map((lines) => {
    const wrappedLines = lines.flatMap((line) => {
      const words = line.split(/\s+/);
      const wrappedWords = words.reduce((acc: string[], word) => {
        const wordWidth = terminalKit.stringWidth(word);

        if (wordWidth > options.maxWidth) {
          const newLines = splitStringByWidth(word, {
            width: options.maxWidth,
          });

          return [...acc, ...newLines];
        }

        const lastLine = acc.at(-1) ?? '';
        const lastLineWidth = terminalKit.stringWidth(lastLine);

        if (lastLineWidth + wordWidth < options.maxWidth) {
          const previousLines = acc.slice(0, -1);

          return [...previousLines, `${lastLine}${word} `];
        }

        return [...acc, `${word} `];
      }, []);

      return wrappedWords;
    });

    return wrappedLines;
  });

  return { lyrics: wrappedLyrics, options };
};
