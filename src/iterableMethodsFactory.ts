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
      return (parameterFunction: Function, memo?: any) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          memo ?? (async (item, callback: async.AsyncResultCallback<Error>) => {
            const result = await parameterFunction(await Promise.resolve(item));
            callback(null, result);
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
 * A factory that turns functions with a limited concurrency
 * from the async library into methods/handlers
 * for LDflex
 * @param asyncFunction The function to turn into a method/handler for LDflex
 */
export function iterableLimitMethodsFactory<T, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    limit: number,
    iterator: async.AsyncIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: Function, limit: number = 5, memo?: any) => new Promise((resolve, reject) => {
        asyncFunction(
          path,
          limit,
          memo ?? (async (item, callback: async.AsyncResultCallback<T, E>) => {
            const result = await parameterFunction(await Promise.resolve(item));
            callback(undefined, result);
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
