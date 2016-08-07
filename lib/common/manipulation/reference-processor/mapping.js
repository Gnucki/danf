'use strict';

/**
 * Expose `Mapping`.
 */
module.exports = Mapping;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new mapping reference processor.
 *
 * Process:
 *   :a:.b: map property b of current context to property a of the new context
 *   :a:.b,c:"d": map property b to a and set string "d" in property c
 */
function Mapping() {
}

utils.extend(Abstract, Mapping);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Mapping.prototype, 'prefix', {
    value: ':'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Mapping.prototype.parseParameters = function(serializedParameters) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Mapping.prototype.processContext = function(context, parameters, stream) {
    return context;
}
