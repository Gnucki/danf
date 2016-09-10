'use strict';

/**
 * Expose `Duplicating`.
 */
module.exports = Duplicating;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new duplicating reference processor.
 *
 * Process:
 *   ^: remove duplicated values of an array
 */
function Duplicating() {
}

utils.extend(Abstract, Duplicating);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Duplicating.prototype, 'prefix', {
    value: '^'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Duplicating.prototype.parseParameters = function(serializedParameters) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Duplicating.prototype.processContext = function(context, parameters, stream) {
    return context;
}