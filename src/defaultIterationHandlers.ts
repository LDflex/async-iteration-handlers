/* eslint-disable new-cap */
import * as IterableMethods from './asyncIterationHandlers';

export const every = new IterableMethods.every();
export const everyLimit = new IterableMethods.everyLimit();
export const everySeries = new IterableMethods.everySeries();

export const filter = new IterableMethods.filter();
export const filterLimit = new IterableMethods.filterLimit();
export const filterSeries = new IterableMethods.filterSeries();

export const find = new IterableMethods.find();
export const findLimit = new IterableMethods.findLimit();
export const findSeries = new IterableMethods.findSeries();

export const forEach = new IterableMethods.forEach();
export const forEachLimit = new IterableMethods.forEachLimit();
export const forEachSeries = new IterableMethods.forEachSeries();

export const map = new IterableMethods.map();
export const mapLimit = new IterableMethods.mapLimit();
export const mapSeries = new IterableMethods.mapSeries();

// reduce: new IterableMethods.reduce(),
// reduceRight: new IterableMethods.reduceRight(),

export const reject = new IterableMethods.reject();
export const rejectLimit = new IterableMethods.rejectLimit();
export const rejectSeries = new IterableMethods.rejectSeries();

export const some = new IterableMethods.some();
export const someLimit = new IterableMethods.someLimit();
export const someSeries = new IterableMethods.someSeries();

export const transform = new IterableMethods.transform();
