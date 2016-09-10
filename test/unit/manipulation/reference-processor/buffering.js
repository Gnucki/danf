'use strict';

require('../../../../lib/common/init');

// Force tests execution order.
require('../path-resolver');
require('../serializer');
require('../resolving-stream');
require('../math-evaluator');

var assert = require('assert'),
    ReferenceProcessor = require('../../../../lib/common/manipulation/reference-processor/buffering'),
    Serializer = require('../../../../lib/common/manipulation/serializer'),
    PathResolver = require('../../../../lib/common/manipulation/path-resolver'),
    ResolvingStream = require('../../../../lib/common/manipulation/resolving-stream'),
    HierarchyEvaluator = require('../../../../lib/common/manipulation/hierarchy-evaluator'),
    ConditionEvaluator = require('../../../../lib/common/manipulation/condition-evaluator'),
    MathEvaluator = require('../../../../lib/common/manipulation/math-evaluator')
;

var referenceProcessor = new ReferenceProcessor(),
    serializer = new Serializer(),
    pathResolver = new PathResolver(),
    hierarchyEvaluator = new HierarchyEvaluator(),
    conditionEvaluator = new ConditionEvaluator(),
    mathEvaluator = new MathEvaluator()
;

conditionEvaluator.hierarchyEvaluator = hierarchyEvaluator;
conditionEvaluator.serializer = serializer;

mathEvaluator.hierarchyEvaluator = hierarchyEvaluator;

referenceProcessor.serializer = serializer;
referenceProcessor.pathResolver = pathResolver;
referenceProcessor.conditionEvaluator = conditionEvaluator;
referenceProcessor.mathEvaluator = mathEvaluator;

var source = '...',
    tests = [
        {
            serializedParameters: 'foo0',
            parameters: {
                buffer: 'foo0',
                source: 'function'
            },
            expected: source
        },
        {
            serializedParameters: 'bar,2',
            parameters: {
                buffer: 'bar',
                source: 2
            },
            expected: 2
        },
        {
            serializedParameters: 'foo1,.',
            parameters: {
                buffer: 'foo1',
                source: 'function'
            },
            expected: source
        },
        {
            serializedParameters: 'foo2,$',
            parameters: {
                buffer: 'foo2',
                source: 'function'
            },
            expected: source
        },
        {
            serializedParameters: 'foo3,>_',
            parameters: {
                buffer: 'foo3',
                source: 'function'
            },
            expected: source
        },
        {
            serializedParameters: 'foo4,"$"',
            parameters: {
                buffer: 'foo4',
                source: 'function'
            },
            expected: '$'
        },
        {
            serializedParameters: 'foo5,2+4',
            parameters: {
                buffer: 'foo5',
                source: 'function'
            },
            expected: 6
        },
        {
            serializedParameters: 'foo6,(2(4+1*3))',
            parameters: {
                buffer: 'foo6',
                source: 'function'
            },
            expected: 14
        },
        {
            serializedParameters: 'foo7,(2(4+1*3))?1===2',
            parameters: {
                buffer: 'foo7',
                source: 'function',
                condition: 'function'
            },
            expected: source
        },
        {
            serializedParameters: 'foo8,4+1?1<=2',
            parameters: {
                buffer: 'foo8',
                source: 'function',
                condition: 'function'
            },
            expected: 5
        }
    ]
;

describe('SelectionReferenceProcessor', function() {
    tests.forEach(function(test) {
        it('method "parseParameters" should parse serialized parameters "{0}" in `{1}`'.format(test.serializedParameters, JSON.stringify(test.parameters)), function() {
            var parameters = referenceProcessor.parseParameters(test.serializedParameters);

            // Overwrite expected functions.
            if ('function' === test.parameters.source) {
                test.parameters.source = parameters.source;
            }
            if ('function' === test.parameters.condition) {
                test.parameters.condition = parameters.condition;
            }

            assert.deepEqual(parameters, test.parameters);
        });

        it('method "process" should process `{0}` in `{1}`'.format(JSON.stringify(test.parameters), JSON.stringify(test.expected)), function() {
            var resolvingStream = new ResolvingStream();

            resolvingStream.source = source;
            referenceProcessor.process(resolvingStream, test.parameters);

            assert.deepEqual(resolvingStream.context, test.expected);

            resolvingStream.switch();

            assert.deepEqual(resolvingStream.context, source);
        });
    });
});
