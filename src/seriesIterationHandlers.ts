/* eslint-disable new-cap */
import * as IterableMethods from './asyncIterationHandlers';

export const every = new IterableMethods.everySeries();
export const filter = new IterableMethods.filterSeries();
export const find = new IterableMethods.findSeries();
export const forEach = new IterableMethods.forEachSeries();
export const map = new IterableMethods.mapSeries();

// reduce: new IterableMethods.reduce(),
// reduceRight: new IterableMethods.reduceRight(),

export const reject = new IterableMethods.rejectSeries();
export const some = new IterableMethods.someSeries();

export const transform = new IterableMethods.transform();
