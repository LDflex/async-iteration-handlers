## @ldflex/async-iteration-handlers

This library acts as a wrapper for functions from the [async](https://caolan.github.io/async/v3/) library, exporting them as handlers to be used by [LDflex](https://github.com/LDflex/LDflex).

[![npm version](https://img.shields.io/npm/v/@ldflex/async-iteration-handlers.svg)](https://www.npmjs.com/package/@ldflex/async-iteration-handlers)
[![build](https://img.shields.io/github/workflow/status/LDflex/async-iteration-handlers/Node.js%20CI)](https://github.com/LDflex/async-iteration-handlers/tree/master/)
[![Dependency Status](https://david-dm.org/LDflex/async-iteration-handlers.svg)](https://david-dm.org/LDflex/async-iteration-handlers)

### All exported handlers (`defaultIterationHandlers`)

#### Initialization
```ts
const { PathFactory } = require('ldflex');
const { default: ComunicaEngine, defaultHandlers } = require('@ldflex/comunica');
const { defaultIterationHandlers } = require('@ldflex/async-iteration-handlers');
const { namedNode } = require('@rdfjs/data-model');

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
const path = new PathFactory({
  context,
  queryEngine,
  handlers: [
    ...defaultHandlers,
    ...defaultIterationHandlers
  ]
});
```

#### Available Methods

 - `.every`
 - `.everyLimit`
 - `.everySeries`

```ts
// This executes asynchronously
const allFriendsLabelled: Promise<boolean> = path.friends.every(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes synchronously
const allFriendsLabelled: Promise<boolean> = path.friends.everySeries(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const allFriendsLabelled: Promise<boolean> = path.friends.everyLimit(
  async friend => `${await friend.label}` !== 'undefined',
  5
);
```

 - `.filter`
 - `.filterLimit`
 - `.filterSeries`

```ts
// This executes asynchronously
const labelledFriends: Promise<string[]> = path.friends.filter(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes synchronously
const labelledFriends: Promise<string[]> = path.friends.filterSeries(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const labelledFriends: Promise<string[]> = path.friends.filterLimit(
  async friend => `${await friend.label}` !== 'undefined',
  5
);
```

 - `.find`
 - `.findLimit`
 - `.findSeries`

```ts
// This executes asynchronously
const labelledFriend: Promise<string> = path.friends.find(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes synchronously
const labelledFriend: Promise<string> = path.friends.findSeries(
  async friend => `${await friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const labelledFriend: Promise<string> = path.friends.findLimit(
  async friend => `${await friend.label}` !== 'undefined',
  5
);
```

 - `.forEach`
 - `.forEachLimit`
 - `.forEachSeries`

```ts
const labelledFriend = [];

// This executes asynchronously
path.friends.forEach(
  async friend => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes synchronously
path.friends.forEachSeries(
  async friend => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
path.friends.forEachLimit(
  async friend => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  },
  5
);
```

 - `.forEachOf`
 - `.forEachOfLimit`
 - `.forEachOfSeries`

```ts
const labelledFriend = [];

// This executes asynchronously
path.friends.forEachOf(
  async (friend, index) => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes synchronously
path.friends.forEachOfSeries(
  async (friend, index) => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
path.friends.forEachOfLimit(
  async (friend, index) => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  },
  5
);
```

 - `.map`
 - `.mapLimit`
 - `.mapSeries`

```ts
// This executes asynchronously
const friendLabels: Promise<string[]> = path.friends.map(
  async friend => `${await friend.label}`
);

// This executes synchronously
const friendLabels: Promise<string[]> = path.friends.mapSeries(
  async friend => `${await friend.label}`
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const friendLabels: Promise<string[]> = path.friends.mapLimit(
  async friend => `${await friend.label}`,
  5
);
```

 - `.some`
 - `.someLimit`
 - `.someSeries`

```ts
// This executes asynchronously
const someFriendsLabelled: Promise<boolean> = path.friends.some(
  friend => `${friend.label}` !== 'undefined'
);

// This executes synchronously
const someFriendsLabelled: Promise<boolean> = path.friends.someLimit(
  friend => `${friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const someFriendsLabelled: Promise<boolean> = path.friends.someSeries(
  friend => `${friend.label}` !== 'undefined',
  5
);
```

 - `.reduce`

```ts
// This executes synchronously
const friendLabels: Promise<string>= path.friends.reduce(
  async (total, friend) => `${total}&${await friend.label}`,
  ''
);
```

## Alternatively if you wish to only use sychronous handlers (`seriesIterationHandlers`)

#### Initialization
```ts
const { PathFactory } = require('ldflex');
const { default: ComunicaEngine, defaultHandlers } = require('@ldflex/comunica');
const { seriesIterationHandlers } = require('@ldflex/async-iteration-handlers');
const { namedNode } = require('@rdfjs/data-model');

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
const path = new PathFactory({
  context,
  queryEngine,
  handlers: [
    ...defaultHandlers,
    ...seriesIterationHandlers
  ]
});
```

#### Available Methods


 - `.every`

```ts
// This executes synchronously
const allFriendsLabelled: Promise<boolean> = path.friends.every(
  async friend => `${await friend.label}` !== 'undefined'
);
```

 - `.filter`

```ts
// This executes synchronously
const labelledFriends: Promise<string[]> = path.friends.filter(
  async friend => `${await friend.label}` !== 'undefined'
);
```

 - `.find`

```ts
// This executes synchronously
const labelledFriend: Promise<string> = path.friends.find(
  async friend => `${await friend.label}` !== 'undefined'
);
```

 - `.forEach`

```ts
const labelledFriend = [];

// This executes synchronously
path.friends.forEach(
  async friend => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);
```

 - `.forEachOf`

```ts
const labelledFriend = [];

// This executes synchronously
path.friends.forEachOf(
  async (friend, index) => {
    if (`${await friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);
```

 - `.map`

```ts
// This executes synchronously
const friendLabels: Promise<string[]> = path.friends.map(
  async friend => `${await friend.label}`
);
```

 - `.some`

```ts
// This executes synchronously
const someFriendsLabelled: Promise<boolean> = path.friends.some(
  friend => `${friend.label}` !== 'undefined'
);
```

 - `.reduce`

```ts
// This executes synchronously
const friendLabels: Promise<string>= path.friends.reduce(
  async (total, friend) => `${total}&${await friend.label}`,
  ''
);
```

## NOTE
By default, methods with limited asynchronicity process at most 5 entities concurrently.

## License
©2020–present
[Jesse Wright](https://github.com/jeswr/),
[Ruben Verborgh](https://ruben.verborgh.org/),
[Ruben Taelman](https://www.rubensworks.net/).
[MIT License](https://github.com/LDflex/async-iteration-handlers/blob/master/LICENSE.md).
