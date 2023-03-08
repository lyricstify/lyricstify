export class CreateInitializationPipesDto {
  spaceBetweenLines: number;
  romanizeJapaneseSentences: boolean;
  translateSentences: string | false;

  constructor({
    spaceBetweenLines = null,
    romanizeJapaneseSentences = false,
    translateSentences = false,
  }: Partial<
    Omit<CreateInitializationPipesDto, 'spaceBetweenLines'> & {
      spaceBetweenLines: null | number;
    }
  >) {
    this.spaceBetweenLines =
      spaceBetweenLines ||
      (romanizeJapaneseSentences !== false || translateSentences !== false
        ? 1
        : 0);
    this.romanizeJapaneseSentences = romanizeJapaneseSentences;
    this.translateSentences = translateSentences;
  }
}
