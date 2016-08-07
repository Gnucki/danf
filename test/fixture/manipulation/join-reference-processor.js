'use strict';

/**
 * Expose `JoinReferenceProcessor`.
 */
module.exports = JoinReferenceProcessor;

function JoinReferenceProcessor() {
}

Object.defineProperty(JoinReferenceProcessor.prototype, 'prefix', {
    value: '>'
});

JoinReferenceProcessor.prototype.parseParameters = function(serializedParameters) {
    return serializedParameters || '.';
}

JoinReferenceProcessor.prototype.process = function(stream, parameters) {
    stream.context = stream.context.join('.');
}
