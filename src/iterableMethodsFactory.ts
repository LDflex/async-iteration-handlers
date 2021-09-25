import * as async from 'async';

/**
 * A factory that turns functions (both fully concurrent and fully in series)
 * from the async library into methods/handlers
 * for LDflex
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableMethodsFactory<T, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    iterator: async.AsyncIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: Function) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          (async (item, callback: async.AsyncResultCallback<T, E>) => {
            try {
              const result = await parameterFunction(await Promise.resolve(item));
              // eslint-disable-next-line callback-return
              callback(null, result);
            }
            catch (e) {
              // eslint-disable-next-line callback-return
              callback(e as E | null | undefined);
            }
          }),
          async (err, res) => {
            if (err)
              reject(err);

            else
              resolve(Array.isArray(res) ? await Promise.all(res) : res);
          },
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
          (async (item, key, callback: async.AsyncResultCallback<T, E>) => {
            try {
              const result = await parameterFunction(await Promise.resolve(item), key);
              // eslint-disable-next-line callback-return
              callback(null, result);
            }
            catch (e) {
              // eslint-disable-next-line callback-return
              callback(e as E | null | undefined);
            }
          }),
          async (err, res) => {
            if (err)
              reject(err);

            else
              resolve(res);
          },
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
    handle(pathData: any, path: any) {
      return (parameterFunction: Function, limit: number = 5) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          limit,
          (async (item, key, callback: async.AsyncResultCallback<T, E>) => {
            try {
              const resolvedItem = await item;
              const result = await parameterFunction(resolvedItem, key);
              // eslint-disable-next-line callback-return
              callback(null, result);
            }
            catch (e) {
              // eslint-disable-next-line callback-return
              callback(e as E | null | undefined);
            }
          }),
          async (err, res) => {
            if (err)
              reject(err);

            else
              resolve(res);
          },
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
          (async (item, callback: async.AsyncResultCallback<T, E>) => {
            try {
              const resolvedItem = await item;
              const result = await parameterFunction(resolvedItem);
              // eslint-disable-next-line callback-return
              callback(undefined, result);
            }
            catch (e) {
              // eslint-disable-next-line callback-return
              callback(e as E | null | undefined);
            }
          }),
          async (err, res) => {
            if (err)
              reject(err);

            else
              resolve(Array.isArray(res) ? await Promise.all(res) : res);
          },
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
export function iterableMemoMethodsFactory<T, K, E = Error>(
  asyncFunction: (
    arr: IterableIterator<T> | T[],
    memo: K,
    iterator: async.AsyncMemoIterator<T, K, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: (memo: K | undefined, item: T) => K, memo: K) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          memo,
          (async (_memo: K | undefined, item: T, callback: async.AsyncResultCallback<K, E>) => {
            try {
              const result: K = await parameterFunction(_memo, await Promise.resolve(item));
              // eslint-disable-next-line callback-return
              callback(undefined, result);
            }
            catch (e) {
              // eslint-disable-next-line callback-return
              callback(e as E | null | undefined);
            }
          }),
          async (err, res) => {
            if (err)
              reject(err);

            else
              resolve(Array.isArray(res) ? await Promise.all(res) : res);
          },
        );
      });
    }
  };
}
