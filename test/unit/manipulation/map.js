'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    Map = require('../../../lib/common/manipulation/map')
;

var map = new Map();

describe('Map', function() {
    it('method "set and get" should allow to set and retrieve value from the map', function() {
        map.set('foo', 1);
        map.set('bar', 3);

        assert.equal(map.get('foo'), 1);
        assert.equal(map.get('bar'), 3);
    })

    it('method "has" should check the existence of a setted value', function() {
        assert.equal(map.has('foo'), true);
        assert.equal(map.has('dumb'), false);
    })

    it('method "getAll" should retrieve all the setted values', function() {
        assert.deepEqual(
            map.getAll(),
            {
                foo: 1,
                bar: 3
            }
        );
    })

    it('method "getAll" should not return the internal map', function() {
        var values = map.getAll();

        values.foo = 2;

        assert.deepEqual(
            map.getAll(),
            {
                foo: 1,
                bar: 3
            }
        );
    })

    it('method "unset" should unset a specific setted value', function() {
        map.unset('foo');

        assert.equal(map.has('a'), false);
        assert.deepEqual(
            map.getAll(),
            {
                bar: 3
            }
        );
    })

    it('method "clear" should unset all setted values', function() {
        map.clear();

        assert.equal(map.has('bar'), false);
        assert.deepEqual(
            map.getAll(),
            {}
        );
    })

    it('method "get" should fail to retrieve a not setted value', function() {
        assert.throws(
            function() {
                map.name = 'values';
                map.get('foo');
            },
            'The item "foo" has not been setted in the list of "values"\.'
        );
    })
})