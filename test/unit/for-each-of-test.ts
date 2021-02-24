/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.forEachOf handlers', () => {
  let handler: { handle: Function };
  let handle: Function;
  const filledArrays: (() => ({key: number}[] | AsyncGenerator<{key: number}, void, unknown>))[] =
  [
    () => [{ key: 1 }, { key: 2 }, { key: 3 }],
    // () => asyncIteratorOf([{ key: 1 }, { key: 2 }, { key: 3 }]),
  ];
  const mixedArrays: (() => (({key: string | Promise<string> } | Promise<{key: string | Promise<string> }>)[] | AsyncGenerator<{key: string} | Promise<{key: string}>, void, unknown>))[][] =
  [
    [() => [{ key: 'a' }, { key: 'b' }, { key: 'c' }]],
    // [() => [{ key: 'a' }, Promise.resolve({ key: 'b' }), { key: 'c' }]],
    // [() => [{ key: 'a' }, { key: Promise.resolve('b') }, { key: 'c' }]],
    // [() => asyncIteratorOf([{ key: 'a' }, Promise.resolve({ key: 'b' }), { key: 'c' }])],
  ];
  const matrix: ([string, { handle: Function }] | [string, { handle: Function }, (number | undefined)[]])[] = [
    ['async', IterableMethods.forEachOf],
    // ['series', IterableMethods.forEachOfSeries],
    // ['limit', IterableMethods.forEachOfLimit, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
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
            await each((v: Record<string, number>, key: string) => { val += v[key]; }) :
            await each((v: Record<string, number>, key: string) => { val += v[key]; }, arg);
          expect(val).toEqual(6);
        });

        test.each(mixedArrays)('concatenating string elements', async mixedArray => {
          const map = handle(null, mixedArray());
          let str = '';
          const found = arg === undefined ?
            await map((x: string) => { str += x; }, 'key') :
            await map((x: string) => { str += x; }, 'key', arg);
          expect(str).toEqual('abc');
        });

        test.each(getEmptyClass())('returns falsy results on empty iterators', async emtpyPath => {
          const each = handler.handle(null, emtpyPath);
          let called = false;
          // TODO: Make test stricter
          const found = arg === undefined ?
            await each(() => { called = true; }, 'key') :
            await each(() => { called = true; }, 'key', arg);
          expect(called).toEqual(false);
        });

        it('Should throw error on rejecting elements', () => {
          const each = handler.handle(null, [
            Promise.reject(Error('Reject: FOO')),
          ]);
          expect(() => each(() => true, 'key')).rejects.toThrow(Error('Reject: FOO'));
        });
      });
    }
  }
});
