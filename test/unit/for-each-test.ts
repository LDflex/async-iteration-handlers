/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.forEach handlers', () => {
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
    ['async', IterableMethods.forEach],
    ['series', IterableMethods.forEachSeries],
    ['limit', IterableMethods.forEachLimit, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
  ];

  for (const [name, _handler, args = [undefined]] of matrix) {
    for (const arg of args) {
      describe(arg === undefined ? name : `${name} of ${arg}`, () => {
        beforeEach(() => {
          handler = _handler;
          // eslint-disable-next-line prefer-destructuring
          handle = handler.handle;
        });

        test.each(filledArrays)('summing all values in the array', async filledArray => {
          const each = handle(null, filledArray());
          let val = 0;
          const found = arg === undefined ?
            await each((x: number) => { val += x; }) :
            await each((x: number) => { val += x; }, arg);
          expect(val).toEqual(6);
          expect(found).toBe(undefined);
        });

        test.each(mixedArrays)('concatenating string elements', async mixedArray => {
          const map = handle(null, mixedArray());
          let str = '';
          const found = arg === undefined ?
            await map((x: string) => { str += x; }) :
            await map((x: string) => { str += x; }, arg);
          expect(str).toEqual('abc');
          expect(found).toBe(undefined);
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const each = handler.handle(null, emtpyPath);
          let called = false;
          // TODO: Make test stricter
          const found = arg === undefined ?
            await each(() => { called = true; }) :
            await each(() => { called = true; }, arg);
          expect(called).toEqual(false);
          expect(found).toBe(undefined);
        });

        it('Should throw error on rejecting elements', () => {
          const each = handler.handle(null, [
            Promise.reject(Error('Reject: FOO')),
          ]);
          expect(() => each(() => true)).rejects.toThrowError(Error('Reject: FOO'));
        });
      });
    }
  }
});
