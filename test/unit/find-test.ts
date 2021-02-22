import * as IterableMethods from '../../src/defaultIterationHandlers';

describe('find method handlers', () => {
  let handler;
  let nullPath;
  let objectPath;
  let arrayPath;
  let emptyIteratorPath;
  let filledArray;
  let emptyClass;

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
      const found = await find(x => x > 2.5);
      expect(found).toEqual(3);
    });
  });

  //   describe('check behavior on array with promised & non-promised elements', () => {
  //     it('works on a normal with non-promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x == 'c')).resolves.toEqual('c');
  //     });
  //   });

  //   describe('check behavior on array with promised elements', () => {
  //     it('works on a normal with promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x == 'b')).resolves.toEqual('b');
  //     });
  //   });

  //   describe('check behavior on empty iterators', () => {
  //     it('works on empty iterators', async () => {
  //       for (const emtpyPath of emptyClass) {
  //         const find = handler.handle(null, emtpyPath);
  //         // TODO: Make test stricter
  //         expect(await find(() => true)).resolves.toBeFalsy();
  //       }
  //     });
  //   });
  // });

  // describe('findSeries method handlers', () => {
  //   let handler; let nullPath; let objectPath; let arrayPath;
  //   let emptyIteratorPath; let filledArray; let
  //     emptyClass;

  //   beforeAll(() => {
  //     nullPath = null;
  //     objectPath = {};
  //     arrayPath = [];
  //     emptyIteratorPath = asyncIteratorOf([]);
  //     filledArray = [1, 2, 3];

  //     emptyClass = [
  //       nullPath,
  //       objectPath,
  //       arrayPath,
  //       emptyIteratorPath,
  //     ];
  //     handler = new IterableMethods.findSeries();
  //   });

  //   describe('check behavior on normal array', () => {
  //     it('finds element greater than 2.5', async () => {
  //       const find = handler.handle(null, filledArray);
  //       expect(await find((x) => x > 2.5)).resolves.toEqual(3);
  //     });
  //   });

  //   describe('check behavior on array with promised & non-promised elements', () => {
  //     it('works on a normal with non-promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x === 'c')).resolves.toEqual('c');
  //     });
  //   });

  //   describe('check behavior on array with promised elements', () => {
  //     it('works on a normal with promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x === 'b')).resolves.toEqual('b');
  //     });
  //   });

  //   describe('check behavior on empty iterators', () => {
  //     it('works on empty iterators', async () => {
  //       for (const emtpyPath of emptyClass) {
  //         const find = handler.handle(null, emtpyPath);
  //         // TODO: Make test stricter
  //         expect(await find(() => true)).resolves.toBeFalsy();
  //       }
  //     });
  //   });
  // });

  // describe('findLimit method handlers', () => {
  //   let handler; let nullPath; let objectPath; let arrayPath;
  //   let emptyIteratorPath; let filledArray; let
  //     emptyClass;

  //   beforeAll(() => {
  //     nullPath = null;
  //     objectPath = {};
  //     arrayPath = [];
  //     emptyIteratorPath = asyncIteratorOf([]);
  //     filledArray = [1, 2, 3];

  //     emptyClass = [
  //       nullPath,
  //       objectPath,
  //       arrayPath,
  //       emptyIteratorPath,
  //     ];
  //     handler = new IterableMethods.findLimit();
  //   });

  //   describe('check behavior on normal array', () => {
  //     it('finds element greater than 2.5', async () => {
  //       const find = handler.handle(null, filledArray);
  //       expect(await find((x) => x > 2.5)).resolves.toEqual(3);
  //     });
  //   });

  //   describe('check behavior on array with promised & non-promised elements', () => {
  //     it('works on a normal with non-promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x === 'c')).resolves.toEqual('c');
  //     });
  //   });

  //   describe('check behavior on array with promised elements', () => {
  //     it('works on a normal with promised elements', async () => {
  //       const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
  //       expect(await find((x) => x === 'b')).resolves.toEqual('b');
  //     });
  //   });

//   describe('check behavior on empty iterators', () => {
//     it('works on empty iterators', async () => {
//       for (const emtpyPath of emptyClass) {
//         const find = handler.handle(null, emtpyPath);
//         // TODO: Make test stricter
//         expect(await find(() => true)).resolves.toBeFalsy();
//       }
//     });
//   });
});

async function* asyncIteratorOf<T>(items: T[]) {
  for (const item of items)
    yield item;
}
