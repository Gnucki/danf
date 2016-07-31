'use strict';

/**
 * Expose `Operation`.
 */
module.exports = Operation;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new operation reference processor.
 *
 * Process:
 *   #+5: add 5 to the current value
 *   #-2: substract 2 to the current value
 *   #*3: multiply 3 to the current value
 *   #/10: divide the current value by 10
 *   #%5: remainder of the current value modulo 5
 */
function Operation() {
}

utils.extend(Abstract, Operation);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Operation.prototype, 'prefix', {
    value: '#'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Operation.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Operation.prototype.process = function(context, args, meta) {
    return context;
}
