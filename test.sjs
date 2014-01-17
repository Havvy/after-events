const sinon = require('sinon');
const assert = require('better-assert');
const equal = require('deep-eql');
const inspect = require('util').inspect;
const format = require('util').format;

const debug = false;
const log = debug ? console.log.bind(console) : function () {};

const EventEmiter = require('./after-events.js');

describe 'After Event Emitter' {
    var EE;

    beforeEach {
        log(/* newline */);
        EE = EventEmiter();
    }

    it 'works as an event emitter.' (done) {
        EE.on('x', function (arg1, arg2) { 
            assert(arg1 === true);
            assert(arg2 === false);
            done()
        });

        EE.emit('x', true, false);
    }

    it 'does not throw on non-existent events.' (done) {
        EE.emit('y');
        done();
    }

    describe '#after' {
        it 'takes a function, which it calls after the listener returns.' (done) {
            EE.on('x', function () {return true;});
            EE.after(function (err, ret, emitted, arg1, arg2) {
                assert(err === undefined);
                assert(ret === true);
                assert(emitted === 'x');
                assert(arg1 === true);
                assert(arg2 === false);
                done();
            });
            EE.emit('x', true, false);
        }

        it 'passes the error to err if an error is thrown' (done) {
            const error = new Error();
            EE.on('x', function () {throw error});
            EE.after(function (err, ret, emitted) {
                assert(err === error);
                assert(ret === undefined);
                done();
            });
            EE.emit('x');
        }

        it 'can take multiple functions, and call them in order' (done) {
            var callCount = 0;

            EE.on('x', function () { return true; });
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
        }
    }
}