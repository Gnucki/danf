'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Flow = require('../../../lib/common/manipulation/flow')
;

var mapProvider = require('../../fixture/manipulation/map-provider');

var flowTests = [
    {
        scope: '.',
        input: 10,
        expected: 16
    },
    {
        scope: null,
        input: 10,
        expected: 10
    },
    {
        scope: null,
        input: 10,
        expected: 10
    },
    {
        scope: 'foo',
        input: {foo: 10},
        expected: {foo: 16}
    },
    {
        scope: 'foo.bar',
        input: {foo: {bar: 10}},
        expected: {foo: {bar: 16}}
    },
    {
        scope: 'foo.bar.foo',
        input: {foo: {bar: {foo: 10}}},
        expected: {foo: {bar: {foo: 16}}}
    },
    {
        scope: 'foo.`bar.foo`',
        input: {foo: {'bar.foo': 10}},
        expected: {foo: {'bar.foo': 16}}
    },
    {
        scope: 'foo.`bar.foo`',
        input: null,
        expected: {foo: {'bar.foo': 6}}
    }
];

describe('Flow', function() {
    flowTests.forEach(function(test) {
        it('should allow to wait for asynchrone tasks to process', function(done) {
            var flow = new Flow();

            flow.stream = test.input;
            flow.initialScope = test.scope;
            flow.context = mapProvider.provide();
            flow.callback = function(result) {
                assert.deepEqual(result, test.expected);
                done();
            };
            flow.__init();

            for (var i = 0; i <= 3; i++) {
                (function(i) {
                    var task = flow.wait();

                    setTimeout(
                        function() {
                            flow.end(task, null, function(stream) {
                                if (null == stream) {
                                    stream = 0;
                                }

                                return stream + i;
                            });
                        },
                        20
                    )
                })(i);
            }
        })
    })

    it('should allow to wait for tributary asynchrone tasks to process', function(done) {
        var flow = new Flow(),
            add = function(value) {
                var task = flow.wait();

                setTimeout(
                    function() {
                        flow.end(task, null, function(stream) {
                            if (null == stream) {
                                stream = 0;
                            }

                            return stream + value;
                        });
                    },
                    20
                )
            },
            j = 0
        ;

        flow.stream = {};
        flow.initialScope = 'foo';
        flow.context = mapProvider.provide();
        flow.callback = function(result) {
            assert.deepEqual(
                result,
                {
                    foo: {
                        bar1: 6,
                        bar2: {
                            bar3: 10,
                            bar4: 14
                        }
                    }
                }
            );
            done();
        };
        flow.__init();

        var tributary = flow.addTributary('bar1');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }

        j += 1;

        flow.mergeTributary(tributary);
        flow.addTributary('bar2');
        var tributary = flow.addTributary('bar3');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }

        j += 1;

        flow.mergeTributary(tributary);
        flow.addTributary('bar4');

        for (var i = j; i <= j + 3; i++) {
            add(i);
        }
    })
})