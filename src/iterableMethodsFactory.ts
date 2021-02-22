import * as async from 'async';

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
            const result = await parameterFunction(item);
            callback(null, result);
          }),
          (err, res) => {
            if (err)
              reject(err);

            else
              resolve(res);
          },
        );
      });

      // return (parameterFunction: Function, memo?: any) => asyncFunction(
      //   path, memo ?? ((item) => {
      //     console.log('inside async function call', item, parameterFunction(item));
      //     return parameterFunction(item);
      //   }), memo,
      // );
    }
  };
}

export function iterableLimitMethodsFactory(asyncFunction: Function) {
  return class {
    handle(pathData: any, path: any) {
      return (parameterFunction: Function, limit: number = 5) => asyncFunction(
        path, limit, (item: any) => parameterFunction(item),
      );
    }
  };
}
