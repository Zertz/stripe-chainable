stripe-chainable [![Build Status](https://travis-ci.org/FluidApps/stripe-chainable.svg?branch=master)](https://travis-ci.org/FluidApps/stripe-chainable) [![npm package](https://badge.fury.io/js/stripe-chainable.svg)](https://www.npmjs.com/package/stripe-chainable)
================

Syntactic sugar for [stripe-node](https://github.com/stripe/stripe-node)

```javascript
stripe.find().last(150).charges(function(err, charges) {
  // 'nuff said
});
```

```javascript
stripe.find().entire().charges().history().since(new Date(2015, 0, 1)).please(function(err, balance) {
  // What he said
});
```

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

> Your key goes straight to Stripe's module, not even an internal reference is kept.

What?
----- 

### Sugar

Akin to assertion frameworks, `stripe-chainable` provides keywords to build queries in plain
English.

- `and()`: pure sugar
- `of()`: pure sugar
- `since(date)`: alias for `from()`, except date is mandatory
- `until([date])`: alias for `to()`
- `entire()`: alias for `all()`

- `for([string])`: alias for `setAccount()` and used for setting customer id, charge id and purpose
- `find([number])`: sugar allowing to set a limit
- `last(number)`: limits results to this value
- `all()`: queries the Stripe API until all the objects are returned
- `type(string)`: sets an event type

- `before([mixed])`: may be called with a date or used as a synonym for `ending_before`
- `after([mixed])`: may be called with a date or used as a synonym for `starting_after`
- `from([date])`: may be called with a date (inclusive)
- `to([date])`: may be called with a date (inclusive)
- `now()`: chain with `to()` or `until()`

- `include(key)`: sets the `include[]` key, Stripe only makes `total_count` available at the moment
- `setAccount(acct_id)`: sets the account id to use (for Stripe Connect users)

- `history()`: use the Balance history API for this query, in conjuction with one of:
  - `charges()`
  - `refunds()` 
  - `adjustments()`
  - `applicationFees()`
  - `applicationFeeRefunds()`
  - `transfers()`
  - `transferFailures()`

- The following may be used to set context or execute the query in that context:
  - `charges()`
  - `customers()`
  - `plans()`
  - `coupons()`
  - `invoices()`
  - `invoiceItems()`
  - `transfers()`
  - `applicationFees()`
  - `accounts()`
  - `events()`
  - `bitcoinReceivers()`
  - `fileUploads()`

For executing, a callback must be supplied and an optional progress callback is available as well
- `charges([progress, ]callback)`

With the following signatures:

- `progress(current, total)`
- `callback(err, objects)`

It's often clearer to set context early in a sentence and execute later. These methods may be used
for executing a chain:

- `please([progress, ]callback)`

**Supported objects**

- Charges
  - Optional `customer` argument set with `for('ch_id')`)
- Customers
- Plans
- Coupons
- Invoices
- Invoice items
  - Optional `customer` argument set with `for('ch_id')`)
- Applications fees
  - Optional `charge` argument set with `for('ch_id')`)
- Accounts
  - Stripe does not support filtering on this object
- Balance history (through the `history()` method)
  - Optional `type` set through object context methods (`charges()`, `refunds()`, etc)
- Events
  - Optional `type` argument set with `type('type')`
  - [Stripe API reference](https://stripe.com/docs/api/node#event_types)
- File uploads
  - Optional `purpose` argument set with `for('purpose')`)
  - [Stripe API reference](https://stripe.com/docs/api/node#file_upload_object)

**Partially supported objects**

- Refunds
  - Strictly through Balance history (`refunds().history()`)
- Disputes
  - Strictly through adjustments with Balance history (`adjustments().history()`)
- Transfers
  - Without the `date`, `recipient` and `status` arguments
- Bitcoin receivers
  - Without the `active`, `filled` and `uncaptured_funds` arguments

**Currently unsupported objects**

- Cards
- Subscriptions
- Discounts
- Transfer reversals
- Application fee refunds
- Balance
- Tokens

**Objects deprecated by Stripe are unsupported**

- Recipients

### Feature

Yes, that's feature. Without an *s*.

The Stripe API limits the number of objects returned to 100. Fair enough, but what if you
need more?

```javascript
stripe.find().all().charges(function(err, charges) {
  // They're all here, automatically queried and concatenated.
});
```

### Wait, what?

All methods return `this`, making it possible to chain anything with (almost) anything. Here are a
few examples.

#### List

```javascript
stripe.find().all().charges().since(new Date(2015, 0, 1)).please(function(err, charges) {
  // All charges in 2015 up until now
});
```

```javascript
stripe.find(50).customers().after(new Date(2014, 11, 31)).and().before(new Date(2015, 1, 1)).please(function(err, charges) {
  // Last 50 charges of January 2015
});
```

```javascript
stripe.find().all().refunds().from(new Date(2015, 0, 1)).to(new Date(2015, 0, 31)).please(function(err, charges) {
  // All charges during January 2015
});
```

#### Balance

```javascript
stripe.entire().history().of().applicationFees().since(new Date(2015, 0, 1)).and().include('total_count').please(function(progress, total) {
  console.info('%d / %d', progress, total);
}, function(err, charges) {
  if (err) {
    return next(err);
  }
  
  res.status(200).json(charges);
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
