const { PathFactory, defaultHandlers } = require('ldflex');
const { default: ComunicaEngine } = require('@ldflex/comunica');
const { namedNode } = require('@rdfjs/data-model');
const defaultIterationHandlers = require('../../src');

// The JSON-LD context for resolving properties
const context = {
  "@context": {
    "@vocab": "http://xmlns.com/foaf/0.1/",
    "friends": "knows",
    "label": "http://www.w3.org/2000/01/rdf-schema#label",
  }
};
// The query engine and its source
const queryEngine = new ComunicaEngine('https://ruben.verborgh.org/profile/');
// The object that can create new paths
const path = new PathFactory({ context, queryEngine, handlers: {
  ...defaultIterationHandlers,
  ...defaultHandlers,
} });

const ruben = path.create({ subject: namedNode('https://ruben.verborgh.org/profile/#me') });
showPerson(ruben);

async function showPerson(person: any) {
  console.log(`This person is ${await person.name}`);

  console.log(`${await person.givenName} is interested in:`);
  for await (const name of person.interest.label)
    console.log(`- ${name}`);

  console.log(`${await person.givenName} is friends with:`);
  const filtered = person.friends.givenName.filter(async (x: any) => (`${await x}`[0] === 'C'));
  // for await (const name of await person.friends.givenName.filter(async (x: any) => (`${await x}`[0] === 'C')))
  //   console.log(`- ${name}`);
}
