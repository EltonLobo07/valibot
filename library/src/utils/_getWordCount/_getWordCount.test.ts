import { describe, expect, test } from 'vitest';
import { _getWordCount } from './_getWordCount.ts';

describe('_getWordCount', () => {
  test('should return word count', () => {
    expect(_getWordCount('en', '')).toBe(0);
    expect(_getWordCount('en', 'h')).toBe(1);
    expect(_getWordCount('en', 'hello')).toBe(1);
    expect(_getWordCount('en', 'hello world')).toBe(2);
    expect(_getWordCount('en', '🧑🏻‍💻')).toBe(0);
    expect(_getWordCount('th', 'สวัสดี')).toBe(1);
  });

  test('should take locale into account', () => {
    expect(_getWordCount('en', 'foo:bar baz:qux')).toBe(4);
    expect(_getWordCount('sv', 'foo:bar baz:qux')).toBe(2);
  });
});