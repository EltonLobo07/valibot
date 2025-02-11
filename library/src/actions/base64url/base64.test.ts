import { describe, expect, test } from 'vitest';
import { BASE64URL_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  base64url,
  type Base64urlAction,
  type Base64urlIssue,
} from './base64url.ts';

describe('base64url', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Base64urlAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'base64url',
      reference: base64url,
      expects: null,
      requirement: BASE64URL_REGEX,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Base64urlAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(base64url()).toStrictEqual(action);
      expect(base64url(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(base64url('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Base64urlAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(base64url(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Base64urlAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = base64url();

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for empty string', () => {
      expectNoActionIssue(action, ['']);
    });

    test('for Base64url strings', () => {
      expectNoActionIssue(action, [
        // ---- Necessary valid test vectors from https://datatracker.ietf.org/doc/html/rfc4648#section-10 ----
        // 'f'
        'Zg==',
        'Zg',
        // 'fo'
        'Zm8=',
        'Zm8',
        // 'foo'
        'Zm9v',
        // 'foob'
        'Zm9vYg==',
        'Zm9vYg',
        // 'fooba'
        'Zm9vYmE=',
        'Zm9vYmE',
        // 'foobar'
        'Zm9vYmFy',
        // ---- Other custom tests ----
        // ÿÿÿy
        'w7_Dv8O_eQ==',
        'w7_Dv8O_eQ',
        // ~test~123v
        'fnRlc3R-MTIzdg==',
        'fnRlc3R-MTIzdg',
        // valibot
        'dmFsaWJvdA==',
        'dmFsaWJvdA',
        // 🌮
        '8J-Mrg==',
        '8J-Mrg',
        // 1234567890
        'MTIzNDU2Nzg5MA==',
        'MTIzNDU2Nzg5MA',
        // ~`!@#$%^&*()_-+={[}]\|;:"',<.>/?
        'fmAhQCMkJV4mKigpXy0rPXtbfV1cfDs6IicsPC4-Lz8=',
        'fmAhQCMkJV4mKigpXy0rPXtbfV1cfDs6IicsPC4-Lz8',
        // Hello, I am Valibot and I would like to help you validate data easily using a schema.
        'SGVsbG8sIEkgYW0gVmFsaWJvdCBhbmQgSSB3b3VsZCBsaWtlIHRvIGhlbHAgeW91IHZhbGlkYXRlIGRhdGEgZWFzaWx5IHVzaW5nIGEgc2NoZW1hLg==',
        'SGVsbG8sIEkgYW0gVmFsaWJvdCBhbmQgSSB3b3VsZCBsaWtlIHRvIGhlbHAgeW91IHZhbGlkYXRlIGRhdGEgZWFzaWx5IHVzaW5nIGEgc2NoZW1hLg',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = base64url('message');
    const baseIssue: Omit<Base64urlIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'base64url',
      expected: null,
      message: 'message',
      requirement: BASE64URL_REGEX,
    };

    test('for blank strings', () => {
      expectActionIssue(action, baseIssue, [' ', '\n']);
    });

    test('for invalid chars', () => {
      expectActionIssue(action, baseIssue, [
        'foo`', // `
        'foo~', // ~
        'foo!', // !
        'foo@', // @
        'foo#', // #
        'foo$', // $
        'foo%', // %
        'foo^', // ^
        'foo&', // &
        'foo*', // *
        'foo(', // (
        'foo)', // )
        'foo+', // +
        'foo[', // [
        'foo]', // ]
        'foo{', // {
        'foo}', // }
        'foo\\', // \
        'foo|', // |
        'foo;', // ;
        'foo:', // :
        "foo'", // '
        'foo"', // "
        'foo,', // ,
        'foo.', // .
        'foo<', // <
        'foo>', // >
        'foo?', // ?
        'foo/', // /
      ]);
    });

    test('for invalid padding', () => {
      expectActionIssue(action, baseIssue, [
        'dmFsaWJvdA=', // = missing
        'dmFsaWJvdA===', // = extra
        'Zm9vYmE==', // = extra
      ]);
    });

    test('for invalid length or character position', () => {
      expectActionIssue(action, baseIssue, [
        '12345', // contains 5 characters
        'a==A', // `=` is used in between the characters
      ]);
    });
  });
});
