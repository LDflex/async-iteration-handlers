/**
 * NOTE: IT WOULD BE GOOD TO HAVE THIS FACTORED INTO A SEPARATE MODULE THAT
 * IS IMPORTED BY THIS *AND* LDFLEX
 */

import { Term } from 'rdf-js';

export type Result = string | Term | Result[];

export function deindent(string: string) {
  const first = (/^ +/m).exec(string)?.[0];
  const indent = !first ? /^/ : new RegExp(`^ {${first.length}}?`, 'mg');
  return string.trim().replace(indent, '');
}

export function createQueryEngine(variableNames: (string | Term)[], results?: Result[]) {
  if (!results) {
    results = variableNames;
    variableNames = ['?value'];
  }
  return {
    execute: jest.fn(async function*() {
      for (let result of results as Result[]) {
        if (!Array.isArray(result))
          result = [result];
        const bindings = variableNames.map((name, i): [Term | string, Result] => [name, (result as Result[])[i]]);
        yield new Map(bindings);
      }
    }),
  };
}

export async function* asyncIteratorOf<T>(items: T[]) {
  for (const item of items)
    yield item;
}

export function getEmptyClass() {
  return [
    null,
    {},
    [],
    asyncIteratorOf([]),
  ];
}
