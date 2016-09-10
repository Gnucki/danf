'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    HierarchyEvaluator = require('../../../lib/common/manipulation/hierarchy-evaluator')
;

var hierarchyEvaluator = new HierarchyEvaluator(),
    evaluate = function(operation, offset, sep) {
        var match = operation.match(/[a-z]/),
            value = match && match[0]
        ;

        return function(values, separator) {
            var evaluation = value
                    ? operation.replace(
                        value,
                        '{2}{0}{1}{2}'.format(
                            value,
                            values.length + (offset || 0),
                            sep || separator
                        )
                    )
                    : operation
            ;

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
            value: '(a)(b)',
            expected: '-a0--b1-'
        },
        {
            value: '(a)((b))',
            expected: '-a0--b1-'
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
            value: 'z',
            expected: '-z0-'
        },
        {
            value: 'z',
            offset: 1,
            expected: '-z1-'
        }
    ]
;

var failingEvaluationTests = [
        {
            value: '(a(b(c))',
            expected: /Unbalanced parentheses in evaluated string "\(a\(b\(c\)\)" \(1\)\./
        },
        {
            value: '(a(b(c)))))',
            expected: /Unbalanced parentheses in evaluated string "\(a\(b\(c\)\)\)\)\)" \(-2\)\./
        },
        {
            value: '(a))b(c',
            expected: /Misplaced parentheses in evaluated string "\(a\)\)b\(c"\./
        }
    ]
;

describe('HierarchyEvaluator', function() {
    evaluationTests.forEach(function(test) {
        it('method "compile" should compile the expression `{0}` in a function evaluating to `{1}`'.format(JSON.stringify(test.value), JSON.stringify(test.expected)), function() {
            var evaluation = hierarchyEvaluator.compile(test.value, evaluate, test.offset);

            assert.equal(
                evaluation('-'),
                test.expected
            );
        });

        var expected = test.expected.replace(/-/g, '.');

        it('method "evaluate" should evaluate the expression `{0}` in `{1}`'.format(JSON.stringify(test.value), JSON.stringify(expected)), function() {
            var result = hierarchyEvaluator.evaluate(test.value, evaluate, test.offset, '.');

            assert.equal(
                result,
                expected
            );
        });
    });

    failingEvaluationTests.forEach(function(test) {
        it('method "compile" should fail to compile the badly formatted expression `{0}`'.format(test.value), function() {
            assert.throws(
                function() {
                    hierarchyEvaluator.compile(test.value, evaluate);
                },
                test.expected
            );
        });
    });
});
