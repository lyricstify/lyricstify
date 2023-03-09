import { PipeOptionsDto } from '../../pipe/dto/pipe-options.dto.js';

export class StartOptionsDto extends PipeOptionsDto {
  verticalSpacing: number | undefined;
  indentationChar: string;
  highlightMarkup: string;

  constructor({
    verticalSpacing,
    romaji,
    translateTo,
    indentationChar,
    highlightMarkup,
    delay,
  }: StartOptionsDto) {
    super({ romaji, translateTo, delay });
    this.verticalSpacing = verticalSpacing;
    this.indentationChar = indentationChar;
    this.highlightMarkup = highlightMarkup;
  }
}
