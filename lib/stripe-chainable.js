"use strict";

const isFunction = require("lodash.isfunction");
const isNumber = require("lodash.isnumber");
const isString = require("lodash.isstring");
const omit = require("lodash.omit");
const inflection = require("inflection");

function StripeChainable(key, version) {
  if (!(this instanceof StripeChainable)) {
    return new StripeChainable(key, version);
  }

  this._stripe = require("stripe")(key, version);
}

StripeChainable.prototype = {
  // Sugar
  and: function() {
    return this;
  },
  of: function() {
    return this;
  },
  that: function() {
    return this;
  },
  // Alias
  since: function(since) {
    if (!since || !(since instanceof Date)) {
      throw new Error("since() must be called with a Date object");
    }

    return this.from(since);
  },
  until: function(until) {
    return this.to(until);
  },
  entire: function() {
    return this.all();
  },
  for: function(value) {
    if (!value || !isString(value)) {
      throw new Error(
        "for() must be called with an account id, charge id, customer id or file upload purpose"
      );
    }

    if (value.indexOf("acct_") === 0) {
      return this.setAccount(value);
    }

    this._chain.push("for");

    if (value.indexOf("cus_") === 0) {
      this._stripeOptions.customer = value;
    } else if (value.indexOf("ch_") === 0) {
      this._stripeOptions.charge = value;
    } else {
      this._stripeOptions.purpose = value;
    }

    return this;
  },
  // Chain
  find: function(limit) {
    this._chain.push("find");

    this._stripeOptions.limit = limit;
    this._options.retrieveAll = false;

    return this;
  },
  last: function(limit) {
    if (!limit || !isNumber(limit)) {
      throw new Error("last() must be called with a numeric value");
    }

    this._chain.push("last");

    this._stripeOptions.limit = limit;
    this._options.retrieveAll = false;

    return this;
  },
  all: function() {
    this._chain.push("all");

    this._stripeOptions.limit = this._stripeOptions.limit || 100;
    this._options.retrieveAll = true;
    this._options.type = undefined;

    return this;
  },
  are: function(status) {
    if (!status || !isString(status)) {
      throw new Error("are() must be called with a status string");
    }

    this._chain.push("are");

    this._stripeOptions.status = status;

    return this;
  },
  type: function(type) {
    if (!type || !isString(type)) {
      throw new Error("type() must be called with an event type");
    }

    this._chain.push("type");

    this._stripeOptions.type = type;

    return this;
  },
  available: function() {
    this._chain.push("available");

    return this;
  },
  before: function(before) {
    this._chain.push("before");

    if (before) {
      if (before instanceof Date) {
        let key = "created";

        if (this._chain.indexOf("available") >= 0) {
          key = "available_on";
        }

        this._stripeOptions[key] = this._stripeOptions[key] || {};
        this._stripeOptions[key].lt = Math.ceil(before.getTime() / 1000);
      } else if (isString(before) && before.indexOf("_") === 2) {
        this._stripeOptions.ending_before = before;
      } else {
        throw new Error(
          "before() must be called with a Stripe object id or Date object"
        );
      }
    }

    return this;
  },
  after: function(after) {
    this._chain.push("after");

    if (after) {
      if (after instanceof Date) {
        let key = "created";

        if (this._chain.indexOf("available") >= 0) {
          key = "available_on";
        }

        this._stripeOptions[key] = this._stripeOptions[key] || {};
        this._stripeOptions[key].gt = Math.floor(after.getTime() / 1000);
      } else if (isString(after) && after.indexOf("_") === 2) {
        this._stripeOptions.starting_after = after;
      } else {
        throw new Error(
          "after() must be called with a Stripe object id or Date object"
        );
      }
    }

    return this;
  },
  from: function(from) {
    this._chain.push("from");

    if (from) {
      if (from instanceof Date) {
        let key = "created";

        if (this._chain.indexOf("available") >= 0) {
          key = "available_on";
        }

        this._stripeOptions[key] = this._stripeOptions[key] || {};
        this._stripeOptions[key].gte = Math.floor(from.getTime() / 1000);
      } else {
        throw new Error("from() must be called with a Date object");
      }
    }

    return this;
  },
  to: function(to) {
    this._chain.push("to");

    if (to) {
      if (to instanceof Date) {
        let key = "created";

        if (this._chain.indexOf("available") >= 0) {
          key = "available_on";
        }

        this._stripeOptions[key] = this._stripeOptions[key] || {};
        this._stripeOptions[key].lte = Math.ceil(to.getTime() / 1000);
      } else {
        throw new Error("to() must be called with a Date object");
      }
    }

    return this;
  },
  now: function() {
    const prev = this._chain[this._chain.length - 1];

    if (prev !== "to") {
      throw new Error("now() must be preceded by to() or until()");
    }

    this._chain.push("now");

    this._stripeOptions.created = this._stripeOptions.created || {};
    this._stripeOptions.created.lte = Math.ceil(new Date().getTime() / 1000);

    return this;
  },
  // Parameters
  include: function(key) {
    this._stripeOptions["include[]"] = key;

    return this;
  },
  setAccount: function(account) {
    this._stripeExtras.stripe_account = account;

    return this;
  },
  // Chain context
  history: function() {
    this._chain.push("history");

    return this;
  },
  refunds: function() {
    this._chain.push("refunds");
    this._options.type = "refund";

    return this;
  },
  adjustments: function() {
    this._chain.push("adjustments");
    this._options.type = "adjustment";

    return this;
  },
  applicationFeeRefunds: function() {
    this._chain.push("applicationFeeRefunds");
    this._options.type = "applicationFeeRefund";

    return this;
  },
  transferFailures: function() {
    this._chain.push("transferFailures");
    this._options.type = "transferFailure";

    return this;
  },
  // Chain context and execute
  charges: function(progress, callback) {
    this._chain.push("charges");
    this._options.type = "charge";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  customers: function(progress, callback) {
    this._chain.push("customers");
    this._options.type = "customer";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  plans: function(progress, callback) {
    this._chain.push("plans");
    this._options.type = "plan";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  subscriptions: function(progress, callback) {
    this._chain.push("subscriptions");
    this._options.type = "subscription";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  coupons: function(progress, callback) {
    this._chain.push("coupons");
    this._options.type = "coupon";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  invoices: function(progress, callback) {
    this._chain.push("invoices");
    this._options.type = "invoice";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  invoiceItems: function(progress, callback) {
    this._chain.push("invoiceItems");
    this._options.type = "invoiceItem";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  transfers: function(progress, callback) {
    this._chain.push("transfers");
    this._options.type = "transfer";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  applicationFees: function(progress, callback) {
    this._chain.push("applicationFees");
    this._options.type = "applicationFee";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  accounts: function(progress, callback) {
    this._chain.push("accounts");
    this._options.type = "account";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  events: function(progress, callback) {
    this._chain.push("events");
    this._options.type = "event";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  bitcoinReceivers: function(progress, callback) {
    this._chain.push("bitcoinReceivers");
    this._options.type = "bitcoinReceiver";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  fileUploads: function(progress, callback) {
    this._chain.push("fileUploads");
    this._options.type = "fileUpload";

    if (isFunction(progress)) {
      return this.please(progress, callback);
    }

    return this;
  },
  // Execute
  list: function(progress, callback) {
    if (!isFunction(callback)) {
      callback = progress;
      progress = function() {};
    }

    const supportedObjects = [
      "charge",
      "customer",
      "plan",
      "coupon",
      "invoice",
      "invoiceItem",
      "transfer",
      "applicationFee",
      "account",
      "event",
      "bitcoinReceiver",
      "subscription",
      "fileUpload"
    ];
    const object = this._options.type;

    if (!object || supportedObjects.indexOf(object) < 0) {
      throw new Error(
        "list() must be called in context of a Stripe object (charges, refunds, etc)"
      );
    }

    if (object === "invoice") {
      this._stripeOptions.date = this._stripeOptions.created;
      this._stripeOptions.created = undefined;
    }

    const getObjects = data => {
      const options = this._options;
      const stripeOptions = this._stripeOptions;
      const stripeExtras = this._stripeExtras;

      data = data || [];

      if (
        (stripeOptions.limit > 100 || options.retrieveAll) &&
        data.length > 0
      ) {
        if (stripeOptions.limit > 100) {
          stripeOptions.limit -= data.length;
        }

        stripeOptions.starting_after = data[data.length - 1].id;
      }

      this._stripe[object + "s"].list(
        stripeOptions,
        stripeExtras,
        (err, objects) => {
          if (err) {
            this._reset();
            return callback(err);
          }

          data = data.concat(objects.data);
          progress(data.length, objects.total_count);

          if (
            objects.has_more &&
            (options.retrieveAll || stripeOptions.limit > 100)
          ) {
            getObjects(data);
          } else {
            objects = omit(objects, "data");
            objects.data = data;

            this._reset();
            callback(null, objects);
          }
        }
      );
    };

    getObjects();

    return this;
  },
  listTransactions: function(progress, callback) {
    if (!isFunction(callback)) {
      callback = progress;
      progress = function() {};
    }

    const supportedObjects = [
      "charge",
      "refund",
      "adjustment",
      "applicationFee",
      "applicationFeeRefund",
      "transfer",
      "transferFailure"
    ];
    const object = this._options.type;

    if (object) {
      if (supportedObjects.indexOf(object) >= 0) {
        this._stripeOptions.type = inflection.underscore(object);
      } else {
        throw new Error(
          "listTransactions() must be called without context or in context of a valid Stripe object (charges, refunds, etc)"
        );
      }
    }

    const getObjects = data => {
      const options = this._options;
      const stripeOptions = this._stripeOptions;
      const stripeExtras = this._stripeExtras;

      data = data || [];

      if (
        (stripeOptions.limit > 100 || options.retrieveAll) &&
        data.length > 0
      ) {
        if (stripeOptions.limit > 100) {
          stripeOptions.limit -= data.length;
        }

        stripeOptions.starting_after = data[data.length - 1].id;
      }

      this._stripe.balance.listTransactions(
        stripeOptions,
        stripeExtras,
        (err, objects) => {
          if (err) {
            this._reset();
            return callback(err);
          }

          data = data.concat(objects.data);
          progress(data.length, objects.total_count);

          if (
            objects.has_more &&
            (options.retrieveAll || stripeOptions.limit > 100)
          ) {
            getObjects(data);
          } else {
            objects = omit(objects, "data");
            objects.data = data;

            this._reset();
            callback(null, objects);
          }
        }
      );
    };

    getObjects();

    return this;
  },
  please: function(progress, callback) {
    if (this._chain.indexOf("history") >= 0) {
      return this.listTransactions(progress, callback);
    }

    return this.list(progress, callback);
  },
  // Private
  _chain: [],
  _options: {},
  _stripe: undefined,
  _stripeOptions: {},
  _stripeExtras: {
    stripe_account: undefined
  },
  _reset: function() {
    this._chain = [];
    this._options = {};
    this._stripeOptions = {};
  }
};

module.exports = StripeChainable;
