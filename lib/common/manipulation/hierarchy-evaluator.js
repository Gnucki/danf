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
    var pattern = /\(([^()]*)\)/,
        operations = [],
        index = 0,
        parentheses = value.match(/\(|\)/g),
        parenthesesBalance = 0,
        args = Array.prototype.slice.call(arguments, 2),
        wrapped = value[0] === '(' && value[value.length - 1] === ')',
        misplacedParentheses = false
    ;

    if (parentheses) {
        for (var i = 0; i < parentheses.length; i++) {
            if (parentheses[i] === '(') {
                parenthesesBalance++;
            } else {
                parenthesesBalance--;
            }

            // Check global wrapping parentheses existence.
            if (parenthesesBalance === 0 && i !== parentheses.length - 1) {
                wrapped = false;
            }

            if (parenthesesBalance < 0) {
                misplacedParentheses = true;
            }
        }
    } else {
        wrapped = false;
    }

    if (parenthesesBalance !== 0) {
        throw new Error('Unbalanced parentheses in evaluated string "{0}" ({1}).'.format(
            value,
            parenthesesBalance
        ));
    } else if (misplacedParentheses) {
        throw new Error('Misplaced parentheses in evaluated string "{0}".'.format(
            value
        ));
    }

    var currentValue = wrapped ? value : '({0})'.format(value);

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
