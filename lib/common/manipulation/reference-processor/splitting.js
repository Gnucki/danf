'use strict';

/**
 * Expose `Splitting`.
 */
module.exports = Splitting;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new splitting reference processor.
 *
 * Process:
 *   /.: split a string from a separator "."
 *   /!: join a string array in one string
 *   /!.: join a string array in one string separating each string whith "."
 */
function Splitting() {
}

utils.extend(Abstract, Splitting);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Splitting.prototype, 'prefix', {
    value: '/'
});

/**
 * @inheritdoc
 */
Splitting.prototype.parseSpecificParameters = function(serializedParameters) {
    return {};
}

/**
 * @inheritdoc
 */
Splitting.prototype.processContext = function(context, parameters, stream) {
    return context;
}
