import * as async from 'async';

type AsyncFunction<T, E> = (
  arr: async.IterableCollection<T>,
  iterator: async.AsyncIterator<T, E>,
  callback: async.AsyncResultCallback<T, E>
) => void

function callbackFactory<T, E>(parameterFunction: Function) {
  return async (item: T, callback: async.AsyncResultCallback<T, E>) => {
    try {
      return callback(null, parameterFunction(await item));
    }
    catch (e) {
      return callback(e);
    }
  };
}

function callbackFactoryKey<T, E, A, K>(parameterFunction: Function) {
  return async (p1: A, p2: K, callback: async.AsyncResultCallback<T, E>) => {
    try {
      return callback(null, parameterFunction(await p1, await p2));
    }
    catch (e) {
      return callback(e);
    }
  };
}

/**
 * A factory that turns functions (both fully concurrent and fully in series)
 * from the async library into methods/handlers
 * for LDflex
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableMethodsFactory<T, E = Error>(asyncFunction: AsyncFunction<T, E>) {
  return class {
    handle(_: any, path: any) {
      return (parameterFunction: Function) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          callbackFactory(parameterFunction),
          async (e, res) => e ? reject(e) : resolve(Array.isArray(res) ? await Promise.all(res) : res),
        );
      });
    }
  };
}

/**
 * A factory that turns functions (both fully concurrent and fully in series)
 * from the async library into methods/handlers for LDflex
 * Use specifically for EachOf methods
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableEachOfMethodsFactory<T, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    iterator: async.AsyncForEachOfIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: Function) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          callbackFactoryKey(parameterFunction),
          async (e, res) => e ? reject(e) : resolve(res),
        );
      });
    }
  };
}

/**
 * A factory that turns functions with a limited concurrency
 * from the async library into methods/handlers
 * for LDflex
 * Use specifically for EachOf methods
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableEachOfLimitMethodsFactory<T, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    limit: number,
    iterator: async.AsyncForEachOfIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(_: any, path: any) {
      return (parameterFunction: Function, limit: number = 5) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          limit,
          callbackFactoryKey(parameterFunction),
          async (e, res) => e ? reject(e) : resolve(res),
        );
      });
    }
  };
}

/**
 * A factory that turns functions with a limited concurrency
 * from the async library into methods/handlers
 * for LDflex
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableLimitMethodsFactory<T, K, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    limit: number,
    iterator: async.AsyncIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: Function, limit: number = 5) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          limit,
          callbackFactory(parameterFunction),
          async (e, res) => e ? reject(e) : resolve(Array.isArray(res) ? await Promise.all(res) : res),
        );
      });
    }
  };
}


/**
 * A factory that turns functions (both fully concurrent and fully in series)
 * from the async library into methods/handlers
 * for LDflex
 * Used specifically for methods with memo's i.e. reducers
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
// export function iterableMemoMethodsFactory<T, K, E = Error>(
//   asyncFunction: (
//     arr: IterableIterator<T> | T[],
//     memo: K,
//     iterator: async.AsyncMemoIterator<T, K, E>,
//     callback: async.AsyncResultCallback<T, E>
//   ) => void) {
//   return class {
//     handle(_: any, path: any) {
//       return (parameterFunction: (memo: K | undefined, item: T) => K, memo: K) => new Promise((resolve, reject) => {
//         asyncFunction(
//           path,
//           memo,
//           callbackFactoryKey(parameterFunction),
//           async (e, res) => e ? reject(e) : resolve(Array.isArray(res) ? await Promise.all(res) : res),
//         );
//       });
//     }
//   };
// }

export function iterableMemoMethodsFactory<F extends Function, T extends Function, K, A, B>(asyncFunction: F) {
  return class {
    handle(_: any, path: any) {
      return (parameterFunction: T, p: K) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          p,
          callbackFactoryKey(parameterFunction),
          async (e: A, res: B) => e ? reject(e) : resolve(Array.isArray(res) ? await Promise.all(res) : res),
        );
      });
    }
  };
}
