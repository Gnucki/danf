'use strict';

/**
 * Module dependencies.
 */
var defineStatic = require('../assets/middleware/static'),
    NotifierRegistry = require('../../common/manipulation/notifier-registry')
;

/**
 * Expose `Initializer`.
 */
module.exports = Initializer;

/**
 * Initialize a new framework.
 */
function Initializer() {
}

/**
 * Instantiate objects.
 *
 * @param {object} framework The framework.
 * @api public
 */
Initializer.prototype.instantiate = function(framework) {
    var assetsConfigRegistry = new NotifierRegistry();
    assetsConfigRegistry.name = 'assets';
    framework.set('danf:configuration.registry.assets', assetsConfigRegistry);
}

/**
 * Inject dependencies between objects.
 *
 * @param {object} framework The framework.
 * @param {object} parameters The application parameters.
 * @api public
 */
Initializer.prototype.inject = function(framework, parameters) {
}

/**
 * Process.
 *
 * @param {object} framework The framework.
 * @param {object} parameters The application parameters.
 * @param {object} danf The danf config.
 * @param {object} configuration The application danf configuration.
 * @api public
 */
Initializer.prototype.process = function(framework, parameters, danf, configuration) {
    var app = framework.get('danf:app'),
        config = parameters['config']
    ;

    // Initialize the rendering.
    var pug = require('pug').__express;
    app.set('view engine', pug);
    app.engine('pug', pug);
    app.engine('jade', pug);

    // Define assets.
    if ('test' !== app.context.environment) {
        var mapper = framework.get('danf:assets.mapper'),
            assetsConfigRegistry = framework.get('danf:configuration.registry.assets')
        ;

        assetsConfigRegistry.addObserver(mapper);
        assetsConfigRegistry.registerSet(danf.assets);
        assetsConfigRegistry.registerSet(config.assets || {});

        app.use(defineStatic(mapper, parameters.context));
    }
}