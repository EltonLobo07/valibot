import { describe, expect, test } from 'vitest';
import { transformAsync } from '../../actions/index.ts';
import { number } from '../../schemas/index.ts';
import { pipeAsync } from '../pipe/index.ts';
import {
  fallbackAsync,
  type SchemaWithFallbackAsync,
} from './fallbackAsync.ts';

describe('fallbackAsync', () => {
  describe('should return schema object', () => {
    const schema = pipeAsync(
      number(),
      transformAsync(async (input) => String(input))
    );
    type Schema = typeof schema;
    const baseSchema: Omit<
      SchemaWithFallbackAsync<Schema, never>,
      'fallback'
    > = {
      ...schema,
      async: true,
      _run: expect.any(Function),
    };

    test('with value fallback', () => {
      expect(fallbackAsync(schema, '123')).toStrictEqual({
        ...baseSchema,
        fallback: '123',
      } satisfies SchemaWithFallbackAsync<Schema, '123'>);
    });

    test('with function fallback', () => {
      const fallbackArg = () => '123';
      expect(fallbackAsync(schema, fallbackArg)).toStrictEqual({
        ...baseSchema,
        fallback: fallbackArg,
      } satisfies SchemaWithFallbackAsync<Schema, typeof fallbackArg>);
    });

    test('with async function fallback', () => {
      const fallbackArg = async () => '123';
      expect(fallbackAsync(schema, fallbackArg)).toStrictEqual({
        ...baseSchema,
        fallback: fallbackArg,
      } satisfies SchemaWithFallbackAsync<Schema, typeof fallbackArg>);
    });
  });

  const schema = fallbackAsync(
    pipeAsync(
      number(),
      transformAsync(async (input) => String(input))
    ),
    async () => '123'
  );

  describe('should return default dataset', () => {
    test('for valid input', async () => {
      expect(await schema._run({ typed: false, value: 789 }, {})).toStrictEqual(
        {
          typed: true,
          value: '789',
        }
      );
    });
  });

  describe('should return dataset with fallback', () => {
    test('for invalid input', async () => {
      expect(
        await schema._run({ typed: false, value: 'foo' }, {})
      ).toStrictEqual({
        typed: true,
        value: '123',
      });
    });
  });
});
