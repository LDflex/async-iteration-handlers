const { PathFactory, defaultHandlers } = require('ldflex');
const { default: ComunicaEngine } = require('@ldflex/comunica');
const defaultIterationHandlers = require('../../src');
const { namedNode } = require('@rdfjs/data-model');
const { newEngine: localFileEngine } = require('@comunica/actor-init-sparql-file');
import path from 'path';

// The JSON-LD context for resolving properties
const context = {
  '@context': {
    '@vocab': 'http://xmlns.com/foaf/0.1/',
    'friends': 'knows',
  },
};
// The query engine and its source
const queryEngine = new ComunicaEngine(
  path.join(__dirname, 'ruben-verborgh.ttl'),
  { engine: localFileEngine() },
);
// The object that can create new paths
const p = new PathFactory({
  context,
  queryEngine,
  handlers: {
    // ...defaultHandlers,
    ...defaultIterationHandlers,
  },
});

const ruben = p.create({ subject: namedNode('https://ruben.verborgh.org/profile/#me') });

(async () => {
  console.log(await ruben.friends);
  // for await (const f of ruben.friends)
  //   console.log(f);
})();


// .forEach(async (x: any) => {
//   console.log(`${await x}`);
// });
