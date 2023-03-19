import { PipeOptionsDto } from '../../pipe/dto/pipe-options.dto.js';
import { HorizontalAlignChoicesType } from '../../transformation/types/horizontal-align-choices.type.js';

export class StartOptionsDto extends PipeOptionsDto {
  verticalSpacing: number | undefined;
  highlightMarkup: string;
  horizontalAlign: HorizontalAlignChoicesType;

  constructor({
    verticalSpacing,
    romaji,
    translateTo,
    highlightMarkup,
    delay,
    horizontalAlign,
    syncType,
  }: StartOptionsDto) {
    super({ romaji, translateTo, delay, syncType });
    this.verticalSpacing = verticalSpacing;
    this.highlightMarkup = highlightMarkup;
    this.horizontalAlign = horizontalAlign;
  }
}
