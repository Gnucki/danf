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
 *   -...
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
JoinReferenceProcessor.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Serialization.prototype.process = function(context, args, meta) {
    return context;
}