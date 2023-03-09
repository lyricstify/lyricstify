export class CreateUpdateProgressPipesDto {
  highlightMarkup: string;

  constructor({
    highlightMarkup = '^+',
  }: Partial<CreateUpdateProgressPipesDto>) {
    this.highlightMarkup = highlightMarkup;
  }
}
