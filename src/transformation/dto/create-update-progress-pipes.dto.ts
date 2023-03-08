export class CreateUpdateProgressPipesDto {
  highlightMarkup: string;

  constructor({
    highlightMarkup = '^B',
  }: Partial<CreateUpdateProgressPipesDto>) {
    this.highlightMarkup = highlightMarkup;
  }
}
