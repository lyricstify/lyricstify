import { Injectable } from '@nestjs/common';
import { CreateAdjustmentPipesDto } from './dto/create-adjustment-pipes.dto.js';
import { CreateInitializationPipesDto } from './dto/create-initialization-pipes.dto.js';
import { CreateUpdateProgressPipesDto } from './dto/create-update-progress-pipes.dto.js';
import { AdjustmentPipeFunction } from './interfaces/adjustment-pipe-function.interface.js';
import { InitializationPipeFunction } from './interfaces/initialization-pipe-function.interface.js';
import { UpdateProgressPipeFunction } from './interfaces/update-progress-pipe-function.interface.js';
import { horizontalAlignCenter } from './pipes/adjustment-phase/horizontal-align-center.pipe.js';
import { verticalAlignCenter } from './pipes/adjustment-phase/vertical-align-center.pipe.js';
import { wordWrap } from './pipes/adjustment-phase/word-wrap.pipe.js';
import { addSpaceBetweenLines } from './pipes/initialization-phase/add-spaces-between-lines.pipe.js';
import { romanizeJapaneseSentences } from './pipes/initialization-phase/romanize-japanese-sentences.pipe.js';
import { translateSentences } from './pipes/initialization-phase/translate-sentences.pipe.js';
import { highlightActiveLyricsCenteredVertically } from './pipes/update-progress-phase/highlight-vertical-center-lyrics.pipe.js';

@Injectable()
export class TransformationService {
  initializationPipesFrom(
    createInitializationPipeDto: CreateInitializationPipesDto,
  ): InitializationPipeFunction[] {
    return ([] as InitializationPipeFunction[])
      .concat(
        addSpaceBetweenLines(createInitializationPipeDto.spaceBetweenLines),
      )
      .concat(
        createInitializationPipeDto.romanizeJapaneseSentences === true
          ? romanizeJapaneseSentences
          : [],
      )
      .concat(
        createInitializationPipeDto.translateSentences !== false
          ? translateSentences(createInitializationPipeDto.translateSentences)
          : [],
      );
  }

  adjustmentPipesFrom(
    createAdjustmentPipesDto: CreateAdjustmentPipesDto,
  ): AdjustmentPipeFunction[] {
    return [
      wordWrap,
      horizontalAlignCenter(createAdjustmentPipesDto.indentationChar),
      verticalAlignCenter,
    ];
  }

  updateProgressPipesFrom(
    createUpdateProgressPipesDto: CreateUpdateProgressPipesDto,
  ): UpdateProgressPipeFunction[] {
    return [
      highlightActiveLyricsCenteredVertically(
        createUpdateProgressPipesDto.highlightMarkup,
      ),
    ];
  }
}
