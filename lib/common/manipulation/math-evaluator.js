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

MathEvaluator.defineDependency('_hierarchyEvaluator', 'danf:manipulation.hierarchyEvaluator');

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
MathEvaluator.prototype.evaluate = function(value, evaluateSpecialOperand) {
    var evaluation = this.compile(value, evaluateSpecialOperand);

    return evaluation(evaluateSpecialOperand);
}

/**
 * @interface {danf:manipulation.mathEvaluator}
 */
MathEvaluator.prototype.compile = function(value, evaluateSpecialOperand) {
    var self = this,
        formattedValue = value
            .replace(/\s/g, '')
            .replace(/(\d)\(/g, '$1*(')
            .replace(/\)(\d)/g, ')*$1')
            .replace(/\)\(/g, ')*(')
        ,
        // Define operation block (delimited by parentheses) evaluation function.
        evaluate = function(operationBlock) {
            var currentOperation = operationBlock,
                operations = [],
                index = 0,
                operationType,
                commutativePattern = /[*/%]/,
                commutativeOperationPattern = /([^+\-*/%]*)([*/%])([^+\-*/%]*)/,
                associativePattern = /[+-]/,
                associativeOperationPattern = /([^+\-*/%]*)([+-])([^+\-*/%]*)/,
                interpretOperation = function(unitOperation, results, operationResults, value1, value2, evaluateSpecialOperand) {
                    // Interpret value from all operations results.
                    if (/^\{\d+\}$/.test(value1)) {
                        value1 = +value1.format.apply(value1, results);
                    // Interpret value from this operation results.
                    } else if (/^\[\d+\]$/.test(value1)) {
                        value1 = +value1.format.apply(
                            value1.replace(/.(\d)./, '{$1}'),
                            operationResults
                        );
                    }
                    // Interpret value from all operations results.
                    if (/^\{\d+\}$/.test(value2)) {
                        value2 = +value2.format.apply(value2, results);
                    // Interpret value from this operation results.
                    } else if (/^\[\d+\]$/.test(value2)) {
                        value2 = +value2.format.apply(
                            value2.replace(/.(\d)./, '{$1}'),
                            operationResults
                        );
                    }

                    // Interpret values from special evaluator.
                    if (isNaN(value1) && evaluateSpecialOperand) {
                        value1 = evaluateSpecialOperand(value1);
                    }
                    if (isNaN(value2) && evaluateSpecialOperand) {
                        value2 = evaluateSpecialOperand(value2);
                    }

                    if (isNaN(value1) || isNaN(value2)) {
                        throw new Error('Bad operand evaluation in operation "{0}".'.format(formattedValue))
                    }

                    return unitOperation(value1, value2);
                }
            ;

            // Process operation in a natural operators order.
            while (operationType =
              (commutativePattern.test(currentOperation) && 1) ||
              (associativePattern.test(currentOperation) && 2)
            ) {
                var pattern = 1 === operationType
                        ? commutativeOperationPattern
                        : associativeOperationPattern
                ;

                currentOperation = currentOperation.replace(pattern, function(match, operand1, operator, operand2) {
                    var value1 = /^\{\d+\}$/.test(operand1) ? operand1 : +operand1,
                        value2 =  /^\{\d+\}$/.test(operand2) ? operand2 : +operand2,
                        unitOperation
                    ;

                    if (
                        !evaluateSpecialOperand && (
                            (isNaN(value1) && !/^\{\d+\}$/.test(operand1) && !/^\[\d+\]$/.test(operand1)) ||
                            (isNaN(value2) && !/^\{\d+\}$/.test(operand2) && !/^\[\d+\]$/.test(operand2))
                        )
                    ) {
                        throw new Error('Bad syntax in mathematical operation "{0}" for operand "{1}".'.format(
                            formattedValue,
                            isNaN(value1) && !/\^{\d+\}$/.test(operand1) ? operand1 : operand2
                        ));
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

                    operations.push(function(results, operationResults, evaluateSpecialOperand) {
                        return interpretOperation(
                            unitOperation,
                            results,
                            operationResults,
                            isNaN(value1) ? operand1 : value1,
                            isNaN(value2) ? operand2 : value2,
                            evaluateSpecialOperand
                        );
                    });

                    return '[{0}]'.format(index++);
                });
            }

            // Handle case of no operation.
            if (0 === operations.length) {
                var result = +currentOperation;

                if (isNaN(result)) {
                    throw new Error('Bad syntax in mathematical operation "{0}"'.format(formattedValue))
                }

                operations.push(function() {
                    return result;
                });
            }

            // Return the operation evaluation function.
            return function(results, evaluateSpecialOperand) {
                var i = 0,
                    operationResults = []
                ;

                for (var length = operations.length; i < length; i++) {
                    operationResults[i] = operations[i](
                        results,
                        operationResults,
                        evaluateSpecialOperand
                    );
                }

                return operationResults[i - 1];
            };
        }
    ;

    // Return the global evaluation function.
    return this._hierarchyEvaluator.compile(
        formattedValue,
        evaluate,
        evaluateSpecialOperand
    );
}
