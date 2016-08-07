'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Serializer = require('../../../lib/common/manipulation/serializer')
;

var serializer = new Serializer();

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
            value: '"-4.50"',
            expected: '-4.50'
        },
        {
            value: 'foo',
            expected: 'foo'
        },
        {
            value: 'foo',
            unserializeOthers: function(value) {
              return '>{0}<'.format(value);
            },
            expected: '>foo<'
        },
        {
            value: '',
            expected: null
        },
        {
            value: 'null',
            expected: null
        },
        {
            value: 'undefined',
            expected: null
        }
    ]
;

describe('PathResolver', function() {
    serializationTests.forEach(function(test) {
        it('method "serialize" should serialize `{0}` in `{1}`'.format(JSON.stringify(test.value), test.expected), function() {
            var result = serializer.serialize(test.value, test.space);

            assert.deepEqual(
                result,
                test.expected
            );
        });
    });

    unserializationTests.forEach(function(test) {
        it('method "unserialize" should unserialize `{0}` in `{1}`'.format(test.value, JSON.stringify(test.expected)), function() {
            var result = serializer.unserialize(test.value, test.unserializeOthers);

            assert.deepEqual(
                result,
                test.expected
            );
        });
    });
});
