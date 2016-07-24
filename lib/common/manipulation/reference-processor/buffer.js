'use strict';

/**
 * Expose `Buffer`.
 */
module.exports = Buffer;

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
 *   >2: switch to buffer 2
 */
function Buffer() {
}

utils.extend(Abstract, Buffer);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Buffer.prototype, 'prefix', {
    value: '>'
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
Buffer.prototype.process = function(context, args, meta) {
    return context;
}