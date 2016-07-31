'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Serializer = require('../../../lib/common/manipulation/serializer')
;

var serializer = new Serializer();

serializer.pathResolver = {
    resolve: function(value, context) {
        return '{0}{1}'.format(value, context);
    }
}

var serializationTests = [
        {
            value: 'a',
            expected: '"a"'
        },
        {
            expected: 'null'
        },
        {
            value: null,
            expected: 'null'
        },
        {
            value: 'null',
            expected: '"null"'
        },
        {
            value: ['foo', 'bar'],
            expected: '["foo","bar"]'
        },
        {
            value: {foo: 'bar'},
            expected: '{"foo":"bar"}'
        },
        {
            value: {foo: 'bar'},
            space: 4,
            expected:
                '{\n' +
                '    "foo": "bar"\n' +
                '}'
        }
    ]
;

var unserializationTests = [
        {
            value: '"foo"',
            expected: 'foo'
        },
        {
            value: '"foo.bar"',
            expected: 'foo.bar'
        },
        {
            value: '"1"',
            expected: '1'
        },
        {
            value: '"true"',
            expected: 'true'
        },
        {
            value: '"[]"',
            expected: '[]'
        },
        {
            value: '"{}"',
            expected: '{}'
        },
        {
            value: '["foo", "bar"]',
            expected: ['foo', 'bar']
        },
        {
            value: '{"foo": "bar"}',
            expected: {foo: 'bar'}
        },
        {
            value: '2',
            expected: 2
        },
        {
            value: 'true',
            expected: true
        },
        {
            value: 'false',
            expected: false
        },
        {
            value: '3.5',
            expected: 3.5
        },
        {
            value: '-4.50',
            expected: -4.5
        },
        {
            value: '>foo',
            contexts: {'>': '<', '-': 'bar'},
            expected: 'foo<'
        },
        {
            value: '-foo',
            contexts: {'>': '<', '-': 'bar'},
            expected: 'foobar'
        },
        {
            value: '-foo',
            expected: '-foo'
        },
        {
            value: '"-foo"',
            contexts: {'>': '<', '-': 'bar'},
            expected: '-foo'
        },
        {
            value: 'foo',
            expected: 'foo'
        }
    ]
;

describe('PathResolver', function() {
    serializationTests.forEach(function(test) {
        it('method "serialize" should serialize `{0}` in `{1}`'.format(JSON.stringify(test.value), test.expected), function() {
            var result = serializer.serialize(test.value, test.space);

            assert.deepStrictEqual(
                result,
                test.expected
            );
        });
    });

    unserializationTests.forEach(function(test) {
        it('method "unserialize" should unserialize `{0}` in `{1}`'.format(test.value, JSON.stringify(test.expected)), function() {
            var result = serializer.unserialize(test.value, test.contexts);

            assert.deepStrictEqual(
                result,
                test.expected
            );
        });
    });
});
