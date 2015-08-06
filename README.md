stripe-chainable [![Build Status](https://travis-ci.org/Zertz/stripe-chainable.svg?branch=master)](https://travis-ci.org/Zertz/stripe-chainable) [![npm package](https://badge.fury.io/js/stripe-chainable.svg)](https://www.npmjs.com/package/stripe-chainable)
================

Syntactic sugar for [stripe-node](https://github.com/stripe/stripe-node)

```javascript
stripe.find().last(150).charges(function(err, charges) {
  // 'nuff said
});
```

```javascript
stripe.entire().charges().history().since(new Date(2015, 0, 1)).please(function(err, balance) {
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
- `that()`: pure sugar
- `since(date)`: alias for `from()`, except date is mandatory
- `until([date])`: alias for `to()`
- `entire()`: alias for `all()`

- `for([string])`: alias for `setAccount()` and used for setting customer id, charge id and purpose
- `find([number])`: sugar allowing to set a limit
- `last(number)`: limits results to this value
- `all()`: queries the Stripe API until all the objects are returned
- `are(string)`: sets a status
- `type(string)`: sets an event type

- `available()`: tells the following time-based methods to set `available_on` instead of `created`
- `before([mixed])`: may be called with a date or used as a synonym for `ending_before`
- `after([mixed])`: may be called with a date or used as a synonym for `starting_after`
- `from([date])`: may be called with a date (inclusive)
- `to([date])`: may be called with a date (inclusive)
- `now()`: chain with `to()`, `until()`

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
  - `customer` set with `for('cus_id')`)
- Customers
- Plans
- Coupons
- Invoices
- Invoice items
  - `customer` set with `for('cus_id')`
- Applications fees
  - `charge` set with `for('ch_id')`
- Accounts
  - Note: Stripe does not support filtering on this object
- Events
  - `type` set with `type('type')`, [list of types](https://stripe.com/docs/api/node#event_types)
- File uploads
  - `purpose` argument set with `for('purpose')`, [list of purposes](https://stripe.com/docs/api/node#file_upload_object)

**Partially supported objects**

- Refunds
  - Strictly through Balance history (`refunds().history()`)
- Disputes
  - Strictly through adjustments with Balance history (`adjustments().history()`)
- Transfers
  - `status` set with `are('status')`, [list of statuses](https://stripe.com/docs/api/node#list_transfers)
  - `date` and `recipient` are not supported at the moment
- Balance history (through the `history()` method)
  - `available_on` set by preceding time-based methods (`from()`, `to()`, etc) by `available()`
  - `type` set through object context methods (`charges()`, `refunds()`, etc)
  - `source` set with `for('ch_id')`
  - `currency` and `transfer` are not supported at the moment
- Bitcoin receivers
  - `active`, `filled` and `uncaptured_funds` are not supported at the moment

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
stripe.find().all().charges().since(new Date(2015, 0, 1)).please(function(current, total) {
  console.info('%d / %d', current, total)
}, function(err, charges) {
  // All charges in 2015 up until now
});
```

```javascript
stripe.find().last(50).customers().after(new Date(2014, 11, 31)).please(function(err, customers) {
  // Last 50 customers created after December 31st 2014
});
```

```javascript
stripe.find().all().transfers().that().are('pending').please(function(err, transfers) {
  // All pending transfers
});
```

#### Balance

```javascript
stripe.entire().history().of().applicationFees().from(new Date(2015, 3, 1)).until().now().and().include('total_count').please(function(err, balance) {
  // Self-explanatory
});
```

```javascript
stripe.entire().history().available().from(new Date(2015, 4, 1)).please(function(progress, total) {
  console.info('%d / %d', progress, total);
}, function(err, charges) {
  // Self-explanatory
});
```

Does it work?
-------------

Yes, according to [mocha](https://github.com/mochajs/mocha), [chai](https://github.com/chaijs/chai), [sinon](https://github.com/cjohansen/Sinon.JS/) and [istanbul](https://github.com/gotwarlost/istanbul).

```
npm i
npm test
```

Who?
----

[FluidApps](https://fluidapps.ca/) and the community.

Can I use?
----------

Yes, `stripe-chainable` is MIT licensed.
