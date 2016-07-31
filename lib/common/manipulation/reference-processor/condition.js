'use strict';

/**
 * Expose `Condition`.
 */
module.exports = Condition;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new condition reference processor.
 *
 * Process: === == !== != > < >= <= || && () .foo >bar true false 1 "1" "foo" ".foo" foo [] {}
 *   ?.a==1: if...
 *   ?.a==>foo if...
 *   ?.a==1: if...
 *   ?.a==1: if...
 */
function Condition() {
}

utils.extend(Abstract, Condition);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Condition.prototype, 'prefix', {
    value: '~'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Condition.prototype.parseArguments = function(serializedArgs) {
    return {};
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Condition.prototype.process = function(context, args, meta) {
    return context;
}
