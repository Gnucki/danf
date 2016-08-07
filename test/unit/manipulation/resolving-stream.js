'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ResolvingStream = require('../../../lib/common/manipulation/resolving-stream')
;

var resolvingStream = new ResolvingStream();

describe('ResolvingStream', function() {
    it('property "source" should allow to set and retrieve the source context', function() {
        resolvingStream.source = {foo: 'bar'};

        assert.deepEqual(resolvingStream.source, {foo: 'bar'});
    });

    it('property "context" should allow to set and retrieve the current used buffer initialized with the source', function() {
        assert.deepEqual(resolvingStream.context, {foo: 'bar'});

        resolvingStream.context = {bar: 'foo'};

        assert.deepEqual(resolvingStream.context, {bar: 'foo'});
    });

    it('method "switch" should allow to switch the current buffers and return its value', function() {
        var context = resolvingStream.switch('foo');

        assert.equal(context, null);

        resolvingStream.context = 'bar';
        context = resolvingStream.switch('foo');

        assert.equal(context, 'bar');

        context = resolvingStream.switch();

        assert.deepEqual(context, {bar: 'foo'});
    });

    it('property "buffers" should allow to retrieve all the buffers', function() {
        assert.deepEqual(resolvingStream.buffers, {'_': {bar: 'foo'}, foo: 'bar'});
    });
});
