export class CreateInitializationPipesDto {
  spaceBetweenLines: number | false;
  romanizeJapaneseSentences: boolean;
  translateSentences: string | false;

  constructor({
    spaceBetweenLines = false,
    romanizeJapaneseSentences = false,
    translateSentences = false,
  }: Partial<
    Omit<CreateInitializationPipesDto, 'spaceBetweenLines'> & {
      spaceBetweenLines: false | number | undefined;
    }
  >) {
    if (spaceBetweenLines === undefined) {
      this.spaceBetweenLines =
        romanizeJapaneseSentences !== false || translateSentences !== false
          ? 1
          : false;
    } else {
      this.spaceBetweenLines = spaceBetweenLines;
    }
    this.romanizeJapaneseSentences = romanizeJapaneseSentences;
    this.translateSentences = translateSentences;
  }
}
