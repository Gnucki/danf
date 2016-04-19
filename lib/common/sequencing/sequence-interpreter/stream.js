'use strict';

/**
 * Expose `Stream`.
 */
module.exports = Stream;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new stream sequence interpreter.
 */
function Stream() {
    Abstract.call(this);

    this._order = 800;
}

utils.extend(Abstract, Stream);

/**
 * Data resolver.
 *
 * @var {danf:manipulation.dataResolver}
 * @api public
 */
Object.defineProperty(Stream.prototype, 'dataResolver', {
    set: function(dataResolver) {
        this._dataResolver = dataResolver
    }
});

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Object.defineProperty(Stream.prototype, 'contract', {
    value: {
        stream: {
            type: 'mixed_object'
        }
    }
});

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
 Stream.prototype.interpret = function(interpretation, definition, context) {
    if (definition.stream) {
        interpretation.unshift({
            order: null,
            operations: [interpretStream.call(this, definition.stream, definition.id, definition)]
        });
    }

    return interpretation;
}

/**
 * Interpret an stream
 *
 * @param {object} stream The definition of the stream.
 * @param {string} id The identifier of the sequence.
 * @param {mixed_object} defintion The definition of the sequence.
 * @return {function} The interpreted stream.
 */
var interpretStream = function(stream, id, definition) {
    var self = this;

    return function(flow, callback) {
        flow.currentStream = self._dataResolver.resolve(
            flow.currentStream,
            stream,
            'sequence[{0}]'.format(id)
        );

        callback();
    };
}
