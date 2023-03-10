export class CreateUpdateProgressPipesDto {
  highlightMarkup: string;

  constructor({ highlightMarkup }: CreateUpdateProgressPipesDto) {
    this.highlightMarkup = highlightMarkup;
  }
}
