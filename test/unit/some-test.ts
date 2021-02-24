/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.some handlers', () => {
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
    ['async', IterableMethods.some],
    ['series', IterableMethods.someSeries],
    ['limit', IterableMethods.someLimit, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
  ];

  for (const [name, _handler, args = [undefined]] of matrix) {
    for (const arg of args) {
      describe(arg === undefined ? name : `${name} of ${arg}`, () => {
        beforeEach(() => {
          handler = _handler;
          // eslint-disable-next-line prefer-destructuring
          handle = handler.handle;
        });

        test.each(filledArrays)('finds element greater than 2.5 in normal array', async filledArray => {
          const find = handle(null, filledArray());
          const found = arg === undefined ? await find((x: number) => x > 2.5) : await find((x: number) => x > 2.5, arg);
          expect(found).toEqual(true);
        });

        test.each(filledArrays)('no element greater than 4.5 in normal array', async filledArray => {
          const find = handle(null, filledArray());
          const found = arg === undefined ? await find((x: number) => x > 4.5) : await find((x: number) => x > 4.5, arg);
          expect(found).toEqual(false);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding promised b)', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'b') : await find((x: string) => x == 'b', arg);
          expect(found).toEqual(true);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding static a)', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'a') : await find((x: string) => x == 'a', arg);
          expect(found).toEqual(true);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'c') : await find((x: string) => x == 'c', arg);
          expect(found).toEqual(true);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 's') : await find((x: string) => x == 's', arg);
          expect(found).toEqual(false);
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const find = handler.handle(null, emtpyPath);
          // TODO: Make test stricter
          const found = arg === undefined ? await find(() => true) : await find(() => true, arg);
          expect(found).toBeFalsy();
        });

        it('Should throw error on rejecting elements', () => {
          const some = handler.handle(null, [
            Promise.reject(Error('Reject: FOO')),
          ]);
          expect(() => some(() => true)).rejects.toThrow(Error('Reject: FOO'));
        });
      });
    }
  }
});
