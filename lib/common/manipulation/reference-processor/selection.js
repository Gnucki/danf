'use strict';

/**
 * Expose `Selection`.
 */
module.exports = Selection;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new selection reference processor.
 *
 * Process:
 *   .a => get property a
 *   .a.b => get property b of property a
 *   .get('a', 1, plop)
 */
function Selection() {
}

utils.extend(Abstract, Selection);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Selection.prototype, 'prefix', {
    value: '.'
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
Selection.prototype.process = function(context, args, meta) {
    return context;
}