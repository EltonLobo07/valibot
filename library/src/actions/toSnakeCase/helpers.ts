/**
 * Converts a string to its snake case version.
 *
 * @param input The string to be converted to snake case.
 * @returns The snake case version of the input.
 */
export function snakeCase(input: string): string {
  const res: string[] = [];
  for (const ch of input) {
    let lowerCaseCh: string;
    res.push(
      res.length > 0 &&
        ch === ch.toUpperCase() &&
        ch !== (lowerCaseCh = ch.toLowerCase())
        ? `_${lowerCaseCh}`
        : ch
    );
  }
  return res.join('');
}
