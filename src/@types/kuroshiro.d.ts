// TODO: Open PR to DefinitelyTyped.
declare module 'kuroshiro' {
  interface KuroshiroAnalyzerInterface {
    /**
     * Initialize the analyzer.
     */
    init(): Promise<void>;
    /**
     * Parse the given text.
     *
     */
    parse(text?: string): Promise<unknown>;
  }

  interface KuroshiroConvertOptions {
    /**
     * Target syllabary.
     *
     * @default 'hiragana'
     */
    to?: 'hiragana' | 'katakana' | 'romaji';
    /**
     * Convert mode.
     *
     * @default 'normal'
     */
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    /**
     * Romanization System.
     *
     * @default 'hepburn'
     */
    romajiSystem?: 'nippon' | 'passport' | 'hepburn';
    /**
     * Start delimiter.
     *
     * @default '('
     */
    delimiter_start?: string;
    /**
     * End delimiter.
     *
     * @default ')'
     */
    delimiter_end?: string;
  }

  type KuroshiroUtilCheckerFunction = (char: string) => boolean;
  type KuroshiroUtilConverterFunction = (char: string) => string;

  export default class Kuroshiro {
    static Util: {
      /**
       * Check if input char is hiragana.
       */
      isHiragana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input char is katakana.
       */
      isKatakana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input char is kana.
       */
      isKana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input char is kanji.
       */
      isKanji: KuroshiroUtilCheckerFunction;
      /**
       * Check if input char is Japanese.
       */
      isJapanese: KuroshiroUtilCheckerFunction;
      /**
       * Check if input string has hiragana.
       */
      hasHiragana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input string has katakana.
       */
      hasKatakana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input string has kana.
       */
      hasKana: KuroshiroUtilCheckerFunction;
      /**
       * Check if input string has kanji.
       */
      hasKanji: KuroshiroUtilCheckerFunction;
      /**
       * Check if input string has Japanese.
       */
      hasJapanese: KuroshiroUtilCheckerFunction;
      /**
       * Convert input kana string to hiragana.
       */
      kanaToHiragna: KuroshiroUtilConverterFunction;
      /**
       * Convert input kana string to katakana.
       */
      kanaToKatakana: KuroshiroUtilConverterFunction;
      /**
       * Convert input kana string to romaji.
       */
      kanaToRomaji(
        ...args: Parameters<KuroshiroUtilConverterFunction>,
        system: 'nippon' | 'passport' | 'hepburn',
      ): ReturnType<KuroshiroUtilConverterFunction>;
    };

    /**
     * Initialize Kuroshiro.
     */
    init(analyzer: KuroshiroAnalyzerInterface): Promise<void>;
    /**
     * Convert given string to target syllabary with options available.
     */
    convert(text: string, options?: KuroshiroConvertOptions): Promise<string>;
  }
}
