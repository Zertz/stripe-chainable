// Modules
var _ = require('lodash');

function StripeChainable(key, version) {
  if (!(this instanceof StripeChainable)) {
    return new StripeChainable(key, version);
  }
  
  this._stripe = require('stripe')(key, version);
}

StripeChainable.prototype = {
  // Sugar
  and: function() {
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
  // Chain
  find: function(limit) {
    this._chain.push('find');
    
    this._stripeOptions.limit = limit;
    this._options.retrieveAll = false;
    
    return this;
  },
  all: function() {
    this._chain.push('all');
    
    this._stripeOptions.limit = this._stripeOptions.limit || 100;
    this._options.retrieveAll = true;
    this._options.type = undefined;
    
    return this;
  },
  before: function(before) {
    this._chain.push('before');
    
    if (before) {
      if (before instanceof Date) {
        this._stripeOptions.created = this._stripeOptions.created || {};
        this._stripeOptions.created.lt = Math.ceil(before.getTime() / 1000);
      } else if (_.isString(before) && before.indexOf('_') === 2) {
        this._stripeOptions.ending_before = before;
      } else {
        throw new Error("before() must be called with a Stripe object id or Date object");
      }
    }
    
    return this;
  },
  after: function(after) {
    this._chain.push('after');
    
    if (after) {
      if (after instanceof Date) {
        this._stripeOptions.created = this._stripeOptions.created || {};
        this._stripeOptions.created.gt = Math.floor(after.getTime() / 1000);
      } else if (_.isString(after) && after.indexOf('_') === 2) {
        this._stripeOptions.starting_after = after;
      } else {
        throw new Error("after() must be called with a Stripe object id or Date object");
      }
    }
    
    return this;
  },
  from: function(from) {
    this._chain.push('from');
    
    if (from) {
      if (from instanceof Date) {
        this._stripeOptions.created = this._stripeOptions.created || {};
        this._stripeOptions.created.gte = Math.floor(from.getTime() / 1000);
      } else {
        throw new Error("from() must be called with a Date object");
      }
    }
    
    return this;
  },
  to: function(to) {
    this._chain.push('to');
    
    if (to) {
      if (to instanceof Date) {
        this._stripeOptions.created = this._stripeOptions.created || {};
        this._stripeOptions.created.lte = Math.ceil(to.getTime() / 1000);
      } else {
        throw new Error("to() must be called with a Date object");
      }
    }
    
    return this;
  },
  now: function() {
    var prev = this._chain[this._chain.length - 1];
    
    if (prev !== 'to') {
      throw new Error("now() must be preceded by to() or until()");
    }
    
    this._chain.push('now');
    
    this._stripeOptions.created = this._stripeOptions.created || {};
    this._stripeOptions.created.lte = Math.ceil((new Date).getTime() / 1000);
    
    return this;
  },
  // Parameters
  include: function(key) {
    this._stripeOptions['include[]'] = key;
    
    return this;
  },
  set: function(key, value) {
    this._stripeOptions[key] = value;
    
    return this;
  },
  // Chain or execute
  charges: function(progress, callback) {
    this._chain.push('charges');
    
    if (_.isFunction(progress)) {
      return this.list(progress, callback);
    }
    
    this._options.type = 'charges';
    
    return this;
  },
  refunds: function(progress, callback) {
    this._chain.push('refunds');
    
    if (_.isFunction(progress)) {
      return this.list(progress, callback);
    }
    
    this._options.type = 'refunds';
    
    return this;
  },
  // Execute
  history: function(callback) {
    this._stripeOptions.type = this._options.type;
    
    this._stripe.balance.listTransactions(this._stripeOptions, function(err, transactions) {
      callback(err, transactions);
    });
    
    return this;
  },
  list: function(progress, callback) {
    if (!_.isFunction(callback)) {
      callback = progress;
      progress = function() {};
    }
    
    var objectMethods = ['charges', 'refunds'],
        object = this._options.type || (this._chain.length > 0 ? this._chain[this._chain.length - 1] : null);
    
    if (!object || objectMethods.indexOf(object) < 0) {
      throw new Error("list() must be preceded by a object method (charges, refunds, etc)");
    }
    
    (function getObjects(self, data) {
      var options = self._options,
          stripeOptions = self._stripeOptions;
          
      if ((options.limit > 100 || options.retrieveAll) && data.length > 0) {
        stripeOptions.starting_after = data[data.length - 1].id;
      }
      
      self._stripe[object].list(stripeOptions, function(err, objects) {
        if (err) {
          return callback(err);
        }
        
        data = data.concat(objects.data);
        progress(data.length, objects.total_count);
        
        if (objects.has_more && options.retrieveAll) {
          getObjects(self, data);
        } else {
          var list = _.omit(objects, 'data');
          list.data = data;
          
          callback(null, list);
        }
      });
    })(this, []);
    
    return this;
  },
  // Private
  _chain: [],
  _options: {
    retrieveAll: false
  },
  _stripe: undefined,
  _stripeOptions: {
    type: undefined,
    limit: undefined,
    'include[]': undefined
  }
};

module.exports = StripeChainable;
