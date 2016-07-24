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
 * Initialize a new select reference processor.
 *
 * Process:
 *   #...
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
JoinReferenceProcessor.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Operation.prototype.process = function(context, args, meta) {
    return context;
}