import { HorizontalAlignChoicesType } from '../types/horizontal-align-choices.type.js';

export class CreateAdjustmentPipesDto {
  horizontalAlign: HorizontalAlignChoicesType;

  constructor({ horizontalAlign }: CreateAdjustmentPipesDto) {
    this.horizontalAlign = horizontalAlign;
  }
}
