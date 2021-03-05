## @ldflex/async-iteration-handlers

This library acts as a wrapper for functions from the [async](https://caolan.github.io/async/v3/) library, exporting them as handlers to be used by [LDflex](https://github.com/LDflex/LDflex).


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
const allFriendsLabelled: boolean = path.friends.every(
  friend => `${friend.label}` !== 'undefined'
);

// This executes synchronously
const allFriendsLabelled: boolean = path.friends.everySeries(
  friend => `${friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const allFriendsLabelled: boolean = path.friends.everyLimit(
  friend => `${friend.label}` !== 'undefined',
  5
);
```

 - `.filter`
 - `.filterLimit`
 - `.filterSeries`

```ts
// This executes asynchronously
const labelledFriends = path.friends.filter(
  friend => `${friend.label}` !== 'undefined'
);

// This executes synchronously
const labelledFriends = path.friends.filterSeries(
  friend => `${friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const labelledFriends = path.friends.filterLimit(
  friend => `${friend.label}` !== 'undefined',
  5
);
```

 - `.find`
 - `.findLimit`
 - `.findSeries`

```ts
// This executes asynchronously
const labelledFriend = path.friends.find(
  friend => `${friend.label}` !== 'undefined'
);

// This executes synchronously
const labelledFriend = path.friends.findSeries(
  friend => `${friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const labelledFriend = path.friends.findLimit(
  friend => `${friend.label}` !== 'undefined',
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
  friend => {
    if (`${friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes synchronously
path.friends.forEachSeries(
  friend => {
    if (`${friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  }
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
path.friends.forEachLimit(
  friend => {
    if (`${friend.label}` !== 'undefined') {
      labelledFriend.push(friend)
    }
  },
  5
);
```

 - `.forEachOf`
 - `.forEachOfLimit`
 - `.forEachOfSeries`

 - `.map`
 - `.mapLimit`
 - `.mapSeries`

```ts
// This executes asynchronously
const friendLabels = path.friends.filter(
  friend => `${friend.label}`
);

// This executes synchronously
const friendLabels = path.friends.filterSeries(
  friend => `${friend.label}`
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const friendLabels = path.friends.filterLimit(
  friend => `${friend.label}`,
  5
);
```

 - `.some`
 - `.someLimit`
 - `.someSeries`

```ts
// This executes asynchronously
const someFriendsLabelled = path.friends.some(
  friend => `${friend.label}` !== 'undefined'
);

// This executes synchronously
const someFriendsLabelled = path.friends.someLimit(
  friend => `${friend.label}` !== 'undefined'
);

// This executes asynchronously, but at most 5 entities are processed in parrallel at any time
const someFriendsLabelled = path.friends.someSeries(
  friend => `${friend.label}` !== 'undefined',
  5
);
```

 - `.reduce`

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
 - `.filter`
 - `.find`
 - `.forEach`
 - `.forEachOf`
 - `.map`
 - `.some`
 - `.reduce`

## NOTE
By default, methods with limited asynchronicity process at most 5 entities concurrently.
