import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

export const translateSentences = (to: string): InitializationPipeFunction => {
  const googleTranslateApi = import('@vitalets/google-translate-api');

  return (lines) => {
    return from(
      (async () => {
        const lyrics = lines
          .map((line) => line.words.split('\n').at(0))
          .join('\n');

        const translate = (await googleTranslateApi).translate;
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
