import * as terminalKit from 'terminal-kit';

export const splitStringByWidth = (
  text: string,
  options: { width: number },
) => {
  return [...text].reduce((acc: string[], char) => {
    const charWidth = terminalKit.stringWidth(char);
    const lastChar = acc.at(-1) ?? '';
    const lastCharWidth = terminalKit.stringWidth(lastChar);

    if (lastCharWidth + charWidth < options.width) {
      const previousChars = acc.slice(0, -1);

      return [...previousChars, `${lastChar}${char}`];
    }

    return [...acc, char];
  }, []);
};
