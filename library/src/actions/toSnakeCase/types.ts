import type {
  IsNever,
  ObjectInput,
  StringKeyTuples,
  StringTupleToUnion,
} from './globalTypes.ts';

/**
 * Internal output type.
 */
type _Output<
  TInput extends ObjectInput,
  TSelectedKeys extends StringKeyTuples<TInput> | undefined,
  // helper type parameters to reduce computation
  TSelectedUnion extends string = StringTupleToUnion<TSelectedKeys>,
  TSelectedUnionIsNever extends boolean = IsNever<TSelectedUnion>,
> = {
  [K in keyof TInput as K extends string
    ? TSelectedUnionIsNever extends true
      ? ToSnakeCase<K>
      : K extends TSelectedUnion
        ? ToSnakeCase<K>
        : K
    : K]: TInput[K];
};

/**
 * Output type.
 */
export type Output<
  TInput extends ObjectInput,
  TSelectedKeys extends StringKeyTuples<TInput> | undefined,
> = _Output<TInput, TSelectedKeys>;

/**
 * To snake case type.
 */
type ToSnakeCase<
  TInput extends string,
  TResult extends string = '',
> = TInput extends `${infer TCh}${infer TRemaining}`
  ? ToSnakeCase<
      TRemaining,
      `${TResult}${TResult extends '' ? TCh : TCh extends Uppercase<TCh> ? (TCh extends Lowercase<TCh> ? TCh : `_${Lowercase<TCh>}`) : TCh}`
    >
  : TResult;
