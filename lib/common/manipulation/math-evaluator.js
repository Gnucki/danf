'use strict';

/**
 * Expose `MathEvaluator`.
 */
module.exports = MathEvaluator;

/**
 * Initialize a new math evaluator.
 */
function MathEvaluator() {}

MathEvaluator.defineImplementedInterfaces(['danf:manipulation.mathEvaluator']);

MathEvaluator.defineDependency('_serializer', 'danf:manipulation.serializer');
MathEvaluator.defineDependency('_hierarchyEvaluator', 'danf:manipulation.hierarchyEvaluator');

/**
 * Serializer.
 *
 * @var {danf:manipulation.serializer}
 * @api public
 */
Object.defineProperty(MathEvaluator.prototype, 'serializer', {
    set: function(serializer) { this._serializer = serializer; }
});

/**
 * Hierarchy evaluator.
 *
 * @var {danf:manipulation.hierarchyEvaluator}
 * @api public
 */
Object.defineProperty(MathEvaluator.prototype, 'hierarchyEvaluator', {
    set: function(hierarchyEvaluator) { this._hierarchyEvaluator = hierarchyEvaluator; }
});

/**
 * @interface {danf:manipulation.mathEvaluator}
 */
MathEvaluator.prototype.evaluate = function(value) {
    var self = this;

    const evaluation = this._hierarchyEvaluator.evaluate(value, function(operationBlock) {
        var currentOperation = operationBlock,
            operations = [],
            results = [],
            index = 0,
            operationType,
            commutativePattern = /[*/%]/,
            commutativeOperationPattern = /([^+\-*/%]*)([*/%])([^+\-*/%]*)/,
            associativePattern = /[+-]/,
            associativeOperationPattern = /([^+\-*/%]*)([+-])([^+\-*/%]*)/,
            interpretOperation = function(unitOperation, results, value1, value2) {
                /*if ('function' === typeof value1) {
                    value1 = +value1; // self._serializer.interpretValue(value1, stream, context);
                }
                if ('function' === typeof value2) {
                    value2 = +value2; // self._serializer.interpretValue(value2, stream, context);
                }*/

                if (/^\{\d+\}$/.test(value1)) {
                    value1 = +value1.format.apply(value1, results);
                }

                if (/^\{\d+\}$/.test(value2)) {
                    value2 = +value2.format.apply(value2, results);
                }

                return unitOperation(value1, value2);
            }
        ;

        while (operationType = (commutativePattern.test(currentOperation) && 1) || (associativePattern.test(currentOperation) && 2)) {
            var pattern = operationType === 1
                    ? commutativeOperationPattern
                    : associativeOperationPattern
            ;

            currentOperation = currentOperation.replace(pattern, function(match, operand1, operator, operand2) {
                var value1 = /^\{\d+\}$/.test(operand1) ? operand1 : +operand1,
                    value2 =  /^\{\d+\}$/.test(operand2) ? operand2 : +operand2,
                    unitOperation
                ;

                switch (operator) {
                    case '*':
                        unitOperation = function(val1, val2) {
                            return val1 * val2;
                        };

                        break;
                    case '/':
                        unitOperation = function(val1, val2) {
                            return val1 / val2;
                        };

                        break;
                    case '%':
                        unitOperation = function(val1, val2) {
                            return val1 % val2;
                        };

                        break;
                    case '+':
                        unitOperation = function(val1, val2) {
                            return val1 + val2;
                        };

                        break;
                    case '-':
                        unitOperation = function(val1, val2) {
                            return val1 - val2;
                        };

                        break;
                }

                operations.push(function(results) {
                    return interpretOperation(unitOperation, results, value1, value2);
                });

                return '{{0}}'.format(index++);
            });
        }

        return function(results) {
            var i = 0;

            for (var length = operations.length; i < length; i++) {
                results[i] = operations[i](results);
            }

            return results[i - 1];
        };
    });

    return evaluation();
}
