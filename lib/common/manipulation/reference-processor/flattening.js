'use strict';

/**
 * Expose `Flattening`.
 */
module.exports = Flattening;

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
 *   _...
 */
function Flattening() {
}

utils.extend(Abstract, Flattening);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Flattening.prototype, 'prefix', {
    value: '_'
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
Flattening.prototype.process = function(context, args, meta) {
    return context;
}