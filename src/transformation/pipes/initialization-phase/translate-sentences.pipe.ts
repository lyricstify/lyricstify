import { mergeMap, of } from 'rxjs';
import { InitializationPipeFunction } from '../../interfaces/initialization-pipe-function.interface.js';
import { RomanizationProviderChoicesType } from '../../types/romanization-provider-choices.type.js';
import { googleTranslationAndRomanization } from './google-translation-and-romanization.pipe.js';
import { kuroshiroRomanization } from './kuroshiro-romanization.pipe.js';

interface TranslateSentencesOptions {
  to: string;
  romanize: boolean;
  romanizationProvider: RomanizationProviderChoicesType | false;
  showTranslation: boolean;
  hideSourceLyrics: boolean;
}

export const translateSentences = ({
  to,
  romanize,
  romanizationProvider,
  showTranslation,
  hideSourceLyrics,
}: TranslateSentencesOptions): InitializationPipeFunction => {
  const romanization = (() => {
    switch (romanizationProvider) {
      case 'gcloud':
        return googleTranslationAndRomanization({
          romanize,
          showTranslation,
          to,
          hideSourceLyrics,
        });

      case 'kuroshiro':
        return kuroshiroRomanization({ hideSourceLyrics });

      default:
        return null;
    }
  })();

  const translation = (() => {
    if (showTranslation !== false && romanizationProvider !== 'gcloud') {
      return googleTranslationAndRomanization({
        romanize,
        showTranslation,
        to,
        hideSourceLyrics,
      });
    }

    return null;
  })();

  return (lines) => {
    return of(lines).pipe(
      mergeMap((value) =>
        romanization !== null ? romanization(value) : of(value),
      ),
      mergeMap((value) =>
        translation !== null ? translation(value) : of(value),
      ),
    );
  };
};
