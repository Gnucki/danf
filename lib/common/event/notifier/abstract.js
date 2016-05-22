'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract notifier.
 */
function Abstract() {
    this._listeners = [];

    Object.hasMethod(this, 'notifyEvent', true);
}

Abstract.defineImplementedInterfaces(['danf:event.notifier']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_dataResolver', 'danf:manipulation.dataResolver');

/**
 * The data resolver.
 *
 * @var {danf:manipulation.dataResolver}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'dataResolver', {
    set: function(dataResolver) { this._dataResolver = dataResolver; }
});

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.addListener = function(event) {
    this._listeners.push(event);

    this.addEventListener(event.name, event.parameters, event.sequence);
}

/**
 * Add an event listener.
 *
 * @param {string} name The name of the event.
 * @param {object} event The parameters of the event.
 * @param {danf:sequencing.sequence} sequence The sequence to execute on event triggering.
 * @api protected
 */
Abstract.prototype.addEventListener = function(name, parameters, sequence) {
}

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.notify = function(event, data, meta) {
    if (undefined === event) {
        throw new Error('No event of name "{0}" found.'.format(event.name));
    }

    var dataContract = this.getEventDataContract(event);

    if (dataContract) {
        data = this._dataResolver.resolve(
            data,
            dataContract,
            'event[{0}][{1}].data'.format(this.name, event.name)
        );
    }

    var metaContract = this.getEventMetaContract();

    if (metaContract) {
        meta = this._dataResolver.resolve(
            meta,
            metaContract,
            'event[{0}][{1}].meta'.format(this.name, event.name)
        );
    }

    this.notifyEvent(event.name, event.parameters, event.sequence, data, meta);
}

/**
 * @interface {danf:event.notifier}
 */
Abstract.prototype.mergeContractField = function(field, parentValue, childValue) {
    if (undefined === childValue) {
        return parentValue;
    }

    if (Array.isArray(parentValue)) {
        if (Array.isArray(childValue)) {
            return parentValue.concat(childValue);
        }
    } else if ('object' === typeof parentValue) {
        if ('object' === typeof childValue) {
            for (var key in childValue) {
                parentValue[key] = childValue[key];
            }

            return parentValue;
        }
    }

    return childValue;
}

/**
 * Notify an event triggering.
 *
 * @param {string} name The name of the event.
 * @param {object} event The parameters of the event.
 * @param {danf:sequencing.sequence} sequence The sequence to execute on event triggering.
 * @param {mixed} data The data associated with the triggered event.
 * @param {mixed} meta The metadata associated with the triggered event.
 * @api protected
 */
Abstract.prototype.notifyEvent = null; // function(name, parameters, sequence, data, meta) {}

/**
 * Get the contract that data should respect for an event.
 *
 * @param {danf:event.event} event The event.
 * @return {object} The contract.
 * @api protected
 */
Abstract.prototype.getEventDataContract = function(event) {
    return event.parameters.data;
}

/**
 * Get the contract that metadata should respect for an event.
 *
 * @return {object} The contract.
 * @api protected
 */
Abstract.prototype.getEventMetaContract = function() {
    return null;
}