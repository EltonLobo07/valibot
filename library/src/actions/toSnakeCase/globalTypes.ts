/**
 * Object input type.
 */
export type ObjectInput = Record<string | number | symbol, unknown>;

/**
 * Selected string keys type.
 */
export type StringKeyTuples<T extends ObjectInput> = UnionToTuples<
  ExtractStringKeys<T>
>;

/**
 * Is never type.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * String tuple to union type.
 */
export type StringTupleToUnion<
  T extends string[] | undefined,
  TResult extends string = never,
> = T extends [infer TCh extends string, ...infer TRemaining extends string[]]
  ? StringTupleToUnion<TRemaining, TCh | TResult>
  : TResult;

/**
 * Extract string keys type.
 */
type ExtractStringKeys<T extends ObjectInput> = keyof {
  [K in keyof T as K extends string ? K : never]: T[K];
} &
  string;

/**
 * Union to tuples type.
 */
type UnionToTuples<
  TInput extends string,
  TResult extends string[] = never,
  TInputCopy extends string = TInput,
> =
  IsNever<TInput> extends true
    ? TResult
    : // conditional type for the distributive property
      // See: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
      TInput extends any
      ? UnionToTuples<
          Exclude<TInputCopy, TInput>,
          TResult | [TInput] | [...TResult, TInput]
        >
      : never;
