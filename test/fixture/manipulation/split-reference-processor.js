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

JoinReferenceProcessor.prototype.parseArguments = function(serializedArgs) {
    return serializedArgs || '.';
}

JoinReferenceProcessor.prototype.process = function(context, args, meta) {
    return context.split('.');
}
