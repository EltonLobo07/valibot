import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types';
import { toSnakeCase, ToSnakeCaseAction } from './toSnakeCase';

describe('toSnakeCase', () => {
  type Input = {
    1: boolean;
    foo: boolean;
    helloWorld: boolean;
    fooBar: boolean;
    foo_bar: string;
    barFoo: boolean;
  };

  type Action1 = ToSnakeCaseAction<Input, undefined>;
  type Action2 = ToSnakeCaseAction<Input, ['foo', 'helloWorld', 'fooBar']>;

  describe('should return action object', () => {
    test('with undefined selected keys', () => {
      expectTypeOf(toSnakeCase<Input>()).toEqualTypeOf<Action1>();
    });

    test('with specific selected keys', () => {
      expectTypeOf(
        toSnakeCase<Input, ['foo', 'helloWorld', 'fooBar']>([
          'foo',
          'helloWorld',
          'fooBar',
        ])
      ).toEqualTypeOf<Action2>();
    });
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action1>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<Action2>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action1>>().toEqualTypeOf<{
        1: boolean;
        foo: boolean;
        hello_world: boolean;
        foo_bar: string;
        bar_foo: boolean;
      }>();
      expectTypeOf<InferOutput<Action2>>().toEqualTypeOf<{
        1: boolean;
        foo: boolean;
        hello_world: boolean;
        foo_bar: string;
        barFoo: boolean;
      }>();
      expectTypeOf<
        InferOutput<ToSnakeCaseAction<Input, ['foo_bar']>>
      >().toEqualTypeOf<{
        1: boolean;
        foo: boolean;
        helloWorld: boolean;
        fooBar: boolean;
        foo_bar: string;
        barFoo: boolean;
      }>();
      expectTypeOf<
        InferOutput<ToSnakeCaseAction<Input, ['foo_bar', 'fooBar']>>
      >().toEqualTypeOf<{
        1: boolean;
        foo: boolean;
        helloWorld: boolean;
        foo_bar: string;
        barFoo: boolean;
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action1>>().toEqualTypeOf<never>();
      expectTypeOf<InferIssue<Action2>>().toEqualTypeOf<never>();
    });
  });
});
