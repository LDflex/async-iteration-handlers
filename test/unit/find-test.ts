/* eslint eqeqeq: off */
import * as IterableMethods from '../../src/defaultIterationHandlers';

describe('find method handlers', () => {
  let handler: { handle: Function };
  let nullPath: null;
  let objectPath: {};
  let arrayPath: any[];
  let emptyIteratorPath: AsyncGenerator<any, void, unknown>;
  let filledArray: number[];
  let emptyClass: any[];

  beforeEach(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath,
    ];
    handler = IterableMethods.find;
  });

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, filledArray);
      const found = await find((x: number) => x > 2.5);
      expect(found).toEqual(3);
    });
  });

  describe('check behavior on array with promised & non-promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x == 'c')).toEqual('c');
    });
  });

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x == 'b')).toEqual('b');
    });
  });

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, emtpyPath);
        // TODO: Make test stricter
        expect(await find(() => true)).toBeFalsy();
      }
    });
  });
});

describe('findSeries method handlers', () => {
  let handler: { handle: Function };
  let nullPath: null;
  let objectPath: {};
  let arrayPath: any[];
  let emptyIteratorPath: AsyncGenerator<any, void, unknown>;
  let filledArray: number[];
  let emptyClass: any[];

  beforeAll(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath,
    ];
    handler = IterableMethods.findSeries;
  });

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, [...filledArray, 4, 5]);
      expect(await find((x: number) => x > 2.5)).toEqual(3);
    });
  });

  describe('check behavior on array with promised & non-promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x === 'c')).toEqual('c');
    });
  });

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x === 'b')).toEqual('b');
    });
  });

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, emtpyPath);
        // TODO: Make test stricter
        expect(await find(() => true)).toBeFalsy();
      }
    });
  });
});

describe('findLimit method handlers', () => {
  let handler: { handle: Function };
  let nullPath: null;
  let objectPath: {};
  let arrayPath: any[];
  let emptyIteratorPath: AsyncGenerator<any, void, unknown>;
  let filledArray: number[];
  let emptyClass: any[];

  beforeAll(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath,
    ];
    handler = IterableMethods.findLimit;
  });

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, filledArray);
      expect(await find((x: number) => x > 2.5, 1)).toEqual(3);
      expect(await find((x: number) => x > 2.5, 2)).toEqual(3);
      expect(await find((x: number) => x > 2.5, 3)).toEqual(3);
      expect(await find((x: number) => x > 2.5, 4)).toEqual(3);
      expect(await find((x: number) => x > 2.5, 5)).toEqual(3);
    });
  });

  describe('check behavior on array with promised & non-promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x === 'c', 1)).toEqual('c');
      expect(await find((x: string) => x === 'c', 2)).toEqual('c');
      expect(await find((x: string) => x === 'c', 3)).toEqual('c');
      expect(await find((x: string) => x === 'c', 4)).toEqual('c');
      expect(await find((x: string) => x === 'c', 5)).toEqual('c');
    });
  });

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
      expect(await find((x: string) => x === 'b', 1)).toEqual('b');
      expect(await find((x: string) => x === 'b', 2)).toEqual('b');
      expect(await find((x: string) => x === 'b', 3)).toEqual('b');
      expect(await find((x: string) => x === 'b', 4)).toEqual('b');
      expect(await find((x: string) => x === 'b', 5)).toEqual('b');
    });
  });

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, emtpyPath);
        // TODO: Make test stricter
        expect(await find(() => true, 1)).toBeFalsy();
        expect(await find(() => true, 2)).toBeFalsy();
        expect(await find(() => true, 3)).toBeFalsy();
        expect(await find(() => true, 4)).toBeFalsy();
        expect(await find(() => true, 5)).toBeFalsy();
      }
    });
  });
});

async function* asyncIteratorOf<T>(items: T[]) {
  for (const item of items)
    yield item;
}
