# After Event Emitter

```
npm install after-events
```

Publisher/Subscriber Pattern implementation.

## Differences from Node's EventEmitter

*  .after(cb) method (see below)
*  Listeners that throw errors are caught and logged to console.
*  Listeners happen during their own turn.
*  Listener can only listen a maximum of one time with .on()
*  "removeListener" is called "off"
*  No way to see if the listener is listening.  (unused)
*  No "addListener" alias
*  No domains                                   (unused)
*  No erroring on unhandled error event.        (unused)
*  No maximum listener count.                   (unused)
*  No prototype/No `new` needed to create.

If you need one of the features this lacks that is marked unused, feel free to send a pull request/file an issue.

### after(callback: function (err: Error U undefined, res: Any U undefined, type: String, ...args: Any)): undefined

* callback is ran after every listener returns.
* First parameter to the callback is the error/rejected value of the listener, if there is one.
* Second parameter to the callback is the return value of the listener, if there is one.
* The rest of the parameters are the parameters sent to the .emit() that triggered the listener.
* Calling it multiple times adds more callbacks to be called in order of addition.

### Example

```
// This is really contrived!

var eventEmitter = require('after-events');
var format = require('util').format;

eventEmitter.after(function (err, ret, eventname, eventarg) {
    console.log(format('%s + 1 = %s', eventarg, ret));
});

eventEmitter.on('number', function (number) {
    return number + 1;
});

eventEmitter.emit('number', 2);
// Console logs '2 + 1 = 3'

eventEmitter.emit('number', 5);
// Console.logs '5 + 1 = 6'
```

For a realistic example, see [https://github.com/Tennu/tennu/blob/master/lib/command-handler.js](Tennu's Command Handler).

### Tests and Building

To build the test file, use `./fez.js`.

To run the test file, use `mocha test.js`.