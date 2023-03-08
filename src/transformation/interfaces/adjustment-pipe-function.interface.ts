import { AdjustmentLyricsDto } from '../dto/adjustment-lyrics.dto.js';

export type AdjustmentPipeFunction = (
  data: AdjustmentLyricsDto,
) => AdjustmentLyricsDto;
