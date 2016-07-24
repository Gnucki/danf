'use strict';

/**
 * Expose `Default`.
 */
module.exports = Default;

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
 *   :...
 */
function Default() {
}

utils.extend(Abstract, Default);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Default.prototype, 'prefix', {
    value: ':'
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
Default.prototype.process = function(context, args, meta) {
    return context;
}