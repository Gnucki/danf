'use strict';

require('../../../lib/common/init');

// Force tests execution order.
require('./serializer');
require('./hierarchy-evaluator');

var assert = require('assert'),
    HierarchyEvaluator = require('../../../lib/common/manipulation/hierarchy-evaluator'),
    MathEvaluator = require('../../../lib/common/manipulation/math-evaluator')
;

var hierarchyEvaluator = new HierarchyEvaluator(),
    mathEvaluator = new MathEvaluator()
;

mathEvaluator.hierarchyEvaluator = hierarchyEvaluator;

var evaluationTests = [
        {
            value: '1+2',
            expected: 3
        },
        {
            value: '2*4',
            expected: 8
        },
        {
            value: '3-1',
            expected: 2
        },
        {
            value: '15/3',
            expected: 5
        },
        {
            value: '16%3',
            expected: 1
        },
        {
            value: '(5+6)',
            expected: 11
        },
        {
            value: '2+6*3',
            expected: 20
        },
        {
            value: '(2+6)*3',
            expected: 24
        },
        {
            value: '(15-(2+6*(4/2)%5)*3+(9/3))',
            expected: 6
        },
        {
            value: '(3(2+3)2)',
            expected: 30
        },
        {
            value: '(3(-3+1))',
            expected: -6
        },
        {
            value: '1+',
            expected: 1
        },
        {
            value: '(3(/3))',
            expected: 0
        },
        {
            value: '21',
            expected: 21
        },
        {
            value: ' 22 ',
            expected: 22
        },
        {
            value: ' 2 + 3  ( 4 - )3 ',
            expected: 38
        },
        {
            value: '(5-2)(2*3)',
            expected: 18
        },
        {
            value: '(5-2)(2*2)(4-2)3',
            expected: 72
        }
    ]
;

var failingEvaluationTests = [
        {
            value: '3$2'
        },
        {
            value: '3$2+1'
        },
        {
            value: '(3(a/3))'
        },
        {
            value: '2+3)',
            expected: /Unbalanced parentheses .*/
        },
        {
            value: '5-2)+(2*3',
            expected: /Misplaced parentheses .*/
        }
    ]
;

describe('MathEvaluator', function() {
    evaluationTests.forEach(function(test) {
        it('method "compile" should compile the expression `{0}` in a function evaluating to `{1}`'.format(test.value, test.expected), function() {
            var evaluation = mathEvaluator.compile(test.value);

            assert.equal(
                evaluation(),
                test.expected
            );
        });

        it('method "evaluate" should evaluate the expression `{0}` in `{1}`'.format(test.value, test.expected), function() {
            var result = mathEvaluator.evaluate(test.value);

            assert.equal(
                result,
                test.expected
            );
        });
    });

    failingEvaluationTests.forEach(function(test) {
        it('method "compile" should fail to compile the badly formatted expression `{0}`'.format(test.value), function() {
            assert.throws(
                function() {
                    mathEvaluator.compile(test.value);
                },
                test.expected ? test.expected : /Bad syntax in mathematical operation .*/
            );
        });
    });

    it('method "evaluate" should evaluate special operands with the argument "evaluateSpecialOperand"', function() {
        var result = mathEvaluator.evaluate('1?+2?', function(operand) {
                return +operand.replace(/\?/g, '3');
            })
        ;

        assert.equal(
            result,
            36
        );
    });

    it('method "evaluate" should fail to evaluate a badly formatted expression', function() {
        assert.throws(
            function() {
                mathEvaluator.evaluate('1:+2:', function(operand) {
                    return +operand.replace(/\?/g, '3');
                });
            },
            /Bad operand evaluation in operation "1:\+2:"\./
        );
    });
});
