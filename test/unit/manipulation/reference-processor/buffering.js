'use strict';

require('../../../../lib/common/init');

// Force tests execution order.
require('../path-resolver');
require('../serializer');
require('../resolving-stream');

var assert = require('assert'),
    ReferenceProcessor = require('../../../../lib/common/manipulation/reference-processor/buffering'),
    Serializer = require('../../../../lib/common/manipulation/serializer'),
    PathResolver = require('../../../../lib/common/manipulation/path-resolver'),
    ResolvingStream = require('../../../../lib/common/manipulation/resolving-stream')
;

var referenceProcessor = new ReferenceProcessor(),
    serializer = new Serializer(),
    pathResolver = new PathResolver()
;

referenceProcessor.serializer = serializer;
referenceProcessor.pathResolver = pathResolver;

var parsingTests = [
        {
            serializedParameters: 'foo0',
            expected: {
                buffer: 'foo0',
                source: 'function'
            }
        },
        {
            serializedParameters: 'bar,2',
            expected: {
                buffer: 'bar',
                source: 2
            }
        },
        {
            serializedParameters: 'foo1,.',
            expected: {
                buffer: 'foo1',
                source: 'function'
            }
        },
        {
            serializedParameters: 'foo2,$',
            expected: {
                buffer: 'foo2',
                source: 'function'
            }
        },
        {
            serializedParameters: 'foo3,>_',
            expected: {
                buffer: 'foo3',
                source: 'function'
            }
        },
        {
            serializedParameters: 'foo4,"$"',
            expected: {
                buffer: 'foo4',
                source: 'function'
            }
        }
    ]
;

var source = '...',
    processingTests = [
        {
            parameters: parsingTests[0].expected,
            expected: source
        },
        {
            parameters: parsingTests[1].expected,
            expected: 2
        },
        {
            parameters: parsingTests[2].expected,
            expected: source
        },
        {
            parameters: parsingTests[3].expected,
            expected: source
        },
        {
            parameters: parsingTests[4].expected,
            expected: source
        },
        {
            parameters: parsingTests[5].expected,
            expected: '$'
        }
    ]
;

describe('SelectionReferenceProcessor', function() {
    parsingTests.forEach(function(test) {
        it('method "parseParameters" should parse serialized parameters "{0}" in `{1}`'.format(test.serializedParameters, JSON.stringify(test.expected)), function() {
            var parameters = referenceProcessor.parseParameters(test.serializedParameters);

            // Overwrite expected functions.
            if ('function' === test.expected.source) {
                test.expected.source = parameters.source;
            }

            assert.deepEqual(parameters, test.expected);
        });
    });

    processingTests.forEach(function(test) {
        it('method "process" should process `{0}` in `{1}`'.format(JSON.stringify(test.parameters), JSON.stringify(test.expected)), function() {
            var resolvingStream = new ResolvingStream();

            resolvingStream.source = source;
            referenceProcessor.process(resolvingStream, test.parameters);

            assert.deepEqual(resolvingStream.context, test.expected);

            resolvingStream.switch();
            assert.deepEqual(resolvingStream.context, '...');
        });
    });
});
