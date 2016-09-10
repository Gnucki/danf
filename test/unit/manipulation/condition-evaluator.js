'use strict';

require('../../../lib/common/init');

// Force tests execution order.
require('./serializer');
require('./hierarchy-evaluator');

var assert = require('assert'),
    Serializer = require('../../../lib/common/manipulation/serializer'),
    HierarchyEvaluator = require('../../../lib/common/manipulation/hierarchy-evaluator'),
    ConditionEvaluator = require('../../../lib/common/manipulation/condition-evaluator')
;

var serializer = new Serializer(),
    hierarchyEvaluator = new HierarchyEvaluator(),
    conditionEvaluator = new ConditionEvaluator()
;

conditionEvaluator.serializer = serializer;
conditionEvaluator.hierarchyEvaluator = hierarchyEvaluator;

var evaluationTests = [
        {
            value: '1==2',
            expected: false
        },
        {
            value: '2===2',
            expected: true
        },
        {
            value: '"2"===2',
            expected: false
        },
        {
            value: '"2"==2',
            expected: true
        },
        {
            value: '"2"==2&&1==2',
            expected: false
        },
        {
            value: '1==2||3===3',
            expected: true
        },
        {
            value: '1==2||3===3&&"3"=="2"',
            expected: false
        },
        {
            value: '(3===3&&"3"=="2")',
            expected: false
        },
        {
            value: '(3===3&&"3"=="2")||2==2',
            expected: true
        },
        {
            value: '(3===3&&"3"=="2")||(3>3&&2<=1)',
            expected: false
        },
        {
            value: '(3===3&&"3"=="2")||(3>=3&&2>1)',
            expected: true
        },
        {
            value: '2',
            expected: true
        },
        {
            value: '!2',
            expected: false
        },
        {
            value: '(3===3&&"3"=="2"||1)&&(3>3&&2>1||(0||0))',
            expected: false
        },
        {
            value: '(3===3&&"3"=="2"||1)&&(3>3&&2>1||(0||!0))',
            expected: true
        },
        {
            value: '1||1&&0',
            expected: true
        },
        {
            value: 'true||true&&false',
            expected: true
        },
        {
            value: 'false',
            expected: false
        },
        {
            value: 'true',
            expected: true
        }
    ]
;

var failingEvaluationTests = [
        {value: '||(2==3)'},
        {value: '||2'},
        {value: '||'},
        {value: '&&(2==3)'},
        {value: '&&2'},
        {value: '&&'},
        {value: '(2==3)||'},
        {value: '2||'},
        {value: '(2==3)&&'},
        {value: '2&&'},
        {value: '(||2==3)'},
        {value: '(&&2==3)'},
        {value: '(2==3||)'},
        {value: '(2==3&&)'},
        {value: '(2==3)(1!=4)'},
        {value: '(2==3)&(1!=4)'},
        {value: '(2==3)foo(1!=4)'},
        {
            value: '2===3)',
            expected: /Unbalanced parentheses .*/
        },
        {
            value: '5==2)&&(1>3',
            expected: /Misplaced parentheses .*/
        }
    ]
;

describe('ConditionEvaluator', function() {
    evaluationTests.forEach(function(test) {
        it('method "compile" should compile the expression `{0}` in a function evaluating to `{1}`'.format(test.value, test.expected), function() {
            var evaluation = conditionEvaluator.compile(test.value);

            assert.equal(
                evaluation(),
                test.expected
            );
        });

        it('method "evaluate" should evaluate the expression `{0}` in `{1}`'.format(test.value, test.expected), function() {
            var result = conditionEvaluator.evaluate(test.value);

            assert.equal(
                result,
                test.expected
            );
        });
    });

    failingEvaluationTests.forEach(function(test) {
        it('method "compile" should fail to compile the badly formatted expression `{0}`'.format(test.value, test.expected), function() {
            assert.throws(
                function() {
                    conditionEvaluator.compile(test.value);
                },
                test.expected ? test.expected : /Bad syntax in condition definition .*/
            );
        });
    });
});
