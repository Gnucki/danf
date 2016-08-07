'use strict';

require('../../../../lib/common/init');

// Force tests execution order.
require('../path-resolver');
require('../serializer');
require('../resolving-stream');

var assert = require('assert'),
    ReferenceProcessor = require('../../../../lib/common/manipulation/reference-processor/selection'),
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
            serializedParameters: '',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: ''
                    }
                ]
            }
        },
        {
            serializedParameters: '.',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: '.'
                    }
                ]
            }
        },
        {
            serializedParameters: 'a',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a'
                    }
                ]
            }
        },
        {
            serializedParameters: 'a.b',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    }
                ]
            }
        },
        {
            serializedParameters: 'a.b.get()',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    },
                    {
                        type: 'method',
                        method: 'get',
                        args: []
                    }
                ]
            }
        },
        {
            serializedParameters: 'a.b.convert("42")',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    },
                    {
                        type: 'method',
                        method: 'convert',
                        args: ["42"]
                    }
                ]
            }
        },
        {
            serializedParameters: 'a.b.concat("foo", 2, $c, .c)',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    },
                    {
                        type: 'method',
                        method: 'concat',
                        args: ["foo", 2, 'function', 'function']
                    }
                ]
            }
        },
        {
            serializedParameters: 'a.b.get().c.d',
            expected: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    },
                    {
                        type: 'method',
                        method: 'get',
                        args: []
                    },
                    {
                        type: 'property',
                        path: 'c.d'
                    }
                ]
            }
        }
    ]
;

var processingTests = [
        {
            source: {foo: 'bar'},
            parameters: parsingTests[0].expected,
            expected: {foo: 'bar'}
        },
        {
            source: {foo: 'bar'},
            parameters: parsingTests[1].expected,
            expected: ['bar']
        },
        {
            source: {a: 1},
            parameters: parsingTests[2].expected,
            expected: 1
        },
        {
            source: {a: {b: '2'}},
            parameters: parsingTests[3].expected,
            expected: '2'
        },
        {
            source: {
                a: {
                    b: {
                        get: function() {
                            return 'foo';
                        }
                    }
                }
            },
            parameters: parsingTests[4].expected,
            expected: 'foo'
        },
        {
            source: {
                a: {
                    b: {
                        convert: function(value) {
                            return +value;
                        }
                    }
                }
            },
            parameters: parsingTests[5].expected,
            expected: 42
        },
        {
            source: {
                a: {
                    b: {
                        concat: function() {
                            return Array.prototype.slice.call(arguments).join('-');
                        },
                        c: 'bar'
                    }
                },
                c: 'foobar'
            },
            parameters: parsingTests[6].expected,
            expected: 'foo-2-foobar-bar'
        },
        {
            source: {
                a: {
                    b: {
                        get: function() {
                            return {
                                c: {
                                    d: 4,
                                    e: 5
                                }
                            };
                        }
                    }
                },
                c: 'foobar'
            },
            parameters: parsingTests[7].expected,
            expected: 4
        }
    ]
;

describe('SelectionReferenceProcessor', function() {
    parsingTests.forEach(function(test) {
        it('method "parseParameters" should parse serialized parameters "{0}" in `{1}`'.format(test.serializedParameters, JSON.stringify(test.expected)), function() {
            var parameters = referenceProcessor.parseParameters(test.serializedParameters);

            // Overwrite expected functions.
            for (var i = 0; i < test.expected.selectors.length; i++) {
                var selector = test.expected.selectors[i];

                if (selector.args) {
                    selector.args = selector.args.map(function(arg, index) {
                        return arg === 'function'
                            ? parameters.selectors[i].args[index]
                            : arg
                        ;
                    });
                }
            }

            assert.deepEqual(parameters, test.expected);
        });
    });

    processingTests.forEach(function(test) {
        it('method "process" should process `{0}` in `{1}`'.format(JSON.stringify(test.source), JSON.stringify(test.expected)), function() {
            var resolvingStream = new ResolvingStream();

            resolvingStream.source = test.source;
            referenceProcessor.process(resolvingStream, test.parameters);

            assert.deepEqual(resolvingStream.context, test.expected);
        });
    });
});
