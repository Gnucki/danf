'use strict';

/**
 * Expose `Abstract`.
 */
module.exports = Abstract;

/**
 * Initialize a new abstract reference processor.
 */
function Abstract() {
    Object.hasMethod(this, 'processContext', true);
}

Abstract.defineImplementedInterfaces(['danf:manipulation.referenceProcessor']);

Abstract.defineAsAbstract();

Abstract.defineDependency('_serializer', 'danf:manipulation.serializer');
Abstract.defineDependency('_pathResolver', 'danf:manipulation.pathResolver');

/**
 * Serializer.
 *
 * @var {danf:manipulation.serializer}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'serializer', {
    set: function(serializer) { this._serializer = serializer; }
});

/**
 * Path resolver.
 *
 * @var {danf:manipulation.pathResolver}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'pathResolver', {
    set: function(pathResolver) { this._pathResolver = pathResolver; }
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Abstract.prototype.process = function(stream, args) {
    stream.context = this.processContext(stream.context, args, stream);
}

/**
 * Build path resolving from stream and optional context.
 *
 * @param {danf:manipulation.resolvingStream} stream The resolving stream.
 * @param {mixed} context The optional current context.
 * @return {mixed} The unserialized value.
 * @api protected
 */
Abstract.prototype.buildResolvingContext = function(stream, context) {
    return {
        '$': stream.source,
        '.': context ? context : stream.context,
        '>': stream.buffers
    };
}

/**
 * Unserialize a value.
 *
 * @param {string} The serialized value.
 * @return {mixed} The unserialized value.
 * @api protected
 */
Abstract.prototype.unserializeValue = function(value) {
    var self = this;

    return this._serializer.unserialize(value.trim(), function(value) {
        if (value[0] === '(') {
            return evaluateOperation(value);
        }

        return function(contexts) {
            return self._pathResolver.resolve(
                value.slice(1),
                contexts[value[0]]
            );
        };
    });
}

/**
 * Interpret a value in order to resolve eventual sub-references.
 *
 * @param {mixed} The value.
 * @param {danf:manipulation.resolvingStream} stream The resolving stream.
 * @param {mixed} context The optional current context.
 * @return {mixed} The interpreted value.
 * @api protected
 */
Abstract.prototype.interpretValue = function(value, stream, context) {
    if ('function' === typeof value) {
        return value(this.buildResolvingContext(stream, context));
    }

    return value;
}

/**
 * Evaluate a math operation.
 *
 * @param {string} operation The operation.
 * @return {function} The evaluated function.
 * @api protected
 */
Abstract.prototype.evaluateOperation = function(operation) {
    // TODO: implement
}

/**
 * Evaluate a boolean expression.
 *
 * @param {string} condition The boolean expression.
 * @return {function} The evaluated function.
 * @api protected
 */
Abstract.prototype.evaluateCondition = function(condition) {
    // TODO: implement
}

/**
 * Process a parentheses tree string.
 *
 * @param {string} tree The tree.
 * @param {function} process The process function.
 * @api protected
 */
Abstract.prototype.processParenthesesTree = function(tree, process) {

}

/**
 * Process a stream context.
 *
 * @param {mixed} context The resolving context.
 * @param {object} parameter The parameters.
 * @param {danf:manipulation.resolvingStream} stream The resolving stream.
 * @return {mixed} The processed context.
 * @api protected
 */
Abstract.prototype.processContext = null; // function(context, parameters, stream) {
