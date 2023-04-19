import { RomanizationProviderChoicesType } from '../types/romanization-provider-choices.type.js';

export class CreateInitializationPipesDto {
  spaceBetweenLines: number | false;
  romanizeSentences: boolean;
  romanizationProvider: RomanizationProviderChoicesType | false;
  translateSentences: string | false;
  hideSourceLyrics: boolean;

  constructor({
    spaceBetweenLines,
    romanizeSentences,
    romanizationProvider,
    translateSentences,
    hideSourceLyrics,
  }: Omit<CreateInitializationPipesDto, 'spaceBetweenLines'> & {
    spaceBetweenLines: false | number | undefined;
  }) {
    if (spaceBetweenLines === undefined) {
      this.spaceBetweenLines =
        romanizeSentences !== false || translateSentences !== false ? 1 : false;
    } else {
      this.spaceBetweenLines = spaceBetweenLines;
    }
    this.romanizeSentences = romanizeSentences;
    this.romanizationProvider = romanizationProvider;
    this.translateSentences = translateSentences;
    this.hideSourceLyrics = hideSourceLyrics;
  }
}
