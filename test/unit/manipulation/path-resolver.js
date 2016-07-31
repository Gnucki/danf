'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    PathResolver = require('../../../lib/common/manipulation/path-resolver')
;

var pathResolver = new PathResolver();

var resolvingTests = [
        {
            path: 'foo',
            context: {foo: 2},
            expected: 2
        },
        {
            path: 'foo.bar',
            context: {foo: {bar: '3'}},
            expected: '3'
        },
        {
            path: 'foo..a',
            context: {
                foo: [
                    {a: 2},
                    {a: [0]}
                ]
            },
            expected: [2, [0]]
        },
        {
            path: 'foo..a',
            context: {
                foo: [
                    {a: 2},
                    {b: [0]}
                ]
            },
            expected: [2]
        },
        {
            path: 'foo..a..x',
            context: {
                foo: [
                    {
                        a: {
                            i: {x: 3},
                            j: {y: 4},
                            k: {x: 'bar', y: 5}
                        }
                    },
                    {
                        b: {
                            i: {x: 6}
                        }
                    },
                    {
                        a: [
                            {y: 7},
                            {x: 8},
                            {x: 9}
                        ]
                    }
                ]
            },
            expected: [3, 'bar', 8, 9]
        },
        {
            path: 'foo',
            context: {bar: 2}
        },
        {
            path: 'foo..a',
            context: {bar: 2}
        },
        {
            path: 'foo..a',
            context: {foo: 2}
        },
        {
            path: 'foo..a',
            context: {foo: []},
            expected: []
        },
        {
            path: 'foo..a.b',
            context: {foo: [{a: 3}]},
            expected: []
        },
        {
            path: 'foo..a.b',
            context: {foo: [{a: {c: 3}}]},
            expected: []
        },
        {
            path: '',
            context: {foo: 'bar'},
            expected: {foo: 'bar'}
        },
        {
            path: '.',
            context: {
                foo: [
                    {a: 1},
                    {b: 2}
                ],
                bar: [
                    {c: 3}
                ]
            },
            expected: [
               [{a: 1}, {b: 2}],
               [{c: 3}]
            ]
        },
        {
            path: '..',
            context: {
                foo: [
                    {a: 1},
                    {b: 2}
                ],
                bar: [
                    {c: 3}
                ]
            },
            expected: [
                {a: 1},
                {b: 2},
                {c: 3}
            ]
        },
        {
            path: '...',
            context: {
                foo: [
                    {a: 1},
                    {b: 2}
                ],
                bar: [
                    {c: 3}
                ]
            },
            expected: [1, 2, 3]
        },
        {
            path: '....',
            context: {
                foo: [
                    {a: 1},
                    {b: 2}
                ],
                bar: [
                    {c: 3}
                ]
            },
            expected: []
        },
        {
            path: 'foo.',
            context: {
                foo: {
                    a: 1,
                    b: 2
                },
                bar: {
                    c: 3
                }
            },
            expected: [1, 2]
        },
        {
            path: '.c',
            context: {
                foo: {
                    a: 1,
                    b: 2,
                    c: 12
                },
                bar: {
                    c: 14
                }
            },
            expected: [12, 14]
        },
        {
            path: '..c',
            context: {
                foo: {
                    a: {b: 2, c: 13}
                }
            },
            expected: [13]
        },
        {
            path: '.c.',
            context: {
                foo: {
                    c: {d: 20, e: 21}
                }
            },
            expected: [20, 21]
        }
    ]
;

describe('PathResolver', function() {
    resolvingTests.forEach(function(test) {
        it('method "resolve" should resolve a path from a context', function() {
            var result = pathResolver.resolve(
                    test.path,
                    test.context,
                    test.separator
                )
            ;

            assert.deepEqual(
                result,
                test.expected,
                'source "{0}" should resolve correctly.'.format(
                    test.path,
                    test.expected
                )
            );
        });
    });
});
