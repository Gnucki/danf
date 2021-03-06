'use strict';

/**
 * Expose `AbstractNamespacer`.
 */
module.exports = AbstractNamespacer;

/**
 * Module dependencies.
 */
var utils = require('../../../utils'),
    Abstract = require('../../../manipulation/data-interpreter/abstract')
;

/**
 * Initialize a new section interpreter abstract namespacer for the config.
 */
function AbstractNamespacer() {
    Abstract.call(this);
}

AbstractNamespacer.defineAsAbstract();

AbstractNamespacer.defineDependency('_namespacer', 'danf:configuration.namespacer');

utils.extend(Abstract, AbstractNamespacer);

/**
 * Namespacer.
 *
 * @var {danf:configuration.namespacer}
 * @api public
 */
Object.defineProperty(AbstractNamespacer.prototype, 'namespacer', {
    set: function(namespacer) {
        this._namespacer = namespacer;
    }
});

/**
 * @interface {danf:manipulation.dataInterpreter}
 */
Object.defineProperty(AbstractNamespacer.prototype, 'contract', {
    value: {
        __any: {
            methods: {
                type: 'embedded_object',
                embed: {
                    arguments: {
                        type: 'string_object',
                        default: []
                    },
                    returns: {
                        type: 'string'
                    }
                }
            },
            getters: {
                type: 'string_object'
            },
            setters: {
                type: 'string_object'
            }
        },
        type: 'embedded'
    }
});