'use strict';

/**
 * Expose `Default`.
 */
module.exports = Default;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new default reference processor.
 *
 * Process:
 *   :2 => set value to 2 if current one is null
 *   :foo => set value to "foo" if current one is null
 *   :{"foo": "bar"} => set value to {foo: 'bar'} if current one is null
 */
function Default() {
}

utils.extend(Abstract, Default);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Default.prototype, 'prefix', {
    value: ':'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Default.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Default.prototype.process = function(context, args, meta) {
    return context;
}
