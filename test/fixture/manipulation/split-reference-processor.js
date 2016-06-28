'use strict';

/**
 * Expose `JoinReferenceProcessor`.
 */
module.exports = JoinReferenceProcessor;

function JoinReferenceProcessor() {
}

Object.defineProperty(JoinReferenceProcessor.prototype, 'prefix', {
    value: '<'
});

JoinReferenceProcessor.prototype.parseArguments = function(stringArguments) {
    return 2;
}

JoinReferenceProcessor.prototype.process = function(reference, args) {
    return reference.split('...');
}