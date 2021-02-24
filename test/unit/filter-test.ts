/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.filter handlers', () => {
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
    ['async', IterableMethods.filter],
    ['series', IterableMethods.filterSeries],
    ['limit', IterableMethods.filterLimit, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
  ];

  for (const [name, _handler, args = [undefined]] of matrix) {
    for (const arg of args) {
      describe(arg === undefined ? name : `${name} of ${arg}`, () => {
        beforeEach(() => {
          handler = _handler;
          // eslint-disable-next-line prefer-destructuring
          handle = handler.handle;
        });

        test.each(filledArrays)('filters element greater than 2.5 in normal array', async filledArray => {
          const filter = handle(null, filledArray());
          const found = arg === undefined ? await filter((x: number) => x > 2.5) : await filter((x: number) => x > 2.5, arg);
          expect(found).toEqual([3]);
        });

        test.each(filledArrays)('filters element greater than 1.5 in normal array', async filledArray => {
          const filter = handle(null, filledArray());
          const found = arg === undefined ? await filter((x: number) => x > 1.5) : await filter((x: number) => x > 1.5, arg);
          expect(found).toEqual([2, 3]);
        });

        test.each(filledArrays)('filters even elements in normal array', async filledArray => {
          const filter = handle(null, filledArray());
          const found = arg === undefined ? await filter((x: number) => x % 2 === 0) : await filter((x: number) => x % 2 === 0, arg);
          expect(found).toEqual([2]);
        });

        test.each(filledArrays)('filters odd elements in normal array', async filledArray => {
          const filter = handle(null, filledArray());
          const found = arg === undefined ? await filter((x: number) => x % 2 === 1) : await filter((x: number) => x % 2 === 1, arg);
          expect(found).toEqual([1, 3]);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding promised b)', async mixedArray => {
          const filter = handle(null, mixedArray());
          const found = arg === undefined ? await filter((x: string) => x == 'b') : await filter((x: string) => x == 'b', arg);
          expect(found).toEqual(['b']);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding static a)', async mixedArray => {
          const filter = handle(null, mixedArray());
          const found = arg === undefined ? await filter((x: string) => x == 'a') : await filter((x: string) => x == 'a', arg);
          expect(found).toEqual(['a']);
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding', async mixedArray => {
          const filter = handle(null, mixedArray());
          const found = arg === undefined ? await filter((x: string) => x == 'c') : await filter((x: string) => x == 'c', arg);
          expect(found).toEqual(['c']);
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const filter = handler.handle(null, emtpyPath);
          // TODO: Make test stricter
          const found = arg === undefined ? await filter(() => true) : await filter(() => true, arg);
          expect(found).toEqual([]);
        });

        it('Should throw error on rejecting elements', () => {
          const filter = handler.handle(null, [
            Promise.reject(Error('Reject: FOO')),
          ]);
          expect(() => filter(() => true)).rejects.toThrow(Error('Reject: FOO'));
        });
      });
    }
  }

  describe('making sure series find gets first valid result in array', () => {
    it('finds element greater than 2.5', async () => {
      const find = IterableMethods.filterSeries.handle(null, [-1, -2, -3, 1, 2, 3, 4, 5, 6, 7, 4, 5]);
      expect(await find((x: number) => x > 2.5)).toEqual([3, 4, 5, 6, 7, 4, 5]);
    });
  });

  describe('making sure find limit with 1 thread returns the first valid result in array', () => {
    it('finds element greater than 2.5', async () => {
      const find = IterableMethods.filterLimit.handle(null, [-1, -2, -3, 1, 2, 3, 4, 5, 6, 7, 4, 5]);
      expect(await find((x: number) => x > 2.5)).toEqual([3, 4, 5, 6, 7, 4, 5]);
    });
  });
});
