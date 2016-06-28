'use strict';

/**
 * Expose `Select`.
 */
module.exports = Select;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new select reference processor.
 */
function Select() {
}

utils.extend(Abstract, Select);

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Object.defineProperty(Select.prototype, 'prefix', {
    value: '.'
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Select.prototype.process = function(reference, context) {
}