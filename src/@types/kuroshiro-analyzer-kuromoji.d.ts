// TODO: Open PR to DefinitelyTyped.
declare module 'kuroshiro-analyzer-kuromoji' {
  interface KuromojiAnalyzerOptions {
    dicPath: string;
  }

  type IpadicFeatures = import('kuromoji').IpadicFeatures;
  type KuromojiAnalyzerParseVerbose = 'word_id' | 'word_type' | 'word_position';

  interface KuromojiAnalyzerParseResult
    extends Omit<IpadicFeatures, KuromojiAnalyzerParseVerbose> {
    verbose: Pick<IpadicFeatures, KuromojiAnalyzerParseVerbose>;
  }

  export default class KuromojiAnalyzer
    implements import('KuroshiroAnalyzerInterface')
  {
    constructor(options?: KuromojiAnalyzerOptions);
    /**
     * Initialize the analyzer.
     */
    init(): Promise<void>;
    /**
     * Parse the given text.
     *
     * @example The result of parsing
     * [{
     *   "surface_form": "黒白",    // 表層形
     *   "pos": "名詞",               // 品詞 (part of speech)
     *   "pos_detail_1": "一般",      // 品詞細分類1
     *   "pos_detail_2": "*",        // 品詞細分類2
     *   "pos_detail_3": "*",        // 品詞細分類3
     *   "conjugated_type": "*",     // 活用型
     *   "conjugated_form": "*",     // 活用形
     *   "basic_form": "黒白",      // 基本形
     *   "reading": "クロシロ",       // 読み
     *   "pronunciation": "クロシロ",  // 発音
     *   "verbose": {                 // Other properties
     *     "word_id": 413560,
     *     "word_type": "KNOWN",
     *     "word_position": 1
     *   }
     * }]
     */
    parse(text?: string): Promise<KuromojiAnalyzerParseResult>;
  }
}
