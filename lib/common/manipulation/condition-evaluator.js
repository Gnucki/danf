'use strict';

/**
 * Expose `ConditionEvaluator`.
 */
module.exports = ConditionEvaluator;

/**
 * Initialize a new condition evaluator.
 */
function ConditionEvaluator() {}

ConditionEvaluator.defineImplementedInterfaces(['danf:manipulation.conditionEvaluator']);

ConditionEvaluator.defineDependency('_hierarchyEvaluator', 'danf:manipulation.hierarchyEvaluator');
ConditionEvaluator.defineDependency('_serializer', 'danf:manipulation.serializer');

/**
 * Hierarchy evaluator.
 *
 * @var {danf:manipulation.hierarchyEvaluator}
 * @api public
 */
Object.defineProperty(ConditionEvaluator.prototype, 'hierarchyEvaluator', {
    set: function(hierarchyEvaluator) { this._hierarchyEvaluator = hierarchyEvaluator; }
});

/**
 * Serializer.
 *
 * @var {danf:manipulation.serializer}
 * @api public
 */
Object.defineProperty(ConditionEvaluator.prototype, 'serializer', {
    set: function(serializer) { this._serializer = serializer; }
});

/**
 * @interface {danf:manipulation.conditionEvaluator}
 */
ConditionEvaluator.prototype.evaluate = function(value, evaluateSpecialOperand) {
    var evaluation = this.compile(value, evaluateSpecialOperand);

    return evaluation(evaluateSpecialOperand);
}

/**
 * @interface {danf:manipulation.conditionEvaluator}
 */
ConditionEvaluator.prototype.compile = function(condition, evaluateOperand) {
    var self = this,
        formattedCondition = condition.replace(/\s/g, '')
    ;

    evaluateOperand = evaluateOperand || self._serializer.unserialize;

    // Check condition syntax.
    if (
        /^\|\|\(?/.test(formattedCondition) || // ||(2==3) ||2 ||
        /^\&&\(?/.test(formattedCondition) || // &&(2==3) &&2 &&
        /\(?\|\|$/.test(formattedCondition) || // (2==3)|| 2||
        /\(?\&&$/.test(formattedCondition) || // (2==3)&& 2&&
        /\(\|\|/.test(formattedCondition) || // (||2==3)
        /\(&&/.test(formattedCondition) || // (&&2==3)
        /\|\|\)/.test(formattedCondition) || // (2==3||)
        /&&\)/.test(formattedCondition) || // (2==3&&)
        /\)(?!&&|\|\|).*\(/.test(formattedCondition) // (2==3)(1!=4) (2==3)&(1!=4) (2==3)foo(1!=4)
    ) {
        throw new Error('Bad syntax in condition definition "{0}".'.format(
            formattedCondition
        ));
    }

    // Define operation block (delimited by parentheses) evaluation function.
    var evaluate = function(operationBlock) {
            var currentOperation = operationBlock,
                operations = [],
                index = 0,
                operationType,
                logicalPattern = /&&|\|\|/g,
                expressions = operationBlock.split(logicalPattern),
                operators = operationBlock.match(logicalPattern) || [],
                comparisonPattern = /^(!?)([^!][^=!><]*)(?:(===|!==|==|!=|>=|>|<=|<)(.+))?$/,
                interpretOperation = function(unitOperation, results, value1, value2, evaluateSpecialOperand) {
                    if ('string' === typeof value1 && /^\{\d+\}$/.test(value1)) {
                        value1 = 'true' === value1.format.apply(value1, results) ? true : false;
                    }
                    if ('string' === typeof value2 && /^\{\d+\}$/.test(value2)) {
                        value2 = 'true' === value2.format.apply(value2, results) ? true : false;
                    }

                    if ('function' === typeof value1 && evaluateSpecialOperand) {
                        value1 = evaluateSpecialOperand(value1);
                    }
                    if ('function' === typeof value2 && evaluateSpecialOperand) {
                        value2 = evaluateSpecialOperand(value2);
                    }

                    return unitOperation(value1, value2);
                },
                expressionsResults = [],
                expressionsOperations = []
            ;

            // Build expressions operations in operators order.
            expressions.forEach(function(expression, expressionIndex) {
                var expressionElements = expression.match(comparisonPattern),
                    negate = !!expressionElements[1],
                    operand1 = expressionElements[2],
                    comparisonOperator = expressionElements[3],
                    operand2 = expressionElements[4],
                    value1 = /^\{\d+\}$/.test(operand1) ? operand1 : evaluateOperand(operand1),
                    value2 = /^\{\d+\}$/.test(operand2) ? operand2 : evaluateOperand(operand2),
                    unitOperation
                ;

                switch (comparisonOperator) {
                    case '===':
                        unitOperation = function(val1, val2) {
                            return val1 === val2;
                        };

                        break;
                    case '!==':
                        unitOperation = function(val1, val2) {
                            return val1 !== val2;
                        };

                        break;
                    case '==':
                        unitOperation = function(val1, val2) {
                            return val1 == val2;
                        };

                        break;
                    case '!=':
                        unitOperation = function(val1, val2) {
                            return val1 != val2;
                        };

                        break;
                    case '>':
                        unitOperation = function(val1, val2) {
                            return val1 > val2;
                        };

                        break;
                    case '>=':
                        unitOperation = function(val1, val2) {
                            return val1 >= val2;
                        };

                        break;
                    case '<':
                        unitOperation = function(val1, val2) {
                            return val1 < val2;
                        };

                        break;
                    case '<=':
                        unitOperation = function(val1, val2) {
                            return val1 <= val2;
                        };

                        break;
                    default:
                        unitOperation = function(val1) {
                            return !!val1;
                        };

                        break;
                }

                // Add an operation to the expressions operations list.
                expressionsOperations.push(function(results, evaluateSpecialOperand) {
                    return interpretOperation(
                        function(val1, val2) {
                            var result = unitOperation(val1, val2);

                            return negate ? !result : result;
                        },
                        results,
                        value1,
                        value2,
                        evaluateSpecialOperand
                    );
                });
            });

            // Add the expressions operations to the operations list.
            operations.push(function(results, evaluateSpecialOperand) {
                var operationResults = [],
                    operationOperators = operators.concat([]),
                    operatorIndex,
                    processLogicalOperation = function(index) {
                        var result = operationOperators[index] === '&&'
                                ? operationResults[index] && operationResults[index + 1]
                                : operationResults[index] || operationResults[index + 1]
                        ;

                        operationOperators.splice(index, 1);
                        operationResults.splice(index, 2, result);
                    }
                ;

                // Process expressions.
                for (var i = 0; i < expressionsOperations.length; i++) {
                    operationResults[i] = expressionsOperations[i](results, evaluateSpecialOperand);
                }

                // Process logical operations between expressions.
                while (-1 !== (operatorIndex = operationOperators.indexOf('&&'))) {
                    processLogicalOperation(operatorIndex);
                }
                while (-1 !== (operatorIndex = operationOperators.indexOf('||'))) {
                    processLogicalOperation(operatorIndex);
                }

                return operationResults[0];
            });

            // Return the operation evaluation function.
            return function(results, evaluateSpecialOperand) {
                var i = 0;

                for (var length = operations.length; i < length; i++) {
                    results[i] = operations[i](results, evaluateSpecialOperand);
                }

                return results[i - 1];
            };
        }
    ;

    // Return the global evaluation function.
    return this._hierarchyEvaluator.compile(
        formattedCondition,
        evaluate
    );
}
