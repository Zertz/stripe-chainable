// tests/index.js

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    util = require('util');

describe("stripe-chainable", function() {
  var stripe = require('../')();
  
  var resetPrivate = function() {
    stripe._chain = [];
    
    stripe._options = {
      _retrieveAll: false
    };
    
    stripe._stripeOptions = {
      _type: undefined,
      _limit: undefined,
      "include[]": undefined
    };
  };
  
  beforeEach(function() {
    stripe._stripe = {
      charges: {
        list: function(options, callback) {}
      },
      refunds: {
        list: function(options, callback) {}
      },
      _errors: {
        invalid_request_error: (function() {
          var err = new Error("invalid_request_error");
          err.type = "invalid_request_error";
          return err;
        })()
      }
    };
  });
  
  describe("chainable operators by themselves, without parameters", function() {
    beforeEach(resetPrivate)
    
    it("adds 'and' to the chain and returns itself", function() {
      var self = stripe.and();
      
      expect(stripe._chain).to.be.empty;
      expect(self).to.equal(stripe);
    });
    
    it("'since' adds nothing to the chain and throws an error", function() {
      expect(function() {
        stripe.since();
      }).to.throw("since() must be called with a Date object");
      
      expect(stripe._chain).to.be.empty;
    });
    
    it("'until' adds 'to' to the chain and returns itself", function() {
      var self = stripe.until();
      
      expect(stripe._chain).to.have.members(['to']);
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'find' to the chain and returns itself", function() {
      var self = stripe.find();
      
      expect(stripe._chain).to.have.members(['find']);
      expect(stripe._stripeOptions.limit).to.be.undefined;
      expect(stripe._options.retrieveAll).to.be.false;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'all' to the chain and returns itself", function() {
      var self = stripe.all();
      
      expect(stripe._chain).to.have.members(['all']);
      expect(stripe._stripeOptions.limit).to.equal(100);
      expect(stripe._options.retrieveAll).to.be.true;
      expect(stripe._options.type).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'before' to the chain and returns itself", function() {
      var self = stripe.before();
      
      expect(stripe._chain).to.have.members(['before']);
      expect(stripe._stripeOptions.ending_before).to.be.undefined;
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'after' to the chain and returns itself", function() {
      var self = stripe.after();
      
      expect(stripe._chain).to.have.members(['after']);
      expect(stripe._stripeOptions.starting_after).to.be.undefined;
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'from' to the chain and returns itself", function() {
      var self = stripe.from();
      
      expect(stripe._chain).to.have.members(['from']);
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'to' to the chain and returns itself", function() {
      var self = stripe.to();
      
      expect(stripe._chain).to.have.members(['to']);
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'now' to the chain and throws an error", function() {
      expect(function() {
        stripe.now();
      }).to.throw("now() must be preceded by to() or until()");
      
      expect(stripe._chain).to.be.empty;
    });
    
    it("adds 'include' to the chain and returns itself", function() {
      var self = stripe.include();
      
      expect(stripe._chain).to.have.members(['include']);
      expect(stripe._stripeOptions['include[]']).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("does not add 'set' to the chain and returns itself", function() {
      var self = stripe.set('key');
      
      expect(stripe._chain).to.be.empty;
      expect(stripe._stripeOptions['key']).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'charges' to the chain and returns itself", function() {
      var self = stripe.charges();
      
      expect(stripe._chain).to.have.members(['charges']);
      expect(stripe._options.type).to.equal('charges');
      expect(self).to.equal(stripe);
    });
    
    it("adds 'refunds' to the chain and returns itself", function() {
      var self = stripe.refunds();
      
      expect(stripe._chain).to.have.members(['refunds']);
      expect(stripe._options.type).to.equal('refunds');
      expect(self).to.equal(stripe);
    });
  });
  
  describe("chainable operators by themselves, with parameters", function() {
    beforeEach(resetPrivate);
    
    it("'since' adds 'from' to the chain, sets 'created.gte' and returns itself", function() {
      var since = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.since(since);
      
      expect(stripe._chain).to.have.members(['from']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('gte', Math.floor(since.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("'since' adds nothing to the chain and throws an error", function() {
      expect(function() {
        stripe.since('this is not a date');
      }).to.throw("since() must be called with a Date object");
      
      expect(stripe._chain).to.be.empty;
    });
    
    it("'until' adds 'to' to the chain, sets 'created.lte' and returns itself", function() {
      var until = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.until(until);
      
      expect(stripe._chain).to.have.members(['to']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('lte', Math.ceil(until.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("adds 'find' to the chain, sets 'limit' and returns itself", function() {
      var self = stripe.find(10);
      
      expect(stripe._chain).to.have.members(['find']);
      expect(stripe._stripeOptions.limit).to.equal(10);
      expect(stripe._options.retrieveAll).to.be.false;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'before' to the chain, sets 'ending_before' and returns itself", function() {
      var self = stripe.before('xx_xxxxxxxxxxxxxxxxxxxxxxxx');
      
      expect(stripe._chain).to.have.members(['before']);
      expect(stripe._stripeOptions.ending_before).to.equal('xx_xxxxxxxxxxxxxxxxxxxxxxxx');
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'before' to the chain, sets 'created.lt' and returns itself", function() {
      var before = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.before(before);
      
      expect(stripe._chain).to.have.members(['before']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('lt', Math.ceil(before.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("adds 'before' to the chain and throws an error", function() {
      expect(function() {
        stripe.before('this is not an id nor a date');
      }).to.throw("before() must be called with a Stripe object id or Date object");
      
      expect(stripe._chain).to.have.members(['before']);
    });
    
    it("adds 'after' to the chain, sets 'ending_before' and returns itself", function() {
      var self = stripe.after('xx_xxxxxxxxxxxxxxxxxxxxxxxx');
      
      expect(stripe._chain).to.have.members(['after']);
      expect(stripe._stripeOptions.starting_after).to.equal('xx_xxxxxxxxxxxxxxxxxxxxxxxx');
      expect(stripe._stripeOptions.created).to.be.undefined;
      expect(self).to.equal(stripe);
    });
    
    it("adds 'after' to the chain, sets 'created.lt' and returns itself", function() {
      var after = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.after(after);
      
      expect(stripe._chain).to.have.members(['after']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('gt', Math.floor(after.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("adds 'after' to the chain and throws an error", function() {
      expect(function() {
        stripe.after('this is not an id nor a date');
      }).to.throw("after() must be called with a Stripe object id or Date object");
      
      expect(stripe._chain).to.have.members(['after']);
    });
    
    it("adds 'from' to the chain, sets 'created.gte' and returns itself", function() {
      var from = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.from(from);
      
      expect(stripe._chain).to.have.members(['from']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('gte', Math.floor(from.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("adds 'from' to the chain and throws an error", function() {
      expect(function() {
        stripe.from('this is not a date');
      }).to.throw("from() must be called with a Date object");
      
      expect(stripe._chain).to.have.members(['from']);
    });
    
    it("adds 'to' to the chain, sets 'created.lte' and returns itself", function() {
      var to = new Date(2015, 4, 2, 12, 24, 48, 753),
          self = stripe.to(to);
      
      expect(stripe._chain).to.have.members(['to']);
      expect(stripe._stripeOptions.created).to.exist;
      expect(stripe._stripeOptions.created).to.have.property('lte', Math.ceil(to.getTime() / 1000));
      expect(self).to.equal(stripe);
    });
    
    it("adds 'to' to the chain and throws an error", function() {
      expect(function() {
        stripe.to('this is not a date');
      }).to.throw("to() must be called with a Date object");
      
      expect(stripe._chain).to.have.members(['to']);
    });
    
    it("adds 'include' to the chain, sets 'include[]' and returns itself", function() {
      var self = stripe.include('key');
      
      expect(stripe._chain).to.have.members(['include']);
      expect(stripe._stripeOptions['include[]']).to.equal('key');
      expect(self).to.equal(stripe);
    });
    
    it("does not add 'include' to the chain, sets 'include[]' and returns itself", function() {
      var self = stripe.set('key', 'value');
      
      expect(stripe._chain).to.be.empty;
      expect(stripe._stripeOptions['key']).to.equal('value');
      expect(self).to.equal(stripe);
    });
  });
  
  describe("execute chainable operators by themselves, with parameters", function() {
    beforeEach(resetPrivate);
    
    it("adds 'charges' to the chain, calls progress and then callback", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.charges, 'list');
      listStub.yields(null, {
        "has_more": false,
        "data": [{
          "id": "ch_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      
      var self = stripe.charges(progressSpy, callbackSpy);
      
      expect(stripe._chain).to.have.members(['charges']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.calledOnce(progressSpy);
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.callOrder(progressSpy, callbackSpy);
      expect(self).to.equal(stripe);
    });
    
    it("adds 'charges' to the chain and calls callback", function() {
      var callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.charges, 'list');
      listStub.yields(null, {
        "has_more": false,
        "data": [{
          "id": "ch_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      
      var self = stripe.charges(callbackSpy);
      
      expect(stripe._chain).to.have.members(['charges']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.calledOnce(callbackSpy);
      expect(self).to.equal(stripe);
    });
    
    it("adds 'charges' to the chain and calls callback with an error", function() {
      var callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.charges, 'list');
      listStub.yields(stripe._stripe._errors.invalid_request_error);
      
      var self = stripe.charges(callbackSpy);
      
      expect(stripe._chain).to.have.members(['charges']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.calledOnce(callbackSpy);
      expect(self).to.equal(stripe);
    });
    
    it("adds 'refunds' to the chain, calls progress and then callback", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.refunds, 'list');
      listStub.yields(null, {
        "has_more": false,
        "data": [{
          "id": "re_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      
      var self = stripe.refunds(progressSpy, callbackSpy);
      
      expect(stripe._chain).to.have.members(['refunds']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.calledOnce(progressSpy);
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.callOrder(progressSpy, callbackSpy);
      expect(self).to.equal(stripe);
    });
  });
  
  describe("combine and execute chainable operators, without parameters", function() {
    beforeEach(resetPrivate);
    
    it("adds 'charges' to the chain, calls progress twice and then callback once", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.charges, 'list');
      listStub.onFirstCall().yields(null, {
        "has_more": true,
        "data": [{
          "id": "ch_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      listStub.onSecondCall().yields(null, {
        "has_more": false,
        "data": [{
          "id": "ch_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      
      var self = stripe.all().charges(progressSpy, callbackSpy);
      
      expect(stripe._chain).to.have.members(['all', 'charges']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.calledTwice(progressSpy);
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.callOrder(progressSpy, progressSpy, callbackSpy);
      expect(self).to.equal(stripe);
    });
    
    it("adds 'all' to the chain, calls 'list' and throws an error", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy(),
          self;
          
      expect(function() {
        self = stripe.all().list(progressSpy, callbackSpy);
      }).to.throw("list() must be preceded by a object method (charges, refunds, etc)");
      
      expect(stripe._chain).to.have.members(['all']);
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.notCalled(progressSpy);
      sinon.assert.notCalled(callbackSpy);
      expect(self).to.be.undefined;
    });
    
    it("adds nothing to the chain, calls 'list' and throws an error", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy(),
          self;
          
      expect(function() {
        self = stripe.list(progressSpy, callbackSpy);
      }).to.throw("list() must be preceded by a object method (charges, refunds, etc)");
      
      expect(stripe._chain).to.be.empty;
      expect(stripe._options.type).to.be.undefined;
      sinon.assert.notCalled(progressSpy);
      sinon.assert.notCalled(callbackSpy);
      expect(self).to.be.undefined;
    });
    
    it("adds 'all' to the chain, calls 'list' and throws an error", function() {
      var progressSpy = sinon.spy(),
          callbackSpy = sinon.spy();
          
      var listStub = sinon.stub(stripe._stripe.charges, 'list');
      listStub.yields(null, {
        "has_more": false,
        "data": [{
          "id": "ch_xxxxxxxxxxxxxxxxxxxxxxxx"
        }]
      });
      
      var self = stripe.all().charges().until().now().list(progressSpy, callbackSpy);
      expect(stripe._chain).to.have.members(['all', 'charges', 'to', 'now']);
      expect(stripe._options.type).to.equal('charges');
      sinon.assert.calledOnce(progressSpy);
      sinon.assert.calledOnce(callbackSpy);
      sinon.assert.callOrder(progressSpy, callbackSpy);
      expect(self).to.equal(stripe);
    });
  });
});
