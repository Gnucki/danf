'use strict';

/**
 * Expose `ResolvingStream`.
 */
module.exports = ResolvingStream;

/**
 * Initialize a new resolving stream.
 */
function ResolvingStream() {
    this._buffers = {};
    this._current = '_';
}

ResolvingStream.defineImplementedInterfaces(['danf:manipulation.resolvingStream']);

ResolvingStream.defineDependency('_source', 'object');

/**
 * @interface {danf:manipulation.resolvingStream}
 */
Object.defineProperty(ResolvingStream.prototype, 'source', {
    get: function() { return this._source; },
    set: function(source) {
        this._source = source;
        this.context = source;
    }
})

/**
 * @interface {danf:manipulation.resolvingStream}
 */
Object.defineProperty(ResolvingStream.prototype, 'context', {
    get: function() {
        return this._buffers[this._current];
    },
    set: function(context) {
        this._buffers[this._current] = context;
    }
});

/**
 * @interface {danf:manipulation.resolvingStream}
 */
Object.defineProperty(ResolvingStream.prototype, 'buffers', {
    get: function() { return this._buffers; }
});

/**
 * @interface {danf:manipulation.resolvingStream}
 */
ResolvingStream.prototype.switch = function(buffer) {
    this._current = buffer || '_';

    return this.context;
}
