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
Abstract.defineDependency('_mathEvaluator', 'danf:manipulation.mathEvaluator');
Abstract.defineDependency('_conditionEvaluator', 'danf:manipulation.conditionEvaluator');

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
 * Math evaluator.
 *
 * @var {danf:manipulation.mathEvaluator}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'mathEvaluator', {
    set: function(mathEvaluator) { this._mathEvaluator = mathEvaluator; }
});

/**
 * Condition evaluator.
 *
 * @var {danf:manipulation.conditionEvaluator}
 * @api public
 */
Object.defineProperty(Abstract.prototype, 'conditionEvaluator', {
    set: function(conditionEvaluator) { this._conditionEvaluator = conditionEvaluator; }
});

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Abstract.prototype.parseParameters = function(serializedParameters) {
    var match = serializedParameters.match(/^(.*)\?([^?]*)$/),
        serializedSpecificParameters = match ? match[1] : serializedParameters,
        condition = match && match[2],
        parameters = this.parseSpecificParameters(serializedSpecificParameters)
    ;

    if (condition && undefined === parameters.condition) {
        parameters.condition = this.compileCondition(condition);
    }

    return parameters;
}

/**
 * @interface {danf:manipulation.referenceProcessor}
 */
Abstract.prototype.process = function(stream, parameters) {
    if (!parameters.condition || parameters.condition(stream)) {
        stream.context = this.processContext(stream.context, parameters, stream);
    }
}

/**
 * Parse processor specific parameters.
 *
 * @param {string} serializedParameters The serialized parameters.
 * @return {object} The parsed parameters.
 * @api protected
 */
Abstract.prototype.parseSpecificParameters = function(serializedParameters) {
    return {};
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
        if (/^[\(0-9]/.test(value)) {
            return self.compileOperation(value);
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
 * Compile a boolean expression.
 *
 * @param {string} condition The boolean expression.
 * @return {function} The evaluation function.
 * @api protected
 */
Abstract.prototype.compileCondition = function(condition) {
    var self = this,
        compilation = this._conditionEvaluator.compile(
            condition,
            self.unserializeValue.bind(self)
        )
    ;

    return function(stream, context) {
        return compilation(function(operand) {
            return 'function' === typeof operand
                ? operand(self.buildResolvingContext(stream, context))
                : operand
            ;
        });
    };
}

/**
 * Compile a math operation.
 *
 * @param {string} operation The operation.
 * @return {function} The evaluation function.
 * @api protected
 */
Abstract.prototype.compileOperation = function(operation) {
    var self = this,
        compilation = this._mathEvaluator.compile(operation, true)
    ;

    return function(contexts) {
        return compilation(function(operand) {
            return +self._pathResolver.resolve(
                operand.slice(1),
                contexts[operand[0]]
            );
        });
    };
}

/**
 * Evaluate a math operation.
 *
 * @param {string} operation The operation.
 * @return {function} The evaluation function.
 * @api protected
 */
Abstract.prototype.evaluateOperation = function(operation, stream, context) {
    var compilation = this.compileOperation(operation);

    return compilation(this.buildResolvingContext(stream, context));
}
