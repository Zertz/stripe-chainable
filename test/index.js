/* eslint no-unused-expressions: 0 */

var expect = require('chai').expect
var sinon = require('sinon')

describe('stripe-chainable', function () {
  var stripe = require('../')()

  var resetPrivate = function () {
    stripe._chain = []
    stripe._options = {}
    stripe._stripeOptions = {}
  }

  beforeEach(function () {
    stripe._stripe = {
      balance: {
        listTransactions: function (options, callback) {}
      },
      charges: {
        list: function (options, callback) {}
      },
      customers: {
        list: function (options, callback) {}
      },
      plans: {
        list: function (options, callback) {}
      },
      coupons: {
        list: function (options, callback) {}
      },
      invoices: {
        list: function (options, callback) {}
      },
      invoiceItems: {
        list: function (options, callback) {}
      },
      transfers: {
        list: function (options, callback) {}
      },
      applicationFees: {
        list: function (options, callback) {}
      },
      accounts: {
        list: function (options, callback) {}
      },
      events: {
        list: function (options, callback) {}
      },
      bitcoinReceivers: {
        list: function (options, callback) {}
      },
      fileUploads: {
        list: function (options, callback) {}
      },
      _errors: {
        invalid_request_error: (function () {
          var err = new Error('invalid_request_error')
          err.type = 'invalid_request_error'
          return err
        })()
      }
    }
  })

  describe('reset private variables', function () {
    it('does that', function () {
      stripe.all()._reset()

      expect(stripe._chain).to.be.empty
      expect(stripe._options).to.be.empty
      expect(stripe._stripeOptions).to.be.empty
    })

    after(function () {
      stripe._reset = function () {}
    })
  })

  describe('chainable operators by themselves, without parameters', function () {
    beforeEach(function () {
      resetPrivate()
    })

    it("'and' adds nothing to the chain and returns itself", function () {
      var self = stripe.and()

      expect(stripe._chain).to.be.empty
      expect(self).to.equal(stripe)
    })

    it("'of' adds nothing to the chain and returns itself", function () {
      var self = stripe.of()

      expect(stripe._chain).to.be.empty
      expect(self).to.equal(stripe)
    })

    it("'that' adds nothing to the chain and returns itself", function () {
      var self = stripe.that()

      expect(stripe._chain).to.be.empty
      expect(self).to.equal(stripe)
    })

    it("'since' adds nothing to the chain and throws an error", function () {
      expect(function () {
        stripe.since()
      }).to.throw('since() must be called with a Date object')

      expect(stripe._chain).to.be.empty
    })

    it("'until' adds 'to' to the chain and returns itself", function () {
      var self = stripe.until()

      expect(stripe._chain).to.have.members(['to'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'find' to the chain and returns itself", function () {
      var self = stripe.find()

      expect(stripe._chain).to.have.members(['find'])
      expect(stripe._stripeOptions.limit).to.be.undefined
      expect(stripe._options.retrieveAll).to.be.false
      expect(self).to.equal(stripe)
    })

    it("'last' adds nothing to the chain and throws an error", function () {
      expect(function () {
        stripe.last()
      }).to.throw('last() must be called with a numeric value')

      expect(stripe._chain).to.be.empty
    })

    it("adds 'all' to the chain and returns itself", function () {
      var self = stripe.all()

      expect(stripe._chain).to.have.members(['all'])
      expect(stripe._stripeOptions.limit).to.equal(100)
      expect(stripe._options.retrieveAll).to.be.true
      expect(stripe._options.type).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("'are' add nothing to the chain and throws an error", function () {
      var self

      expect(function () {
        self = stripe.are()
      }).to.throw('are() must be called with a status string')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeOptions.status).to.be.undefined
      expect(self).to.be.undefined
    })

    it("'type' adds nothing to the chain and throws an error", function () {
      var self

      expect(function () {
        self = stripe.type()
      }).to.throw('type() must be called with an event type')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeOptions.type).to.be.undefined
      expect(self).to.be.undefined
    })

    it("'entire' adds 'all' to the chain and returns itself", function () {
      var self = stripe.entire()

      expect(stripe._chain).to.have.members(['all'])
      expect(stripe._stripeOptions.limit).to.equal(100)
      expect(stripe._options.retrieveAll).to.be.true
      expect(stripe._options.type).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'available' to the chain and returns itself", function () {
      var self = stripe.available()

      expect(stripe._chain).to.have.members(['available'])
      expect(self).to.equal(stripe)
    })

    it("adds 'before' to the chain and returns itself", function () {
      var self = stripe.before()

      expect(stripe._chain).to.have.members(['before'])
      expect(stripe._stripeOptions.ending_before).to.be.undefined
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'after' to the chain and returns itself", function () {
      var self = stripe.after()

      expect(stripe._chain).to.have.members(['after'])
      expect(stripe._stripeOptions.starting_after).to.be.undefined
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'from' to the chain and returns itself", function () {
      var self = stripe.from()

      expect(stripe._chain).to.have.members(['from'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'to' to the chain and returns itself", function () {
      var self = stripe.to()

      expect(stripe._chain).to.have.members(['to'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'now' to the chain and throws an error", function () {
      expect(function () {
        stripe.now()
      }).to.throw('now() must be preceded by to() or until()')

      expect(stripe._chain).to.be.empty
    })

    it("does not add 'include' to the chain and returns itself", function () {
      var self = stripe.include()

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeOptions['include[]']).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it('setAccount does not add anything to the chain and returns itself', function () {
      var self = stripe.setAccount()

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeExtras.stripe_account).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("'for' without arguments throws an error", function () {
      var self

      expect(function () {
        self = stripe.for()
      }).to.throw('for() must be called with an account id, charge id, customer id or file upload purpose')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeExtras.stripe_account).to.be.undefined
      expect(stripe._stripeOptions.customer).to.be.undefined
      expect(stripe._stripeOptions.charge).to.be.undefined
      expect(stripe._stripeOptions.purpose).to.be.undefined
      expect(self).to.be.undefined
    })

    it("adds 'history' to the chain and returns itself", function () {
      var self = stripe.history()

      expect(stripe._chain).to.have.members(['history'])
      expect(stripe._options.type).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'adjustments' to the chain and returns itself", function () {
      var self = stripe.adjustments()

      expect(stripe._chain).to.have.members(['adjustments'])
      expect(stripe._options.type).to.equal('adjustment')
      expect(self).to.equal(stripe)
    })

    it("adds 'applicationFeeRefunds' to the chain and returns itself", function () {
      var self = stripe.applicationFeeRefunds()

      expect(stripe._chain).to.have.members(['applicationFeeRefunds'])
      expect(stripe._options.type).to.equal('applicationFeeRefund')
      expect(self).to.equal(stripe)
    })

    it("adds 'transfers' to the chain and returns itself", function () {
      var self = stripe.transfers()

      expect(stripe._chain).to.have.members(['transfers'])
      expect(stripe._options.type).to.equal('transfer')
      expect(self).to.equal(stripe)
    })

    it("adds 'transferFailures' to the chain and returns itself", function () {
      var self = stripe.transferFailures()

      expect(stripe._chain).to.have.members(['transferFailures'])
      expect(stripe._options.type).to.equal('transferFailure')
      expect(self).to.equal(stripe)
    })

    it("adds 'charges' to the chain and returns itself", function () {
      var self = stripe.charges()

      expect(stripe._chain).to.have.members(['charges'])
      expect(stripe._options.type).to.equal('charge')
      expect(self).to.equal(stripe)
    })

    it("adds 'refunds' to the chain and returns itself", function () {
      var self = stripe.refunds()

      expect(stripe._chain).to.have.members(['refunds'])
      expect(stripe._options.type).to.equal('refund')
      expect(self).to.equal(stripe)
    })

    it("adds 'customers' to the chain and returns itself", function () {
      var self = stripe.customers()

      expect(stripe._chain).to.have.members(['customers'])
      expect(stripe._options.type).to.equal('customer')
      expect(self).to.equal(stripe)
    })

    it("adds 'plans' to the chain and returns itself", function () {
      var self = stripe.plans()

      expect(stripe._chain).to.have.members(['plans'])
      expect(stripe._options.type).to.equal('plan')
      expect(self).to.equal(stripe)
    })

    it("adds 'coupons' to the chain and returns itself", function () {
      var self = stripe.coupons()

      expect(stripe._chain).to.have.members(['coupons'])
      expect(stripe._options.type).to.equal('coupon')
      expect(self).to.equal(stripe)
    })

    it("adds 'invoices' to the chain and returns itself", function () {
      var self = stripe.invoices()

      expect(stripe._chain).to.have.members(['invoices'])
      expect(stripe._options.type).to.equal('invoice')
      expect(self).to.equal(stripe)
    })

    it("adds 'invoiceItems' to the chain and returns itself", function () {
      var self = stripe.invoiceItems()

      expect(stripe._chain).to.have.members(['invoiceItems'])
      expect(stripe._options.type).to.equal('invoiceItem')
      expect(self).to.equal(stripe)
    })

    it("adds 'transfers' to the chain and returns itself", function () {
      var self = stripe.transfers()

      expect(stripe._chain).to.have.members(['transfers'])
      expect(stripe._options.type).to.equal('transfer')
      expect(self).to.equal(stripe)
    })

    it("adds 'applicationFees' to the chain and returns itself", function () {
      var self = stripe.applicationFees()

      expect(stripe._chain).to.have.members(['applicationFees'])
      expect(stripe._options.type).to.equal('applicationFee')
      expect(self).to.equal(stripe)
    })

    it("adds 'accounts' to the chain and returns itself", function () {
      var self = stripe.accounts()

      expect(stripe._chain).to.have.members(['accounts'])
      expect(stripe._options.type).to.equal('account')
      expect(self).to.equal(stripe)
    })

    it("adds 'events' to the chain and returns itself", function () {
      var self = stripe.events()

      expect(stripe._chain).to.have.members(['events'])
      expect(stripe._options.type).to.equal('event')
      expect(self).to.equal(stripe)
    })

    it("adds 'bitcoinReceivers' to the chain and returns itself", function () {
      var self = stripe.bitcoinReceivers()

      expect(stripe._chain).to.have.members(['bitcoinReceivers'])
      expect(stripe._options.type).to.equal('bitcoinReceiver')
      expect(self).to.equal(stripe)
    })

    it("adds 'fileUploads' to the chain and returns itself", function () {
      var self = stripe.fileUploads()

      expect(stripe._chain).to.have.members(['fileUploads'])
      expect(stripe._options.type).to.equal('fileUpload')
      expect(self).to.equal(stripe)
    })
  })

  describe('chainable operators by themselves, with parameters', function () {
    beforeEach(function () {
      resetPrivate()
    })

    it("'since' adds 'from' to the chain, sets 'created.gte' and returns itself", function () {
      var since = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.since(since)

      expect(stripe._chain).to.have.members(['from'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('gte', Math.floor(since.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("'since' adds nothing to the chain and throws an error", function () {
      expect(function () {
        stripe.since('this is not a date')
      }).to.throw('since() must be called with a Date object')

      expect(stripe._chain).to.be.empty
    })

    it("'until' adds 'to' to the chain, sets 'created.lte' and returns itself", function () {
      var until = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.until(until)

      expect(stripe._chain).to.have.members(['to'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('lte', Math.ceil(until.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'find' to the chain, sets 'limit' and returns itself", function () {
      var self = stripe.find(10)

      expect(stripe._chain).to.have.members(['find'])
      expect(stripe._stripeOptions.limit).to.equal(10)
      expect(stripe._options.retrieveAll).to.be.false
      expect(self).to.equal(stripe)
    })

    it("adds 'last' to the chain, sets 'limit' and returns itself", function () {
      var self = stripe.last(10)

      expect(stripe._chain).to.have.members(['last'])
      expect(stripe._stripeOptions.limit).to.equal(10)
      expect(stripe._options.retrieveAll).to.be.false
      expect(self).to.equal(stripe)
    })

    it("'last' adds nothing to the chain and throws an error", function () {
      expect(function () {
        stripe.last('not a number')
      }).to.throw('last() must be called with a numeric value')

      expect(stripe._chain).to.be.empty
    })

    it("adds 'are' to the chain, sets 'status' and returns itself", function () {
      var self = stripe.are('pending')

      expect(stripe._chain).to.have.members(['are'])
      expect(stripe._stripeOptions.status).to.equal('pending')
      expect(self).to.equal(stripe)
    })

    it("'are' adds nothing to the chain and throws an error", function () {
      var self

      expect(function () {
        self = stripe.are(42)
      }).to.throw('are() must be called with a status string')

      expect(stripe._chain).to.be.empty
      expect(self).to.be.undefined
    })

    it("adds 'type' to the chain, sets 'type' and returns itself", function () {
      var self = stripe.type('account.updated')

      expect(stripe._chain).to.have.members(['type'])
      expect(stripe._stripeOptions.type).to.equal('account.updated')
      expect(self).to.equal(stripe)
    })

    it("'type' adds nothing to the chain and throws an error", function () {
      var self

      expect(function () {
        self = stripe.type(42)
      }).to.throw('type() must be called with an event type')

      expect(stripe._chain).to.be.empty
      expect(self).to.be.undefined
    })

    it("adds 'before' to the chain, sets 'ending_before' and returns itself", function () {
      var self = stripe.before('xx_xxxxxxxxxxxxxxxxxxxxxxxx')

      expect(stripe._chain).to.have.members(['before'])
      expect(stripe._stripeOptions.ending_before).to.equal('xx_xxxxxxxxxxxxxxxxxxxxxxxx')
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'before' to the chain, sets 'created.lt' and returns itself", function () {
      var before = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.before(before)

      expect(stripe._chain).to.have.members(['before'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('lt', Math.ceil(before.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'before' to the chain and throws an error", function () {
      expect(function () {
        stripe.before('this is not an id nor a date')
      }).to.throw('before() must be called with a Stripe object id or Date object')

      expect(stripe._chain).to.have.members(['before'])
    })

    it("adds 'after' to the chain, sets 'ending_before' and returns itself", function () {
      var self = stripe.after('xx_xxxxxxxxxxxxxxxxxxxxxxxx')

      expect(stripe._chain).to.have.members(['after'])
      expect(stripe._stripeOptions.starting_after).to.equal('xx_xxxxxxxxxxxxxxxxxxxxxxxx')
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(self).to.equal(stripe)
    })

    it("adds 'after' to the chain, sets 'created.lt' and returns itself", function () {
      var after = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.after(after)

      expect(stripe._chain).to.have.members(['after'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('gt', Math.floor(after.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'after' to the chain and throws an error", function () {
      expect(function () {
        stripe.after('this is not an id nor a date')
      }).to.throw('after() must be called with a Stripe object id or Date object')

      expect(stripe._chain).to.have.members(['after'])
    })

    it("adds 'from' to the chain, sets 'created.gte' and returns itself", function () {
      var from = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.from(from)

      expect(stripe._chain).to.have.members(['from'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('gte', Math.floor(from.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'from' to the chain and throws an error", function () {
      expect(function () {
        stripe.from('this is not a date')
      }).to.throw('from() must be called with a Date object')

      expect(stripe._chain).to.have.members(['from'])
    })

    it("adds 'to' to the chain, sets 'created.lte' and returns itself", function () {
      var to = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.to(to)

      expect(stripe._chain).to.have.members(['to'])
      expect(stripe._stripeOptions.created).to.exist
      expect(stripe._stripeOptions.created).to.have.property('lte', Math.ceil(to.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'to' to the chain and throws an error", function () {
      expect(function () {
        stripe.to('this is not a date')
      }).to.throw('to() must be called with a Date object')

      expect(stripe._chain).to.have.members(['to'])
    })

    it("does not add 'include' to the chain, sets 'include[]' and returns itself", function () {
      var self = stripe.include('key')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeOptions['include[]']).to.equal('key')
      expect(self).to.equal(stripe)
    })

    it("setAccount does not add anything to the chain, sets 'stripe_account' and returns itself", function () {
      var self = stripe.setAccount('acct_x')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeExtras.stripe_account).to.equal('acct_x')
      expect(self).to.equal(stripe)
    })

    it("'for' is an alias for 'setAccount'", function () {
      var self = stripe.for('acct_x')

      expect(stripe._chain).to.be.empty
      expect(stripe._stripeExtras.stripe_account).to.equal('acct_x')
      expect(self).to.equal(stripe)
    })

    it("'for' sets customer id", function () {
      var self = stripe.for('cus_x')

      expect(stripe._chain).to.have.members(['for'])
      expect(stripe._stripeOptions.customer).to.equal('cus_x')
      expect(self).to.equal(stripe)
    })

    it("'for' sets charge id", function () {
      var self = stripe.for('ch_x')

      expect(stripe._chain).to.have.members(['for'])
      expect(stripe._stripeOptions.charge).to.equal('ch_x')
      expect(self).to.equal(stripe)
    })

    it("'for' sets purpose", function () {
      var self = stripe.for('identity_document')

      expect(stripe._chain).to.have.members(['for'])
      expect(stripe._stripeOptions.purpose).to.equal('identity_document')
      expect(self).to.equal(stripe)
    })
  })

  describe('combine chainable operators', function () {
    beforeEach(function () {
      resetPrivate()
    })

    it("adds 'available' to the chain, calls 'before()' and sets 'available_on'", function () {
      var before = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.available().before(before)

      expect(stripe._chain).to.have.members(['available', 'before'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(stripe._stripeOptions.available_on).to.exist
      expect(stripe._stripeOptions.available_on).to.have.property('lt', Math.ceil(before.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'available' to the chain, calls 'after()' and sets 'available_on'", function () {
      var after = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.available().after(after)

      expect(stripe._chain).to.have.members(['available', 'after'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(stripe._stripeOptions.available_on).to.exist
      expect(stripe._stripeOptions.available_on).to.have.property('gt', Math.floor(after.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'available' to the chain, calls 'from()' and sets 'available_on'", function () {
      var from = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.available().from(from)

      expect(stripe._chain).to.have.members(['available', 'from'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(stripe._stripeOptions.available_on).to.exist
      expect(stripe._stripeOptions.available_on).to.have.property('gte', Math.floor(from.getTime() / 1000))
      expect(self).to.equal(stripe)
    })

    it("adds 'available' to the chain, calls 'to()' and sets 'available_on'", function () {
      var to = new Date(2015, 4, 2, 12, 24, 48, 753)
      var self = stripe.available().to(to)

      expect(stripe._chain).to.have.members(['available', 'to'])
      expect(stripe._stripeOptions.created).to.be.undefined
      expect(stripe._stripeOptions.available_on).to.exist
      expect(stripe._stripeOptions.available_on).to.have.property('lte', Math.ceil(to.getTime() / 1000))
      expect(self).to.equal(stripe)
    })
  })

  describe('execute chainable operators by themselves, with parameters', function () {
    beforeEach(function () {
      resetPrivate()
    })

    it("adds 'charges' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.charges(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'charges' to the chain and calls callback", function () {
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.charges(callbackSpy)

      expect(stripe._chain).to.have.members(['charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'charges' to the chain, calls list's callback with an error", function () {
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.yields(stripe._stripe._errors.invalid_request_error)

      var self = stripe.charges(callbackSpy)

      expect(stripe._chain).to.have.members(['charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds nothing to the chain, calls listTransactions' callback with an error", function () {
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.balance, 'listTransactions')
      listStub.yields(stripe._stripe._errors.invalid_request_error)

      var self = stripe.listTransactions(callbackSpy)

      expect(stripe._chain).to.be.empty
      expect(stripe._options.type).to.be.undefined
      sinon.assert.calledOnce(callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'customers' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.customers, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'cus_xxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.customers(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['customers'])
      expect(stripe._options.type).to.equal('customer')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'plans' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.plans, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'gold'
        }]
      })

      var self = stripe.plans(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['plans'])
      expect(stripe._options.type).to.equal('plan')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'coupons' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.coupons, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': '25OFF'
        }]
      })

      var self = stripe.coupons(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['coupons'])
      expect(stripe._options.type).to.equal('coupon')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'invoices' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.invoices, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'in_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.invoices(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['invoices'])
      expect(stripe._options.type).to.equal('invoice')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'invoiceItems' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.invoiceItems, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ii_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.invoiceItems(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['invoiceItems'])
      expect(stripe._options.type).to.equal('invoiceItem')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'transfers' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.transfers, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'tr_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.transfers(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['transfers'])
      expect(stripe._options.type).to.equal('transfer')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'applicationFees' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.applicationFees, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'fee_xxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.applicationFees(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['applicationFees'])
      expect(stripe._options.type).to.equal('applicationFee')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'accounts' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.accounts, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'acct_xxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.accounts(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['accounts'])
      expect(stripe._options.type).to.equal('account')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'events' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.events, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'evt_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.events(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['events'])
      expect(stripe._options.type).to.equal('event')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'bitcoinReceivers' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.bitcoinReceivers, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'btcrcv_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.bitcoinReceivers(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['bitcoinReceivers'])
      expect(stripe._options.type).to.equal('bitcoinReceiver')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'fileUploads' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.fileUploads, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'file_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.fileUploads(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['fileUploads'])
      expect(stripe._options.type).to.equal('fileUpload')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })
  })

  describe('combine and execute chainable operators, without parameters', function () {
    beforeEach(function () {
      resetPrivate()
    })

    it("adds 'charges' to the chain, calls progress twice and then callback once", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.onFirstCall().yields(null, {
        'has_more': true,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })
      listStub.onSecondCall().yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.all().charges(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['all', 'charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledTwice(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'last' and 'charges' to the chain, calls progress twice and then callback once", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.onFirstCall().yields(null, {
        'has_more': true,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })
      listStub.onSecondCall().yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.last(150).charges(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['last', 'charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledTwice(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'history' and 'charges' to the chain and calls callback", function () {
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.balance, 'listTransactions')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.history().charges(callbackSpy)

      expect(stripe._chain).to.have.members(['history', 'charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'history' and 'charges' to the chain, calls progress and then callback", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.balance, 'listTransactions')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.history().charges(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['history', 'charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'history' and 'charges' to the chain, calls progress twice and then callback once", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.balance, 'listTransactions')
      listStub.onFirstCall().yields(null, {
        'has_more': true,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })
      listStub.onSecondCall().yields(null, {
        'has_more': false,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.entire().history().of().charges(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['all', 'history', 'charges'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledTwice(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("adds 'history' and 'charges' to the chain, calls progress twice and then callback once", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.balance, 'listTransactions')
      listStub.onFirstCall().yields(null, {
        'has_more': true,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })
      listStub.onSecondCall().yields(null, {
        'has_more': false,
        'data': [{
          'id': 'txn_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.last(150).charges().history().please(progressSpy, callbackSpy)

      expect(stripe._chain).to.have.members(['last', 'charges', 'history'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledTwice(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })

    it("sets type 'foo', calls 'listTransactions' and throws an error", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()
      var self

      expect(function () {
        stripe._options.type = 'foo'
        self = stripe.listTransactions(progressSpy, callbackSpy)
      }).to.throw('listTransactions() must be called without context or in context of a valid Stripe object (charges, refunds, etc)')

      sinon.assert.notCalled(progressSpy)
      sinon.assert.notCalled(callbackSpy)
      expect(self).to.be.undefined
    })

    it("adds 'all' to the chain, calls 'list' and throws an error", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()
      var self

      expect(function () {
        self = stripe.all().list(progressSpy, callbackSpy)
      }).to.throw('list() must be called in context of a Stripe object (charges, refunds, etc)')

      expect(stripe._chain).to.have.members(['all'])
      expect(stripe._options.type).to.be.undefined
      sinon.assert.notCalled(progressSpy)
      sinon.assert.notCalled(callbackSpy)
      expect(self).to.be.undefined
    })

    it("adds nothing to the chain, calls 'list' and throws an error", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()
      var self

      expect(function () {
        self = stripe.list(progressSpy, callbackSpy)
      }).to.throw('list() must be called in context of a Stripe object (charges, refunds, etc)')

      expect(stripe._chain).to.be.empty
      expect(stripe._options.type).to.be.undefined
      sinon.assert.notCalled(progressSpy)
      sinon.assert.notCalled(callbackSpy)
      expect(self).to.be.undefined
    })

    it("adds 'all' to the chain, calls 'list' and throws an error", function () {
      var progressSpy = sinon.spy()
      var callbackSpy = sinon.spy()

      var listStub = sinon.stub(stripe._stripe.charges, 'list')
      listStub.yields(null, {
        'has_more': false,
        'data': [{
          'id': 'ch_xxxxxxxxxxxxxxxxxxxxxxxx'
        }]
      })

      var self = stripe.all().charges().until().now().list(progressSpy, callbackSpy)
      expect(stripe._chain).to.have.members(['all', 'charges', 'to', 'now'])
      expect(stripe._options.type).to.equal('charge')
      sinon.assert.calledOnce(progressSpy)
      sinon.assert.calledOnce(callbackSpy)
      sinon.assert.callOrder(progressSpy, callbackSpy)
      expect(self).to.equal(stripe)
    })
  })
})
