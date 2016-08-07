'use strict';

/**
 * Expose `PathResolver`.
 */
module.exports = PathResolver;

/**
 * Initialize a new path resolver.
 */
function PathResolver() {
}

/**
 * @interface {danf:manipulation.pathResolver}
 */
PathResolver.prototype.resolve = function(path, context, separator) {
    separator = separator || '.';

    var segments = path.split(separator),
        segment,
        resolvedValue = context,
        currentSet = 0,
        resolveSegment = function(segment, segmentContext) {
            // Return undefined if the context is not an object.
            if (null == segmentContext || 'object' !== typeof segmentContext) {
                return;
            }

            // Process unnamed segment in returning an array of the values
            // of the object properties or array values.
            if ('' === segment) {
                var set = [];

                for (var key in segmentContext) {
                    set.push(segmentContext[key]);
                }

                currentSet++;

                return set;
            }

            // Handle named segment.
            return segmentContext[segment];
        }
    ;

    // Remove first segment if no named segment in path (e.g. `..`).
    var hasNamedSegment = false;

    for (var i = 0; i < segments.length; i++) {
        if ('' !== segments[i]) {
            hasNamedSegment = true;
            break;
        }
    }

    if (!hasNamedSegment) {
        segments.shift();
    }

    // Resolve path segment by segment.
    while (null != (segment = segments.shift())) {
        var previousSet = currentSet;

        // Handle case of a set (coming from a previous unnamed segment).
        if (currentSet) {
            resolvedValue = resolvedValue
                .map(function(itemContext) {
                    return resolveSegment(segment, itemContext);
                })
                .filter(function(resolvedItemValue) {
                    return undefined !== resolvedItemValue;
                })
            ;

            if (currentSet !== previousSet) {
                resolvedValue = [].concat.apply([], resolvedValue);
            }
        // Handle case with no unnamed segment.
        } else {
            resolvedValue = resolveSegment(segment, resolvedValue);
        }
    }

    return resolvedValue;
}
