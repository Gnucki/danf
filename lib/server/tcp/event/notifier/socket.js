'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../../common/tcp/event/notifier/socket')
;

/**
 * Expose `Socket`.
 */
module.exports = Socket;

/**
 * Initialize a new socket notifier.
 */
function Socket() {
    Abstract.call(this);
}

utils.extend(Abstract, Socket);

Socket.defineDependency('_app', 'function');

/**
 * IO object.
 *
 * @var {object}
 * @api protected
 */
Object.defineProperty(Socket.prototype, 'io', {
    get: function() {
        if (!this._io) {
            this._io = this._socketIo(this._app.server);
        }

        return this._io;
    }
});

/**
 * App.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Socket.prototype, 'app', {
    set: function(app) { this._app = app; }
});

/**
 * @inheritdoc
 */
Socket.prototype.addSocketListener = function(addListener) {
    this.io.on('connection', addListener);
}

/**
 * @inheritdoc
 */
Socket.prototype.notifyEvent = function(name, parameters, sequence, data) {
    this.io.emit(parameters.event, data);
}