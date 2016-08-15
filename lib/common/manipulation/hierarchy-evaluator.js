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
    var args = Array.prototype.slice.call(arguments),
        evaluation = this.compile.apply(this, args)
    ;

    return evaluation();
}

/**
 * @interface {danf:manipulation.hierarchyEvaluator}
 */
HierarchyEvaluator.prototype.compile = function(value, evaluateOperation) {
    var currentValue = value[0] !== '(' || value[value.length - 1] !== ')'
            ? '({0})'.format(value)
            : value
        ,
        pattern = /\(([^()]*)\)/,
        operations = [],
        index = 0,
        parenthesesBalance = (currentValue.match(/\(/g) || []).length - (currentValue.match(/\)/g) || []).length,
        args = Array.prototype.slice.call(arguments, 2)
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

    while (currentValue && /^\(.*\)$/.test(currentValue)) {
        currentValue = currentValue.replace(pattern, function(match, operation) {
            var operationArgs = [operation].concat(args);

            operations.push(evaluateOperation.apply(null, operationArgs));

            return '{{0}}'.format(index++);
        });
    }

    return function(/* args... */) {
        var values = [],
            i = 0,
            evaluationArgs = Array.prototype.slice.call(arguments)
        ;

        evaluationArgs.unshift(values);

        for (var length = operations.length; i < length; i++) {
            var operation = operations[i];

            values[i] = operation.apply(
                this,
                evaluationArgs
            );
        }

        return values[i - 1];
    };
}
