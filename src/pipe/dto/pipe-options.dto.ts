export class PipeOptionsDto {
  romaji: boolean;
  translateTo: string | false;
  delay: number;

  constructor({ romaji, translateTo, delay }: PipeOptionsDto) {
    this.romaji = romaji;
    this.translateTo = translateTo;
    this.delay = delay;
  }
}
