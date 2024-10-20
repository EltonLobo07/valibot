import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

const POSSIBLE_JWT_REGEX = /^(?:[\w-]+\.){2}[\w-]+$/u;

// https://datatracker.ietf.org/doc/html/rfc7518#section-3.1
type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

/**
 * Jwt issue type.
 */
export interface JwtIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'jwt';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * Jwt action type.
 */
export interface JwtAction<
  TInput extends string,
  TJwtAlgorithm extends JwtAlgorithm | undefined,
  TMessage extends ErrorMessage<JwtIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, JwtIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'jwt';
  /**
   * The action reference.
   */
  readonly reference: typeof jwt;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The algorithm used to sign the jwt.
   */
  readonly algorithm: TJwtAlgorithm;
  /**
   * The error message.
   */
  readonly message: TMessage;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @returns A jwt action.
 */
export function jwt<TInput extends string>(): JwtAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param jwtAlgorithm The algorithm used to sign the jwt.
 *
 * @returns A jwt action.
 */
export function jwt<
  TInput extends string,
  TJwtAlgorithm extends JwtAlgorithm | undefined,
>(jwtAlgorithm: TJwtAlgorithm): JwtAction<TInput, TJwtAlgorithm, undefined>;

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param jwtAlgorithm The algorithm used to sign the jwt.
 * @param message The error message.
 *
 * @returns A jwt action.
 */
export function jwt<
  TInput extends string,
  TJwtAlgorithm extends JwtAlgorithm | undefined,
  const TMessage extends ErrorMessage<JwtIssue<TInput>> | undefined,
>(
  jwtAlgorithm: TJwtAlgorithm,
  message: TMessage
): JwtAction<TInput, TJwtAlgorithm, TMessage>;

export function jwt(
  jwtAlgorithm?: JwtAlgorithm | undefined,
  message?: ErrorMessage<JwtIssue<string>>
): JwtAction<
  string,
  JwtAlgorithm | undefined,
  ErrorMessage<JwtIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'jwt',
    reference: jwt,
    async: false,
    expects: null,
    message,
    algorithm: jwtAlgorithm,
    requirement(input) {
      if (!POSSIBLE_JWT_REGEX.test(input)) {
        return false;
      }
      try {
        // `atob`
        // - for node env, marked as legacy
        //     https://github.com/DefinitelyTyped/DefinitelyTyped/issues/65494
        // - assumes the passed input to be base64 encoded,
        //     will have to convert base64Url encoded header to base64
        const header = JSON.parse(atob(input.split('.')[0]));
        return (
          'typ' in header &&
          header.type === 'JWT' &&
          (!('alg' in header) || header.alg === (this.algorithm ?? 'none'))
        );
      } catch {
        return false;
      }
    },
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'jwt', dataset, config);
      }
      return dataset;
    },
  };
}
