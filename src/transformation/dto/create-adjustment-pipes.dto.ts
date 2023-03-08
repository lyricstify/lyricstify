export class CreateAdjustmentPipesDto {
  indentationChar: string;

  constructor({ indentationChar = ' ' }: Partial<CreateAdjustmentPipesDto>) {
    this.indentationChar = indentationChar;
  }
}
