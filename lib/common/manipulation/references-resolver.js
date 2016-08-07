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
ReferencesResolver.defineDependency('_resolvingStreamProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.resolvingStream');

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
 * Resolving stream provider.
 *
 * @var {danf:dependencyInjection.provider<danf:manipulation.resolvingStream>}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'resolvingStreamProvider', {
    set: function(resolvingStreamProvider) {
        this._resolvingStreamProvider = resolvingStreamProvider
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
                    id = this._uniqueIdGenerator.generate()
                ;

                this._references[id] = {
                    from: from,
                    origin: {
                        reference: reference,
                        source: source
                    },
                    pipe: buildResolvingPipe.call(this, reference)
                };

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
        resolvedSource
    ;

    if (source && 'object' === sourceType) {
        var proto = Object.getPrototypeOf(source);

        if (proto === Array.prototype) {
            resolvedSource = [];

            for (var i = 0; i < source.length; i++) {
                resolvedSource[i] = this.resolve(
                    delimiter,
                    source[i],
                    context
                );
            }
        } else if (proto === Object.prototype) {
            resolvedSource = {};

            for (var key in source) {
                resolvedSource[key] = this.resolve(
                    delimiter,
                    source[key],
                    context
                );
            }
        }
    } else if ('string' === sourceType) {
        var pattern = new RegExp(
              '{0}{1}{2}'
                  .format(
                      formatCompiledOpeningDelimiter(delimiter).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                      '([-\\da-f]+)',
                      formatCompiledClosingDelimiter(delimiter).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
                  )
              ,
              'g'
            ),
            match,
            lastIndex = 0,
            concatenable = false
        ;

        // Resolve references.
        while (null !== (match = pattern.exec(source))) {
            var reference = this._references[match[1]],
                resolvedReference = [],
                isStringReference = true
            ;

            // Process reference.
            if (reference) {
                var prefix = source.slice(lastIndex, match.index),
                    processedReference = reference.pipe(context)
                ;

                try {
                    // Handle concatenable references start merging.
                    if (
                        prefix ||
                        match.index ||
                        pattern.lastIndex !== source.length - 1
                    ) {
                        concatenable = true;

                        var type = Object.checkType(
                                processedReference,
                                'object|string_array|string'
                            ),
                            addPrefixedItem = function(item) {
                                resolvedReference.push('{0}{1}'.format(
                                    prefix,
                                    item
                                ));
                            }
                        ;

                        switch (type.matchedType) {
                            case 'string':
                                addPrefixedItem(processedReference);

                                break;
                            case 'string_array':
                                for (var i = 0; i < processedReference.length; i++) {
                                    addPrefixedItem(processedReference[i]);
                                }
                                isStringReference = false;

                                break;
                            default:
                                for (var key in processedReference) {
                                    addPrefixedItem(key);
                                }
                                isStringReference = false;
                        }
                    }
                } catch(error) {
                    if (error.instead) {
                        throw new Error(
                            'Cannot concatenate the reference "{0}" in source "{1}"{2} resolving as a {3} of value `{4}` in the context `{5}`.'.format(
                                reference.origin.reference,
                                reference.origin.source,
                                reference.from
                                    ? ' coming from {0}'.format(reference.from)
                                    : ''
                                ,
                                error.instead,
                                utils.stringify(processedReference),
                                utils.stringify(context)
                            )
                        );
                    }

                    throw error;
                }
            } else {
                resolvedReference = match[0];
            }

            // Merge previously resolved source with resolved reference.
            var mergedSource;

            if (null == resolvedSource) {
                mergedSource = resolvedReference;
            } else {
                mergedSource = [];

                if ('string' === typeof resolvedSource) {
                    for (var i = 0; i < resolvedReference.length; i++) {
                        mergedSource.push('{0}{1}'.format(
                            resolvedSource,
                            resolvedReference[i]
                        ));
                    }
                } else {
                    isStringReference = false;

                    for (var i = 0; i < resolvedReference.length; i++) {
                        for (var j = 0; j < resolvedSource.length; j++) {
                            mergedSource.push('{0}{1}'.format(
                                resolvedSource[j],
                                resolvedReference[i]
                            ));
                        }
                    }
                }
            }

            resolvedSource = isStringReference ? mergedSource[0] : mergedSource;
            lastIndex = pattern.lastIndex;
        }

        // Handle concatenable reference end merging.
        if (concatenable) {
            var suffix = source.slice(lastIndex);

            if ('string' === typeof resolvedSource) {
                resolvedSource += suffix
            } else {
                for (var i = 0; i < resolvedSource.length; i++) {
                    resolvedSource[i] += suffix;
                }
            }
        }
    }

    return undefined !== resolvedSource ? resolvedSource : source;
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

/**
 * Build a resolving pipe.
 *
 * @param {string} reference The reference.
 * @return {function} The resolving pipe.
 */
var buildResolvingPipe = function(reference) {
    var self = this,
        operations = reference.split('|'),
        pipe = []
    ;

    // Parse operations arguments and build resolving pipe.
    for (var i = 0; i < operations.length; i++) {
        (function(operation) {
            var processor = getProcessor.call(self, operation[0]),
                args = processor.parseParameters(operation.slice(1))
            ;

            pipe.push(function(stream) {
                return processor.process(stream, args);
            });
        })(operations[i]);
    }

    // Return the reference processing function.
    return function(context) {
        var stream = self._resolvingStreamProvider.provide({source: context});

        for (var i = 0, length = pipe.length; i < length; i++) {
            pipe[i](stream);
        }

        return stream.context;
    };
}
