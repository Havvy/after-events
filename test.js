const sinon = require('sinon');
const assert = require('better-assert');
const equal = require('deep-eql');
const inspect = require('util').inspect;
const format = require('util').format;
const debug = false;
const log = debug ? console.log.bind(console) : function () {
    };
const EventEmiter = require('./after-events.js');
describe('After Event Emitter', function () {
    var EE;
    beforeEach(function () {
        log();
        EE = EventEmiter();
    });
    it('works as an event emitter.', function (done) {
        EE.on('x', function (arg1, arg2) {
            assert(arg1 === true);
            assert(arg2 === false);
            done();
        });
        EE.emit('x', true, false);
    });
    it('does not throw on non-existent events.', function (done) {
        EE.emit('y');
        done();
    });
    describe('#after', function () {
        it('takes a function, which it calls after the listener returns.', function (done) {
            EE.on('x', function () {
                return true;
            });
            EE.after(function (err, ret, emitted, arg1, arg2) {
                assert(err === undefined);
                assert(ret === true);
                assert(emitted === 'x');
                assert(arg1 === true);
                assert(arg2 === false);
                done();
            });
            EE.emit('x', true, false);
        });
        it('passes the error to err if an error is thrown', function (done) {
            const error = new Error();
            EE.on('x', function () {
                throw error;
            });
            EE.after(function (err, ret, emitted) {
                assert(err === error);
                assert(ret === undefined);
                done();
            });
            EE.emit('x');
        });
        it('can take multiple functions, and call them in order', function (done) {
            var callCount = 0;
            EE.on('x', function () {
                return true;
            });
            EE.after(function (err, ret, emitted) {
                try {
                    assert(callCount === 0);
                    callCount += 1;
                } catch (e) {
                    done(e);
                }
            });
            EE.after(function (err, ret, emitted) {
                try {
                    assert(callCount === 1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            EE.emit('x');
        });
    });
    it('performs each callback in isolation', function (done) {
        var error = new Error();
        var result = {};
        EE.on('x', function () {
            throw error;
        });
        EE.on('x', function () {
            return result;
        });
        var callCount = 0;
        var errCount = 0;
        var resCount = 0;
        EE.after(function state(err, ret, emitted) {
            callCount += 1;
            if (err) {
                errCount += 1;
            }
            if (ret) {
                resCount += 1;
            }
            if (callCount === 2) {
                assert(errCount === 1);
                assert(resCount === 1);
                done();
            }
        });
        EE.emit('x');
    });
});
//# sourceMappingURL=../sourcemaps/test.js.map