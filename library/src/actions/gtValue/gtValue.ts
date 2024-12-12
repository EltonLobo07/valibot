import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _stringify } from '../../utils/index.ts';
import type { ValueInput } from '../types.ts';

/**
 * Gt value issue type.
 */
export interface GtValueIssue<
  TInput extends ValueInput,
  TRequirement extends ValueInput,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'gt_value';
  /**
   * The expected property.
   */
  readonly expected: `>${string}`;
  /**
   * The greater than value.
   */
  readonly requirement: TRequirement;
}

/**
 * Gt value action type.
 */
export interface GtValueAction<
  TInput extends ValueInput,
  TRequirement extends TInput,
  TMessage extends ErrorMessage<GtValueIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, GtValueIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'gt_value';
  /**
   * The action reference.
   */
  readonly reference: typeof gtValue;
  /**
   * The expected property.
   */
  readonly expects: `>${string}`;
  /**
   * The greater than value.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a gt value validation action.
 *
 * @param requirement The greater than value.
 *
 * @returns A gt value action.
 */
export function gtValue<
  TInput extends ValueInput,
  const TRequirement extends TInput,
>(requirement: TRequirement): GtValueAction<TInput, TRequirement, undefined>;

/**
 * Creates a gt value validation action.
 *
 * @param requirement The greater than value.
 * @param message The error message.
 *
 * @returns A gt value action.
 */
export function gtValue<
  TInput extends ValueInput,
  const TRequirement extends TInput,
  const TMessage extends
    | ErrorMessage<GtValueIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): GtValueAction<TInput, TRequirement, TMessage>;

export function gtValue(
  requirement: ValueInput,
  message?: ErrorMessage<GtValueIssue<ValueInput, ValueInput>>
): GtValueAction<
  ValueInput,
  ValueInput,
  ErrorMessage<GtValueIssue<ValueInput, ValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'gt_value',
    reference: gtValue,
    async: false,
    expects: `>${
      requirement instanceof Date
        ? requirement.toJSON()
        : _stringify(requirement)
    }`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !(dataset.value > this.requirement)) {
        _addIssue(this, 'value', dataset, config, {
          received:
            dataset.value instanceof Date
              ? dataset.value.toJSON()
              : _stringify(dataset.value),
        });
      }
      return dataset;
    },
  };
}