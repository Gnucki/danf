'use strict';

require('../../../../lib/common/init');

// Force tests execution order.
require('../path-resolver');
require('../serializer');
require('../resolving-stream');
require('../math-evaluator');

var assert = require('assert'),
    ReferenceProcessor = require('../../../../lib/common/manipulation/reference-processor/selection'),
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

var tests = [
        {
            serializedParameters: '',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: ''
                    }
                ]
            },
            source: {foo: 'bar'},
            expected: {foo: 'bar'}
        },
        {
            serializedParameters: '.',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: '.'
                    }
                ]
            },
            source: {foo: 'bar'},
            expected: ['bar']
        },
        {
            serializedParameters: 'a',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a'
                    }
                ]
            },
            source: {a: 1},
            expected: 1
        },
        {
            serializedParameters: 'a.b',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    }
                ]
            },
            source: {a: {b: '2'}},
            expected: '2'
        },
        {
            serializedParameters: 'a.b.get()',
            parameters: {
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
            },
            source: {
                a: {
                    b: {
                        get: function() {
                            return 'foo';
                        }
                    }
                }
            },
            expected: 'foo'
        },
        {
            serializedParameters: 'a.b.convert("42")',
            parameters: {
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
            },
            source: {
                a: {
                    b: {
                        convert: function(value) {
                            return +value;
                        }
                    }
                }
            },
            expected: 42
        },
        {
            serializedParameters: 'a.b.concat("foo", 2, $c, .c)',
            parameters: {
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
            },
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
            expected: 'foo-2-foobar-bar'
        },
        {
            serializedParameters: 'a.b.get().c.d',
            parameters: {
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
            },
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
            expected: 4
        },
        {
            serializedParameters: 'a.b+2*.a.c',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'a.b'
                    }
                ],
                operation: '+2*.a.c'
            },
            source: {
                a: {
                    b: 3,
                    c: 4
                }
            },
            expected: 11
        },
        {
            serializedParameters: 'a.b.get().c.d+2(.e*2)',
            parameters: {
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
                ],
                operation: '+2(.e*2)'
            },
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
                e: 8
            },
            expected: 36
        },
        {
            serializedParameters: 'foo?.bar==="bar"',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'foo'
                    },
                ],
                condition: 'function'
            },
            source: {
                foo: 'bar',
                bar: 'foo'
            },
            expected: {
                foo: 'bar',
                bar: 'foo'
            }
        },
        {
            serializedParameters: 'foo?.bar==="foo"',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'foo'
                    },
                ],
                condition: 'function'
            },
            source: {
                foo: 'bar',
                bar: 'foo'
            },
            expected: 'bar'
        },
        {
            serializedParameters: 'bar?.bar==="foo"&&.foo==="foo"',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'bar'
                    },
                ],
                condition: 'function'
            },
            source: {
                foo: 'bar',
                bar: 'foo'
            },
            expected: {
                foo: 'bar',
                bar: 'foo'
            }
        },
        {
            serializedParameters: 'bar?.bar==="foo"||.foo==="foo"',
            parameters: {
                selectors: [
                    {
                        type: 'property',
                        path: 'bar'
                    },
                ],
                condition: 'function'
            },
            source: {
                foo: 'bar',
                bar: 'foo'
            },
            expected: 'foo'
        }
    ]
;

describe('SelectionReferenceProcessor', function() {
    tests.forEach(function(test) {
        it('method "parseParameters" should parse serialized parameters "{0}" in `{1}`'.format(test.serializedParameters, JSON.stringify(test.parameters)), function() {
            var parameters = referenceProcessor.parseParameters(test.serializedParameters);

            // Overwrite expected functions.
            for (var i = 0; i < test.parameters.selectors.length; i++) {
                var selector = test.parameters.selectors[i];

                if (selector.args) {
                    selector.args = selector.args.map(function(arg, index) {
                        return arg === 'function'
                            ? parameters.selectors[i].args[index]
                            : arg
                        ;
                    });
                }
            }
            if ('function' === test.parameters.condition) {
                test.parameters.condition = parameters.condition;
            }

            assert.deepEqual(parameters, test.parameters);
        });

        it('method "process" should process `{0}` in `{1}`'.format(JSON.stringify(test.source), JSON.stringify(test.expected)), function() {
            var resolvingStream = new ResolvingStream();

            resolvingStream.source = test.source;
            referenceProcessor.process(resolvingStream, test.parameters);

            assert.deepEqual(resolvingStream.context, test.expected);
        });
    });

    tests.forEach(function(test) {
    });
});
