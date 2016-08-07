'use strict';

/**
 * Expose `Buffering`.
 */
module.exports = Buffering;

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
 *   >foo: switch to buffering foo initialized to source
 *   >foo,2: switch to buffer foo initialized to 2
 *   >foo,.: switch to buffer initialized to current buffering
 */
function Buffering() {
}

utils.extend(Abstract, Buffering);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Buffering.prototype, 'prefix', {
    value: '>'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Buffering.prototype.parseParameters = function(serializedParameters) {
    var args = serializedParameters.split(',');

    return {
      buffer: args[0],
      source: this.unserializeValue(args[1] ? args[1] : '$')
    };
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Buffering.prototype.processContext = function(context, parameters, stream) {
    stream.switch(parameters.buffer);

    return this.interpretValue(parameters.source, stream, context);
}
