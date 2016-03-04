'use strict';

/**
 * Expose `Children`.
 */
module.exports = Children;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new children service builder.
 */
function Children() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1400;
}

utils.extend(AbstractServiceBuilder, Children);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Children.prototype, 'contract', {
    get: function () {
        var buildRecursiveContract = function(contract, level) {
                var recursiveContract = {
                    type: 'embedded_object',
                    embed: utils.clone(contract)
                };

                if (level >= 1) {
                    recursiveContract.embed.children = buildRecursiveContract(contract, --level);
                }

                return recursiveContract;
            }
        ;

        return {
            children: function(contract) {
                var interpretedContract = {};

                for (var key in contract) {
                    if ('function' === typeof contract[key] && 'children' !== key) {
                        interpretedContract[key] = contract[key](contract);
                    } else {
                        interpretedContract[key] = contract[key];
                    }
                }

                return buildRecursiveContract(interpretedContract, 4);
            }
        };
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Children.prototype.define = function(service) {
    if (service.children) {
        service.abstract = true;

        if ('object' !== typeof service.children) {
            throw new Error(
                'The children parameter of the service "{0}" should be an object of service definitions.'.format(
                    service.id
                )
            );
        }

        for (var key in service.children) {
            var child = service.children[key],
                childService = this._servicesContainer.mergeDefinitions(service, child)
            ;

            childService.declinationParent = service.id;
            childService.children = child.children;
            childService.parent = child.parent ? child.parent : service.parent;
            childService.abstract = !child.abstract ? false : true;

            this._servicesContainer.setDefinition('{0}.{1}'.format(service.id, key), childService);
        }
    }

    return service;
}