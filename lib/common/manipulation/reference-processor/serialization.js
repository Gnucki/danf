'use strict';

/**
 * Expose `Serialization`.
 */
module.exports = Serialization;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new serialization reference processor.
 *
 * Process:
 *   -: serialize the current value in a JSON string
 *   -2: serialize the current value with 2 formatting spaces
 *   -!: unserialize the current value
 */
function Serialization() {
}

utils.extend(Abstract, Serialization);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Serialization.prototype, 'prefix', {
    value: '-'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Serialization.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Serialization.prototype.process = function(context, args, meta) {
    return context;
}
