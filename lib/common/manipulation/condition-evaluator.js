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

/**
 * @interface {danf:manipulation.conditionEvaluator}
 */
ConditionEvaluator.prototype.evaluate = function(value) {
    // TODO: Implement evaluation method handling === == !== != > < >= <= || && () !
}