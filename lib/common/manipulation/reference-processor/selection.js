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
Selection.prototype.parseParameters = function(serializedParameters) {
    var self = this,
        methods = [],
        segments = serializedParameters
            .replace(/[^.]*\([^)]+\)/g, function(match) {
                methods.push(match);

                return '{{0}}'.format(methods.length - 1);
            })
            .split('.')
        ,
        pattern = /([^\(,\s])\./,
        currentPath,
        selectors = []
    ;

    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i].format(methods),
            match = segment && segment.match(/^([^\(]*)\(([^\)]*)\)$/),
            pushPath = function() {
                if (null != currentPath) {
                    selectors.push({
                        type: 'property',
                        path: currentPath
                    });
                }

                currentPath = null;
            }
        ;

        // Handle case of a method.
        if (match) {
            pushPath();

            selectors.push({
                type: 'method',
                method: match[1],
                args: '' !== match[2]
                    ? match[2]
                      .split(',')
                      .map(self.unserializeValue.bind(self))
                    : []
            });
        // Handle case of a property.
        } else {
            currentPath = currentPath != null
                ? '{0}.{1}'.format(currentPath, segment)
                : segment
            ;
        }
    }

    pushPath();

    return {
        selectors: selectors
    };
}

/**
 * @inheritdoc
 */
Selection.prototype.processContext = function(context, parameters, stream) {
    var self = this,
        value = context
    ;

    for (var i = 0; i < parameters.selectors.length; i++) {
        var selector = parameters.selectors[i];

        if (value == null || 'object' !== typeof value) {
            value = null;
            break;
        }

        switch (selector.type) {
            case 'method':
                var method = value[selector.method],
                    args = selector.args.map(function(arg) {
                        return self.interpretValue(arg, stream, value);
                    })
                ;

                if ('function' === typeof method) {
                    value = method.apply(value, args);
                } else {
                    value = null;
                }

                break;
            case 'property':
                value = this._pathResolver.resolve(selector.path, value);

                break;
        }
    }

    return value;
}
