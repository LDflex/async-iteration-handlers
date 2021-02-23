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

  it('Should perform basic operations with .find', async () => {
    expect(`${await person.friends.find((x: string) => `${x}`.includes('A'))}`).toBe('Alice');
    expect(`${await person.friends.find((x: string) => `${x}`.length === 3)}`).toBe('Bob');
  });
});
