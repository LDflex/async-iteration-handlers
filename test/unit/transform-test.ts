/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.transform handlers', () => {
  let handler: { handle: Function };
  let handle: Function;
  const filledArrays: (() => (number[] | AsyncGenerator<number, void, unknown>))[] =
  [
    () => [1, 2, 3],
    () => asyncIteratorOf([1, 2, 3]),
  ];
  const mixedArrays: (() => ((string | Promise<string>)[] | AsyncGenerator<string | Promise<string>, void, unknown>))[][] =
  [
    [() => ['a', Promise.resolve('b'), 'c']],
    [() => asyncIteratorOf(['a', Promise.resolve('b'), 'c'])],
  ];
  const matrix: ([string, { handle: Function }] | [string, { handle: Function }, (number | undefined)[]])[] = [
    // ['async', IterableMethods.transform],
  ];

  for (const [name, _handler, args = [undefined]] of matrix) {
    for (const arg of args) {
      describe(arg === undefined ? name : `${name} of ${arg}`, () => {
        beforeEach(() => {
          handler = _handler;
          // eslint-disable-next-line prefer-destructuring
          handle = handler.handle;
        });

        test.each(filledArrays)('maps to boolean result determining whether elem is > 2.5', async filledArray => {
          const map = handle(null, filledArray());
          const found = arg === undefined ? await map((x: number) => x > 2.5) : await map((x: number) => x > 2.5, arg);
          expect(found).toEqual([false, false, true]);
        });

        test.each(filledArrays)('adds one to each element of the array', async filledArray => {
          const map = handle(null, filledArray());
          const found = arg === undefined ? await map((x: number) => x + 1) : await map((x: number) => x + 1, arg);
          expect(found).toEqual([2, 3, 4]);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding promised b)', async mixedArray => {
          const map = handle(null, mixedArray());
          const found = arg === undefined ? await map((x: string) => x == 'b') : await map((x: string) => x == 'b', arg);
          expect(found).toEqual([false, true, false]);
        });

        test.each(mixedArrays)('edits string value', async mixedArray => {
          const map = handle(null, mixedArray());
          const found = arg === undefined ? await map((x: string) => `${x}an`) : await map((x: string) => `${x}an`, arg);
          expect(found).toEqual(['aan', 'ban', 'can']);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding static a)', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'a') : await find((x: string) => x == 'a', arg);
          expect(found).toEqual([true, false, false]);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding', async mixedArray => {
          const map = handle(null, mixedArray());
          const found = arg === undefined ? await map((x: string) => x == 'c') : await map((x: string) => x == 'c', arg);
          expect(found).toEqual([false, false, true]);
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const map = handler.handle(null, emtpyPath);
          // TODO: Make test stricter
          const found = arg === undefined ? await map(() => true) : await map(() => true, arg);
          expect(found).toEqual([]);
        });

        it('Should throw error on rejecting elements', () => {
          const map = handler.handle(null, [
            Promise.reject(Error('Reject: FOO')),
          ]);
          expect(() => map(() => true)).rejects.toThrowError(Error('Reject: FOO'));
        });
      });
    }
  }
});
