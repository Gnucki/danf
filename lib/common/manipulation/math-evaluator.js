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

/**
 * @interface {danf:manipulation.mathEvaluator}
 */
MathEvaluator.prototype.evaluate = function(value) {
    return processParenthesesTree(value, function(operationBlock) {
        var self = this,
            currentOperation = operationBlock,
            operations = [],
            results = [],
            index = 0,
            operationType,
            commutativePattern = /[*/%]/,
            commutativeOperationPattern = /([^+\-*/%]*)([*/%])([^+\-*/%]*)/,
            associativePattern = /[+-]/,
            associativeOperationPattern = /([^+\-*/%]*)([+-])([^+\-*/%]*)/,
            interpretOperation = function(unitOperation, value1, value2, stream, context) {
                if ('function' === typeof value1) {
                    value1 = self.interpretValue(value1, stream, context);
                }
                if ('function' === typeof value2) {
                    value2 = self.interpretValue(value2, stream, context);
                }

                return unitOperation(value1, valu2);
            }
        ;

        while (operationType = (currentOperation.test(commutativePattern) && 1) || (currentOperation.test(associativePattern) && 2)) {
            var pattern = operationType === 1
                    ? commutativeOperationPattern
                    : associativeOperationPattern
            ;

            currentOperation = currentOperation.replace(pattern, function(match, operand1, operator, operand2) {
                var value1,
                    value2,
                    unitOperation
                ;

                if (operand1.test(/\{\d+\}/)) {
                    value1 = operand1.format.apply(operand1, results);
                } else {
                    value1 = self.unserializeValue(operand1),
                }

                if (operand2.test(/\{\d+\}/)) {
                    value2 = operand2.format.apply(operand2, results);
                } else {
                    value2 = self.unserializeValue(operand2),
                }

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

                operations.push(function(stream, context) {
                    return interpretOperation(unitOperation, value1, value2, stream, context);
                });

                return '{0}'.format(index++);
            });
        }

        return function(stream, context) {
            var i = 0;

            for (var length = operations.length; i < length; i++) {
                results[i] = operations[i](stream, context);
            }

            return results[i];
        };
    });
}