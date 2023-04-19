import {
  Sentence,
  SrcTranslit as SourceTranslation,
} from '@vitalets/google-translate-api/dist/cjs/types.js';
import { from } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';

interface GoogleTranslationOptions {
  to: string;
  romanize: boolean;
  showTranslation: boolean;
  hideSourceLyrics: boolean;
}

const isSourceTranslation = (value: unknown): value is SourceTranslation =>
  value !== undefined &&
  value !== null &&
  typeof value === 'object' &&
  'src_translit' in value;

const isSentence = (value: unknown): value is Sentence =>
  value !== undefined &&
  value !== null &&
  typeof value === 'object' &&
  'trans' in value &&
  'orig' in value;

export const googleTranslationAndRomanization = ({
  to,
  romanize,
  showTranslation,
  hideSourceLyrics,
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
          .join(' \r ');

        const translate = (await googleTranslateApi).translate;
        const { raw } = await translate(lyrics, {
          to,
        });

        const { translatedLyrics, romanizedLyrics } = raw.sentences.reduce(
          (acc, val) => {
            if (isSourceTranslation(val)) {
              return {
                translatedLyrics: acc.translatedLyrics,
                romanizedLyrics: val.src_translit.split('\r'),
              };
            }

            if (isSentence(val)) {
              return {
                romanizedLyrics: acc.romanizedLyrics,
                translatedLyrics: [
                  ...acc.translatedLyrics,
                  val.trans.replace(/\n/g, ''),
                ],
              };
            }

            return acc;
          },
          {
            translatedLyrics: [] as string[],
            romanizedLyrics: [] as string[],
          },
        );

        const translatedLines = lines.map((line, index) => {
          const translatedLyric = translatedLyrics.at(index);
          const isTranslated =
            showTranslation === true &&
            translatedLyric !== undefined &&
            translatedLyric.replace(/\s/g, '') !==
              line.words.replace(/\s/g, '');
          const romanizedLyric = romanizedLyrics.at(index);
          const isRomanized =
            romanize === true &&
            romanizedLyric !== undefined &&
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
      })(),
    );
  };
};
