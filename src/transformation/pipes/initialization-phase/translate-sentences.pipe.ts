import { translate } from '@vitalets/google-translate-api';
import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

export const translateSentences = (to: string): InitializationPipeFunction => {
  return (lines) => {
    return from(
      (async () => {
        const lyrics = lines
          .map((line) => line.words.split('\n').at(0))
          .join('\n');

        const { text } = await translate(lyrics, {
          to,
        });

        const translatedLyrics = text.split('\n');
        const translatedLines = lines.map((line, index) => {
          const translatedLyric = translatedLyrics.at(index);

          if (translatedLyric === undefined || translatedLyric === line.words) {
            return line;
          }

          return {
            ...line,
            words: `${line.words}\n${translatedLyric}`,
          };
        });

        return translatedLines;
      })(),
    );
  };
};
