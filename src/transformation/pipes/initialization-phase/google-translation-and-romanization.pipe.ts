import { SrcTranslit as SourceTranslation } from '@vitalets/google-translate-api/dist/cjs/types.js';
import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

interface GoogleTranslationOptions {
  to: string;
  romanize: boolean;
  showTranslation: boolean;
}

const isSourceTranslation = (value: unknown): value is SourceTranslation =>
  value !== undefined &&
  value !== null &&
  typeof value === 'object' &&
  'src_translit' in value;

export const googleTranslationAndRomanization = ({
  to,
  romanize,
  showTranslation,
}: GoogleTranslationOptions): InitializationPipeFunction => {
  const googleTranslateApi = import('@vitalets/google-translate-api');

  return (lines) => {
    return from(
      (async () => {
        if (lines.length === 0) {
          return [];
        }

        const lyrics = lines
          .map((line) => line.words.split('\n').at(0))
          .join('|');

        const translate = (await googleTranslateApi).translate;
        const { text, raw } = await translate(lyrics, {
          to,
        });

        const translatedLyrics = text.split('|');
        const lastSentence = raw.sentences.at(-1);
        const romanizedLyrics = isSourceTranslation(lastSentence)
          ? lastSentence.src_translit.split('|')
          : [];
        const translatedLines = lines.map((line, index) => {
          const translatedLyric = translatedLyrics.at(index);
          const romanizedLyric = romanizedLyrics.at(index);

          return {
            ...line,
            words: ([line.words] as string[])
              .concat(
                romanize === true &&
                  romanizedLyric !== undefined &&
                  romanizedLyric.replace(/\s/g, '') !==
                    line.words.replace(/\s/g, '')
                  ? romanizedLyric
                  : [],
              )
              .concat(
                showTranslation === true &&
                  translatedLyric !== undefined &&
                  translatedLyric !== line.words
                  ? translatedLyric
                  : [],
              )
              .join('\n'),
          };
        });

        return translatedLines;
      })(),
    );
  };
};
