'use strict';

/**
 * Expose `HierarchyEvaluator`.
 */
module.exports = HierarchyEvaluator;

/**
 * Initialize a new hierarchy evaluator.
 */
function HierarchyEvaluator() {}

HierarchyEvaluator.defineImplementedInterfaces(['danf:manipulation.hierarchyEvaluator']);

/**
 * @interface {danf:manipulation.hierarchyEvaluator}
 */
HierarchyEvaluator.prototype.evaluate = function(value, evaluateOperation) {
    var currentValue = value,
        pattern = /\(([^()]*)\)/,
        operations = [],
        index = 0,
        parenthesesBalance = (value.match(/\(/g) || []).length - (value.match(/\)/g) || []).length
    ;

    if (parenthesesBalance) {
        var character = parenthesesBalance > 0 ? ')' : '(',
            parentheses = new Array(Math.abs(parenthesesBalance) + 1).join(character)
        ;

        if (parenthesesBalance > 0) {
            currentValue += parentheses;
        } else {
            currentValue = parentheses + currentValue;
        }
    }

    while (currentValue.test(/^\(\)$/)) {
        currentValue = currentValue.replace(pattern, function(match, operation) {
            operations.push(evaluateOperation(operation));

            return '{0}'.format(index++);
        });
    }

    return function(stream, context) {
        var values = [],
            i = 0
        ;

        for (var length = operations.length; i < length; i++) {
            values[i] = operations[i](stream, context);
        }

        return values[i];
    };
}