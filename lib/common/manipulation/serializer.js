'use strict';

/**
 * Expose `Serializer`.
 */
module.exports = Serializer;

/**
 * Initialize a new serializer.
 */
function Serializer() {
}

/**
 * @interface {danf:manipulation.serializer}
 */
Serializer.prototype.serialize = function(value, space) {
    if (value == null) {
        return 'null';
    }

    return JSON.stringify(value, null, space);
}

/**
 * @interface {danf:manipulation.serializer}
 */
Serializer.prototype.unserialize = function(value, unserializeOthers) {
    var parsedValue = value;

    // Handle "foo", "foo.bar", "1", "true", [], {}
    if (
        /^\[.*\]$/.test(value) ||
        /^\{.*\}$/.test(value) ||
        /^\".*\"$/.test(value)
    ) {
        parsedValue = JSON.parse(value);
    // Handle true
    } else if ('true' === value) {
        parsedValue = true;
    // Handle false
    } else if ('false' === value) {
        parsedValue = false;
    // Handle null
    } else if ('' === value || 'null' === value || 'undefined' === value) {
        parsedValue = null;
    // Handle 1, 2.34, -5
    } else if (value == +value) {
        parsedValue = +value;
    // Handle other unserializations
    } else if (unserializeOthers) {
        parsedValue = unserializeOthers(value);
    }

    return parsedValue;
}
