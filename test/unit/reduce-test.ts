/* eslint eqeqeq: off, no-loop-func: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';
import { asyncIteratorOf, getEmptyClass } from '../util';

describe('.reduce handlers', () => {
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

  beforeEach(() => {
    handler = IterableMethods.reduce;
    // eslint-disable-next-line prefer-destructuring
    handle = handler.handle;
  });

  test.each(filledArrays)('sums all elements in an array', async filledArray => {
    const reduce = handle(null, filledArray());
    expect(await reduce((t: number, x: number) => t + x, 0)).toEqual(6);
  });

  test.each(mixedArrays)('concatenates all elements in an array', async mixedArray => {
    const reduce = handle(null, mixedArray());
    expect(await reduce((t: string, x: string) => t + x, '')).toEqual('abc');
  });

  test.each(getEmptyClass())('returns base element on empty reducers', async emtpyPath => {
    const reducer = handler.handle(null, emtpyPath);
    // TODO: Double check if this is a logical default
    expect(await reducer((t: any, x: any) => x)).toEqual(undefined);
    expect(await reducer((t: any, x: any) => x, {})).toEqual({});
    expect(await reducer((t: any, x: any) => x, 'a')).toEqual('a');
    expect(await reducer((t: any, x: any) => x, [])).toEqual([]);
  });
});

// describe('.reduceRight handlers', () => {
//   let handler: { handle: Function };
//   let handle: Function;
//   const filledArrays: (() => (number[] | AsyncGenerator<number, void, unknown>))[] =
//   [
//     () => [1, 2, 3],
//     () => asyncIteratorOf([1, 2, 3]),
//   ];
//   const mixedArrays: (() => ((string | Promise<string>)[] | AsyncGenerator<string | Promise<string>, void, unknown>))[][] =
//   [
//     [() => ['a', Promise.resolve('b'), 'c']],
//     [() => asyncIteratorOf(['a', Promise.resolve('b'), 'c'])],
//   ];

//   beforeEach(() => {
//     handler = IterableMethods.reduceRight;
//     // eslint-disable-next-line prefer-destructuring
//     handle = handler.handle;
//   });

//   test.each(filledArrays)('sums all elements in an array', async filledArray => {
//     const reduce = handle(null, filledArray());
//     expect(await reduce((t: number, x: number) => t + x, 0)).toEqual(6);
//   });

//   test.each(mixedArrays)('concatenates all elements in an array', async mixedArray => {
//     const reduce = handle(null, mixedArray());
//     expect(await reduce((t: string, x: string) => t + x, '')).toEqual('cba');
//   });

//   test.each(getEmptyClass(false))('returns base element on empty reducers', async emtpyPath => {
//     const reducer = handler.handle(null, emtpyPath);
//     // TODO: Double check if this is a logical default
//     expect(await reducer((t: any, x: any) => x)).toEqual(undefined);
//     expect(await reducer((t: any, x: any) => x, {})).toEqual({});
//     expect(await reducer((t: any, x: any) => x, 'a')).toEqual('a');
//     expect(await reducer((t: any, x: any) => x, [])).toEqual([]);
//   });
// });
