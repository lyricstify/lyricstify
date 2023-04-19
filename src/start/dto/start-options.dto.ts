import { PipeOptionsDto } from '../../pipe/dto/pipe-options.dto.js';
import { HorizontalAlignChoicesType } from '../../transformation/types/horizontal-align-choices.type.js';

export class StartOptionsDto extends PipeOptionsDto {
  verticalSpacing: number | undefined;
  highlightMarkup: string;
  horizontalAlign: HorizontalAlignChoicesType;

  constructor({
    verticalSpacing,
    romanize,
    romanizationProvider,
    translateTo,
    highlightMarkup,
    delay,
    horizontalAlign,
    syncType,
    hideSourceLyrics,
  }: StartOptionsDto) {
    super({
      romanize,
      romanizationProvider,
      translateTo,
      delay,
      syncType,
      hideSourceLyrics,
    });
    this.verticalSpacing = verticalSpacing;
    this.highlightMarkup = highlightMarkup;
    this.horizontalAlign = horizontalAlign;
  }
}
