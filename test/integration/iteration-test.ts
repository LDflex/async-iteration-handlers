/* eslint-disable no-loop-func */
// @ts-ignore - Remove this when ldflex gets a type declaration
import { PathFactory, defaultHandlers } from 'ldflex';
import { namedNode, literal } from '@rdfjs/data-model';
import iterationHandlers from '../../src';
import context from '../context.json';
import { createQueryEngine } from '../util';

const subject = namedNode('https://example.org/#me');

describe('a PathFactory instance returning non-empty results', () => {
  const queryEngine = createQueryEngine([
    literal('Alice'),
    literal('Bob'),
    literal('Carol'),
  ]);
  const factory = new PathFactory({
    context,
    queryEngine,
    handlers: { ...defaultHandlers, ...iterationHandlers },
  });

  let person: any;
  beforeAll(() => {
    person = factory.create({ subject });
  });

  function matrix(name: string): ([string] | [string, (number | undefined)[]])[] {
    return [
      [`${name }`],
      [`${name }Series`],
      [`${name }Limit`, [undefined, 1, 2, 3, 4, 5, 10, 20, 100]],
    ];
  }

  for (const [name, args = [undefined]] of matrix('find')) {
    for (const arg of args) {
      it(`Should perform basic operations with .${ name }${arg === undefined ? '' : ` and arg ${ arg}`}`, async () => {
        const result1 = arg === undefined ?
          `${await person.friends[name]((x: string) => `${x}`.includes('A'))}` :
          `${await person.friends[name]((x: string) => `${x}`.includes('A'), arg)}`;
        expect(result1).toBe('Alice');
        const result2 = arg === undefined ?
          `${await person.friends[name]((x: string) => `${x}`.length === 3)}` :
          `${await person.friends[name]((x: string) => `${x}`.length === 3, arg)}`;
        expect(result2).toBe('Bob');
      });
    }
  }

  for (const [name, args = [undefined]] of matrix('some')) {
    for (const arg of args) {
      it(`Should perform basic operations with .${ name }${arg === undefined ? '' : ` and arg ${ arg}`}`, async () => {
        const result1 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.includes('A')) :
          await person.friends[name]((x: string) => `${x}`.includes('A'), arg);
        expect(result1).toBe(true);
        const result2 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length === 3) :
          await person.friends[name]((x: string) => `${x}`.length === 3, arg);
        expect(result2).toBe(true);
        const result3 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length === 9) :
          await person.friends[name]((x: string) => `${x}`.length === 9, arg);
        expect(result3).toBe(false);
      });
    }
  }

  for (const [name, args = [undefined]] of matrix('every')) {
    for (const arg of args) {
      it(`Should perform basic operations with .${ name }${arg === undefined ? '' : ` and arg ${ arg}`}`, async () => {
        const result1 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.includes('A')) :
          await person.friends[name]((x: string) => `${x}`.includes('A'), arg);
        expect(result1).toBe(false);
        const result2 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length === 3) :
          await person.friends[name]((x: string) => `${x}`.length === 3, arg);
        expect(result2).toBe(false);
        const result3 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length === 9) :
          await person.friends[name]((x: string) => `${x}`.length === 9, arg);
        expect(result3).toBe(false);

        const result4 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.includes('A') || `${x}`.includes('B') || `${x}`.includes('C')) :
          await person.friends[name]((x: string) => `${x}`.includes('A') || `${x}`.includes('B') || `${x}`.includes('C'), arg);
        expect(result4).toBe(true);
        const result5 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length >= 3) :
          await person.friends[name]((x: string) => `${x}`.length >= 3, arg);
        expect(result5).toBe(true);
        const result6 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length < 9) :
          await person.friends[name]((x: string) => `${x}`.length < 9, arg);
        expect(result6).toBe(true);
      });
    }
  }

  for (const [name, args = [undefined]] of matrix('map')) {
    for (const arg of args) {
      it(`Should perform basic operations with .${ name }${arg === undefined ? '' : ` and arg ${ arg}`}`, async () => {
        const result1 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.includes('A')) :
          await person.friends[name]((x: string) => `${x}`.includes('A'), arg);
        expect(result1).toStrictEqual([true, false, false]);
        const result2 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length === 3) :
          await person.friends[name]((x: string) => `${x}`.length === 3, arg);
        expect(result2).toStrictEqual([false, true, false]);
        const result3 = arg === undefined ?
          await person.friends[name]((x: string) => `${x}`.length) :
          await person.friends[name]((x: string) => `${x}`.length, arg);
        expect(result3).toStrictEqual([5, 3, 5]);
      });
    }
  }

  for (const [name, args = [undefined]] of matrix('forEach')) {
    for (const arg of args) {
      it(`Should perform basic operations with .${ name }${arg === undefined ? '' : ` and arg ${ arg}`}`, async () => {
        const result: string[] = [];
        const result1 = arg === undefined ?
          await person.friends[name]((x: string) => { result.push(x); }) :
          await person.friends[name]((x: string) => { result.push(x); }, arg);
        expect(result).toStrictEqual(['Alice', 'Bob', 'Carol']);
      });
    }
  }

  it('Should perform basic operations with .reduce', async () => {
    expect(await person.friends.reduce((total: string, i: string) => `${total}-${i}`, ''))
      .toStrictEqual('-Alice-Bob-Carol');
    // NOTE: The 'undefined' here is expected since the default for the reducer base case
    // is undefiend
    expect(await person.friends.reduce((total: string, i: string) => `${total}-${i}`))
      .toStrictEqual('undefined-Alice-Bob-Carol');
  });

  // it('Should perform basic operations with .reduceRight', async () => {
  //   expect(await person.friends.reduceRight((total: string, i: string) => `${total}-${i}`, ''))
  //     .toStrictEqual('Carol-Bob-Alice');
  //   // NOTE: The 'undefined' here is expected since the default for the reducer base case
  //   // is undefiend
  //   expect(await person.friends.reduceRight((total: string, i: string) => `${total}-${i}`))
  //     .toStrictEqual('Carol-Bob-Alice-undefined');
  // });
});
