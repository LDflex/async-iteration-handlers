import * as async from 'async';
import { iterableMethodsFactory, iterableLimitMethodsFactory } from './iterableMethodsFactory';

export const find = iterableMethodsFactory(async.detect);
export const findLimit = iterableLimitMethodsFactory(async.detectLimit);
export const findSeries = iterableMethodsFactory(async.detectSeries);

// TODO: ADD TESTS FOR BELOW FUNCTIONS
export const forEach = iterableMethodsFactory(async.each);
export const forEachLimit = iterableLimitMethodsFactory(async.eachLimit);
export const forEachSeries = iterableMethodsFactory(async.eachSeries);

// export const forEachOf = IterableMethodsFactory(async.eachOf);
export const forEachOfLimit = iterableLimitMethodsFactory(async.eachOfLimit);
// export const forEachOfSeries = IterableMethodsFactory(async.eachOfSeries);

export const every = iterableMethodsFactory(async.every);
export const everyLimit = iterableLimitMethodsFactory(async.everyLimit);
export const everySeries = iterableMethodsFactory(async.everySeries);

export const filter = iterableMethodsFactory(async.filter);
export const filterLimit = iterableLimitMethodsFactory(async.filterLimit);
export const filterSeries = iterableMethodsFactory(async.filterSeries);

export const map = iterableMethodsFactory(async.map);
export const mapLimit = iterableLimitMethodsFactory(async.mapLimit);
export const mapSeries = iterableMethodsFactory(async.mapSeries);

// export const reduce = IterableMethodsFactory(async.reduce);
// export const reduceRight = IterableMethodsFactory(async.reduceRight);

export const reject = iterableMethodsFactory(async.reject);
export const rejectLimit = iterableLimitMethodsFactory(async.rejectLimit);
export const rejectSeries = iterableMethodsFactory(async.rejectSeries);

export const some = iterableMethodsFactory(async.some);
export const someLimit = iterableLimitMethodsFactory(async.someLimit);
export const someSeries = iterableMethodsFactory(async.someSeries);
// May be some issues because of the 2nd arg accumulartor
export const transform = iterableMethodsFactory(async.transform);
