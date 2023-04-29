import { catchError, defer, of, retry } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

interface GoogleTranslationOptions {
  to: string;
  romanize: boolean;
  showTranslation: boolean;
  hideSourceLyrics: boolean;
}

export const googleTranslationAndRomanization = ({
  to,
  romanize,
  showTranslation,
  hideSourceLyrics,
}: GoogleTranslationOptions): InitializationPipeFunction => {
  const googleTranslateApi = import('google-translate-api-x');

  return (lines) => {
    return defer(async () => {
      if (lines.length === 0) {
        return [];
      }

      const lyrics = lines.map((line) => line.words.split('\n').at(0) ?? '');

      const translate = (await googleTranslateApi).translate;
      const translatedLyrics = await translate(lyrics, {
        to,
      });

      const translatedLines = lines.map((line, index) => {
        const translation = translatedLyrics.at(index);
        const translatedLyric = translation?.text;
        const romanizedLyric = translation?.raw?.at(0)?.at(0);
        const isTranslated =
          showTranslation === true &&
          typeof translatedLyric === 'string' &&
          translatedLyric.replace(/\s/g, '') !== line.words.replace(/\s/g, '');
        const isRomanized =
          romanize === true &&
          typeof romanizedLyric === 'string' &&
          romanizedLyric.replace(/\s/g, '') !== line.words.replace(/\s/g, '');

        return {
          ...line,
          words: ([] as string[])
            .concat(
              (isRomanized === true || isTranslated === true) &&
                hideSourceLyrics === true
                ? []
                : line.words,
            )
            .concat(isRomanized ? romanizedLyric.trim() : [])
            .concat(isTranslated ? translatedLyric.trim() : [])
            .join('\n'),
        };
      });

      return translatedLines;
    }).pipe(
      retry({
        count: 3,
        delay: 1000,
      }),
      catchError(() => of(lines)),
    );
  };
};
