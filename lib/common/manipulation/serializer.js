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

Serializer.defineDependency('_pathResolver', 'danf:manipulation.pathResolver');

/**
 * Path resolver.
 *
 * @var {danf:manipulation.pathResolver}
 * @api public
 */
Object.defineProperty(Serializer.prototype, 'pathResolver', {
    set: function(pathResolver) {
        this._pathResolver = pathResolver
    }
});

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
Serializer.prototype.unserialize = function(value, contexts) {
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
    // Handle 1, 2.34, -5
    } else if (value == +value) {
        parsedValue = +value;
    // Handle string pathes
    } else if (contexts) {
        var referenceTypes = Object.keys(contexts),
            pattern = new RegExp('^[{0}]'.format(
                referenceTypes.join('').replace(/[-[\]{}()*+?.,\\^$\/|#\s]/g, '\\$&')
            )),
            match = value.match(pattern)
        ;

        if (match) {
            parsedValue = this._pathResolver.resolve(value.slice(1), contexts[match[0]]);
        }
    }

    return parsedValue;
}
