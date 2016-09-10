'use strict';

/**
 * Expose `Concatenation`.
 */
module.exports = Concatenation;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new concatenation reference processor.
 *
 * Process:
 *   ~"a": concatenate "a"
 *   ~1: concatenate "1"
 *   ~["foo", "bar"]: concatenate array
 *   ~{"foo": "bar"}: merge object
 */
function Concatenation() {
}

utils.extend(Abstract, Concatenation);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Concatenation.prototype, 'prefix', {
    value: '~'
});

/**
 * @inheritdoc
 */
Concatenation.prototype.parseSpecificParameters = function(serializedParameters) {
    return {};
}

/**
 * @inheritdoc
 */
Concatenation.prototype.processContext = function(context, parameters, stream) {
    return context;
}
