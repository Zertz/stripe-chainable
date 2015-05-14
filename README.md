stripe-chainable [![Build Status](https://travis-ci.org/FluidApps/stripe-chainable.svg?branch=master)](https://travis-ci.org/FluidApps/stripe-chainable) [![npm package](https://badge.fury.io/js/stripe-chainable.svg)](https://www.npmjs.com/package/stripe-chainable)
================

Syntactic sugar for [stripe-node](https://github.com/stripe/stripe-node)

Why?
----

We believe the folks over at Stripe built an awesome API, but found it a bit lacking
when it came to generating ~~boring~~ detailed reports. With that in mind, we designed
a set of *intuitive* methods for crafting *beautiful* queries.

Indeed, `stripe-chainable` is intentionally limited in scope and very much complementary
to Stripe's module. In fact, it focuses on a single operation: **retrieving exactly the
bunch of objects you're looking for**.

Where?
------

`npm install stripe-chainable`

How?
----

Exactly the same as, well, Stripe.

`var stripe = require('stripe-chainable')(key[, version]);`

Your key goes straight to Stripe's module, not even an internal reference is kept.

What?
----- 

### Sugar

Akin to assertion frameworks, `stripe-chainable` provides keywords to build queries in plain
English.

- `and()`: pure sugar
- `since(date)`: alias for `from()`, except date is mandatory
- `until([date])`: alias for `to()`
- `find()`: sugar and allows setting a limit
- `all()`: queries the Stripe API until all the objects are returned
- `before([mixed])`: may be called with a date or used as a synonym for `ending_before`
- `after([mixed])`: may be called with a date or used as a synonym for `starting_after`
- `from([date])`: may be called with a date (inclusive)
- `to([date])`: may be called with a date (inclusive)
- `now()`: chain with `to()` or `until()`
- `include(key)`: sets the `include[]` key, Stripe only makes `total_count` available at the moment

The following methods set the type of object to query and may be used in various ways.

- `charges()`: for chaining
- `charges(callback)` and `charges(progress, callback)`: for executing

The following values are returned:

- `progress`: `(current, total)`
- `callback`: `(err, objects)` 

It's often clearer to set context early in a sentence. These methods may be used for
executing a chain.

- `list(callback)`
- `list(progress, callback)`

### Feature

Yes, that's feature. Without an *s*.

The Stripe API limits the number of objects returned to 100. Fair enough, but what if you
need more?

```javascript
stripe.find().all().charges(function(err, charges) {
  // They're all here, automatically queried and concatenated.
});
```

This works across all supported endpoints, which are currently limited to charges and refunds.

More to come. Soon. Promise.

### Wait, what?

All methods return `this`, making it possible to chain anything with anything. Here are a
few examples.

```javascript
stripe.find().all().charges().since(new Date(2015, 0, 1)).list(function(err, charges) {
  // All charges in 2015 up until now
});
```

```javascript
stripe.find(50).charges().after(new Date(2014, 11, 31)).and().before(new Date(2015, 1, 1)).list(function(err, charges) {
  // Last 50 charges of January 2015
});
```

```javascript
stripe.find().all().charges().from(new Date(2015, 0, 1)).to(new Date(2015, 0, 31)).list(function(err, charges) {
  // All charges during January 2015
});
```

Does it work?
-------------

Yes, according to [mocha](https://github.com/mochajs/mocha), [chai](https://github.com/chaijs/chai), [sinon](https://github.com/cjohansen/Sinon.JS/) and [istanbul](https://github.com/gotwarlost/istanbul).

```
npm install -g istanbul
npm test
```

Who?
----

[FluidApps](https://fluidapps.ca/), but most importantly, *you*.

Can I use?
----------

Yes, `stripe-chainable` is MIT licensed.
