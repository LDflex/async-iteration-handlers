/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.find handlers', () => {
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
    ['async', IterableMethods.find],
    ['series', IterableMethods.findSeries],
    ['limit', IterableMethods.findLimit, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
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
          expect(found).toEqual(3);
        });

        // FUTURE WORK: Get this test working (it currently doesnt due the the behavior of async iterators)
        // test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding promised b)', async mixedArray => {
        //   const find = handle(null, mixedArray());
        //   expect(await find((x: string) => x == 'a')).toEqual('a');
        //   expect(await find((x: string) => x == 'b')).toEqual('b');
        //   expect(await find((x: string) => x == 'c')).toEqual('c');
        // });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding promised b)', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'b') : await find((x: string) => x == 'b', arg);
          expect(found).toEqual('b');
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding static a)', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'a') : await find((x: string) => x == 'a', arg);
          expect(found).toEqual('a');
        });

        test.each(mixedArrays)('check behavior on array with mix of promised and static elements (finding', async mixedArray => {
          const find = handle(null, mixedArray());
          const found = arg === undefined ? await find((x: string) => x == 'c') : await find((x: string) => x == 'c', arg);
          expect(found).toEqual('c');
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const find = handler.handle(null, emtpyPath);
          // TODO: Make test stricter
          const found = arg === undefined ? await find(() => true) : await find(() => true, arg);
          expect(found).toBeFalsy();
        });
      });
    }
  }

  describe('making sure series find gets first valid result in array', () => {
    it('finds element greater than 2.5', async () => {
      const find = IterableMethods.findSeries.handle(null, [-1, -2, -3, 1, 2, 3, 4, 5, 6, 7, 4, 5]);
      expect(await find((x: number) => x > 2.5)).toEqual(3);
    });
  });

  describe('making sure find limit with 1 thread returns the first valid result in array', () => {
    it('finds element greater than 2.5', async () => {
      const find = IterableMethods.findLimit.handle(null, [-1, -2, -3, 1, 2, 3, 4, 5, 6, 7, 4, 5]);
      expect(await find((x: number) => x > 2.5, 1)).toEqual(3);
    });
  });
});
