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
 * Initialize a new flattening reference processor.
 *
 * Process:
 *   _ => flatten an object to a flat map with a "." between each key
 *   _1 => flatten an object on 1 level with a "." between each key
 *   _,- => flatten an object to a flat map with a "-" between each key
 *   _1,- => flatten an object on 1 level with a "-" between each key
 *   _! => straighten a flat object assuming that a "." is separating each key
 *   _!1 => straighten a flat object on 1 level assuming that a "." is separating each key
 *   _!,- => straighten a flat object assuming that a "-" is separating each key
 *   _!1,- => straighten a flat object on 1 level assuming that a "-" is separating each key
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
Flattening.prototype.parseParameters = function(serializedParameters) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Flattening.prototype.processContext = function(context, parameters, stream) {
    return context;
}
