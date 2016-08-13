'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    HierarchyEvaluator = require('../../../lib/common/manipulation/hierarchy-evaluator')
;

var hierarchyEvaluator = new HierarchyEvaluator(),
    evaluate = function(operation) {
        var value = operation.match(/[a-z]/)[0];

        return function(values, separator) {
            var evaluation = operation.replace(value, '-{0}{1}-'.format(value, values.length));

            return evaluation.format.apply(evaluation, values);
        };
    }
;

var evaluationTests = [
        {
            value: '(a)',
            expected: '-a0-'
        },
        {
            value: '(a(b))',
            expected: '-a1--b0-'
        },
        {
            value: '(a(b(c)))',
            expected: '-a2--b1--c0-'
        },
        {
            value: '(a(b(c(d))(e))(f)(g(i)))',
            expected: '-a7--b3--c1--d0--e2--f4--g6--i5-'
        },
        {
            value: '(a(b(c)',
            expected: '-a2--b1--c0-'
        },
        {
            value: 'z',
            expected: '-z0-'
        }
    ]
;

describe('HierarchyEvaluator', function() {
    evaluationTests.forEach(function(test) {
        it('method "evaluate" should evaluate the expression `{0}` in `{1}`'.format(JSON.stringify(test.value), JSON.stringify(test.expected)), function() {
            var evaluation = hierarchyEvaluator.evaluate(test.value, evaluate);

            assert.equal(
                evaluation('-'),
                test.expected
            );
        });
    });
});
