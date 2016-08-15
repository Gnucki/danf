'use strict';

require('../../../lib/common/init');

// Force tests execution order.
require('./serializer');
require('./hierarchy-evaluator');

var assert = require('assert'),
    Serializer = require('../../../lib/common/manipulation/serializer'),
    HierarchyEvaluator = require('../../../lib/common/manipulation/hierarchy-evaluator'),
    MathEvaluator = require('../../../lib/common/manipulation/math-evaluator')
;

var serializer = new Serializer(),
    hierarchyEvaluator = new HierarchyEvaluator(),
    mathEvaluator = new MathEvaluator()
;

mathEvaluator.serializer = serializer;
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
        }
    ]
;

describe('MathEvaluator', function() {
    evaluationTests.forEach(function(test) {
        it('method "compile" should evaluate the expression `{0}` in a function evaluating to `{1}`'.format(test.value, test.expected), function() {
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
});
