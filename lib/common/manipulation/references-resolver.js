// Si type = object && value = ref ne pas throw error?
// . select
// # operation
// > context
// _ flatten
// : default

// %`a|_|_`%
// --%`.a`%--

'use strict';

/**
 * Expose `ReferencesResolver`.
 */
module.exports = ReferencesResolver;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new references resolver.
 */
function ReferencesResolver() {
    this._references = {};
    this._processors = {};
}

ReferencesResolver.defineImplementedInterfaces(['danf:manipulation.referenceResolver']);

ReferencesResolver.defineDependency('_uniqueIdGenerator', 'danf:manipulation.uniqueIdGenerator');
ReferencesResolver.defineDependency('_processors', 'danf:manipulation.referenceProcessor_object');

/**
 * Unique id generator.
 *
 * @var {danf:manipulation.uniqueIdGenerator}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'uniqueIdGenerator', {
    set: function(uniqueIdGenerator) {
        this._uniqueIdGenerator = uniqueIdGenerator
    }
});

/**
 * Processors.
 *
 * @var {danf:manipulation.referenceProcessor_object}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'processors', {
    set: function(processors) {
        this._processors = {};

        for (var i = 0; i < processors.length; i++) {
            this.addProcessor(processors[i]);
        }
    }
});

/**
 * Add a processor.
 *
 * @param {danf:manipulation.referenceProcessor} processor The processor.
 * @api public
 */
ReferencesResolver.prototype.addProcessor = function(processor) {
    this._processors[processor.prefix] = processor;
}

/**
 * @interface {danf:manipulation.referencesResolver}
 */
ReferencesResolver.prototype.compile = function(delimiter, source, from) {
    var self = this,
        sourceType = typeof source,
        compiledSource = ''
    ;

    from = from || '';

    // Compile embedded references.
    if (source && 'object' === sourceType) {
        var proto = Object.getPrototypeOf(source);

        if (proto === Array.prototype) {
            compiledSource = [];

            for (var i = 0; i < source.length; i++) {
                compiledSource[i] = this.compile(
                    delimiter,
                    source[i],
                    '{0}[{1}]'.format(from, i)
                );
            }
        } else if (proto === Object.prototype) {
            compiledSource = {};

            for (var key in source) {
                compiledSource[key] = this.compile(
                    delimiter,
                    source[key],
                    '{0}.{1}'.format(from, key)
                );
            }
        }
    // Find and compile references.
    } else if ('string' === sourceType) {
        var patterns = [],
            lastIndex = 0
        ;

        patterns.push(new RegExp(
            '{0}`([^{0}]+)`{0}'.format(
                delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            ),
            'g'
        ));
        patterns.push(new RegExp(
            '{0}([^{0}]+){0}'.format(
                delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            ),
            'g'
        ));


        for (var i = 0; i < patterns.length; i++) {
            var match,
                pattern = patterns[i]
            ;

            while (null !== (match = pattern.exec(source))) {
                var reference = match[1],
                    id = this._uniqueIdGenerator.generate(),
                    pipe = reference.split('|')
                ;

                this._references[id] = {
                    from: from,
                    pipe: []
                };

                var reference = this._references[id];

                // Compile reference.
                for (var j = 0; j < pipe.length; j++) {
                    (function(reference, section) {
                        var processor = getProcessor.call(self, section[0]),
                            args = processor.parseArguments(section.slice(1))
                        ;

                        reference.pipe.push(function() {
                            processor.process(args);
                        });
                    })(reference, pipe[j]);
                }

                compiledSource += '{0}{1}{2}{3}'.format(
                    source.slice(lastIndex, match.index),
                    formatCompiledOpeningDelimiter(delimiter),
                    id,
                    formatCompiledClosingDelimiter(delimiter)
                );

                lastIndex = pattern.lastIndex;
            }
        }

        compiledSource += source.slice(lastIndex);
    }

    return compiledSource;
}

/**
 * @interface {danf:manipulation.referencesResolver}
 */
ReferencesResolver.prototype.resolve = function(delimiter, source, context) {
    var sourceType = typeof source,
        resolvedSource = source
    ;

    if (source && 'object' === sourceType) {
        var proto = Object.getPrototypeOf(source);

        if (proto === Array.prototype) {
            compiledSource = [];

            for (var i = 0; i < source.length; i++) {
                resolvedSource[i] = this.resolve(
                    delimiter,
                    source[i],
                    context
                );
            }
        } else if (proto === Object.prototype) {
            compiledSource = {};

            for (var key in source) {
                resolvedSource[key] = this.resolve(
                    delimiter,
                    source[key],
                    context
                );
            }
        }
    } else if ('string' === sourceType) {
        var compiledDelimiter = formatCompiledDelimiter(delimiter),
            references = source.split(compiledDelimiter)
        ;

        for (var i = 0; i < references.length; i++) {
            var id = references[i],
                buffers = []
            ;

            if (this._references[id]) {
                var reference = this._references[id];

                for (var j = 0; j < reference.pipe.length; j++) {
                    var flow = reference.pipe[j];

                    resolvedSource = flow(resolvedSource, context);
                }
            }
        }
    }

    return resolvedSource;
}

/**
 * Format a compiled opening delimiter.
 *
 * @param {string} delimiter The delimiter
 * @return {string} The formatted delimiter.
 */
var formatCompiledOpeningDelimiter = function(delimiter) {
    return '-{0}`'.format(delimiter);
}

/**
 * Format a compiled closing delimiter.
 *
 * @param {string} delimiter The delimiter
 * @return {string} The formatted delimiter.
 */
var formatCompiledClosingDelimiter = function(delimiter) {
    return '`{0}-'.format(delimiter);
}

/**
 * Get a processor.
 *
 * @param {string} id The processor id.
 * @return {danf:manipulation.referenceProcessor} The processor.
 */
var getProcessor = function(id) {
    if (null == this._processors[id]) {
        throw new Error('No reference processor "{0}" found.'.format(id));
    }

    return this._processors[id];
}