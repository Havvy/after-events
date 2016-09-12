/**
 *
 * Event Emitter
 *
 * Publisher/Subscriber Pattern implementation.
 *
 * Differences from Node's EventEmitter:
 *   .after(cb) method (see below)
 *   Listeners that throw errors are caught and logged to console.
 *   Listeners happen during their own turn.
 *   Listener can only listen a maximum of one time with .on()
 *   "removeListener" is called "off"
 *   No way to see if the listener is listening.  (unused)
 *   No "addListener" alias
 *   No domains                                   (unused)
 *   No erroring on unhandled error event.        (unused)
 *   No maximum listener count.                   (unused)
 *   No prototype/No `new` needed to create.
 *
 * after(callback: function (err: Error U undefined, res: Any U undefined, type: String, ...args: Any)): undefined
 *   callback is ran after every listener returns.
 *   First parameter to the callback is the error of the listener, if there is one.
 *   Second parameter to the callback is the return value of the listener, if there is one.
 *   The rest of the parameters are the parameters sent to the .emit() that triggered the listener.
 *
 * If you need one of the features this lacks that is marked unused, feel free to send a pull request/file an issue.
 */

const Promise = require('bluebird');

const EventEmitter = function () {
    const events = {};               // Object<Set<Fn(_) -> _>>
    var postListenerCallbacks = [];  // [Fn(Error, any, String, ...any) -> void]

    return {
        on: function (type, listener) {
            if (!events[type]) {
                events[type] = new Set();
            }

            events[type].add(listener);
        },
        once: function (type, listener) {
            const that = this;

            const o = () => {
                this.off(type, o);
                return listener.apply(null, Array.prototype.slice.call(arguments));
            };

            this.on(type, o);
        },
        off: function (type, listener) {
            if (type in events) {
                events[type].delete(listener);
            }
        },
        emit: function (type) {
            const args = Array.prototype.slice.call(arguments, 1);

            if (!events[type]) {
                return;
            }

            events[type].forEach(function (listener) {
                Promise.try(listener, args)
                .then(function (res) {
                    postListenerCallbacks.forEach(function (listenerCallback) {
                        listenerCallback.apply(null, [undefined, res, type].concat(args));
                    });
                }, function (err) {
                    postListenerCallbacks.forEach(function (listenerCallback) {
                        listenerCallback.apply(null, [err, undefined, type].concat(args));
                    });
                })
                // Catch errors in after chain
                .catch(function (err) {
                    console.log(err.name);
                    console.log(err.stack);
                    throw err;
                });
            });
        },

        after: function (callback) {
            postListenerCallbacks.push(callback);
        }
    };
};

module.exports = EventEmitter;