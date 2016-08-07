'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    ReferencesResolver = require('../../../lib/common/manipulation/references-resolver'),
    UniqueIdGenerator = require('../../../lib/common/manipulation/unique-id-generator'),
    JoinProcessor = require('../../fixture/manipulation/join-reference-processor'),
    SplitProcessor = require('../../fixture/manipulation/split-reference-processor')
;

var referencesResolver = new ReferencesResolver(),
    uniqueIdGenerator = new UniqueIdGenerator(),
    joinProcessor = new JoinProcessor(),
    splitProcessor = new SplitProcessor(),
    resolvingStreamProvider = {
        provide: function(parameters) {
            return {context: parameters.source};
        }
    },
    compilations = []
;

referencesResolver.uniqueIdGenerator = uniqueIdGenerator;
referencesResolver.resolvingStreamProvider = resolvingStreamProvider;
referencesResolver.addProcessor(joinProcessor);
referencesResolver.addProcessor(splitProcessor);

var compilationTests = [
        {
            delimiter: '%',
            source: 'foo',
            expected: 'foo'
        },
        {
            delimiter: '%',
            source: '%>%',
            expected: /^-%`[-\da-f]+`%-$/
        },
        {
            delimiter: '%',
            source: '%<%',
            expected: /^-%`[-\da-f]+`%-$/
        },
        {
            delimiter: '%',
            source: 'I am %>%!!',
            expected: /^I am -%`[-\da-f]+`%-!!$/
        },
        {
            delimiter: '%',
            source: 'I am %<%!!',
            expected: /^I am -%`[-\da-f]+`%-!!$/
        },
        {
            delimiter: '%',
            source: 'I am %>% and %>% !!',
            expected: /^I am -%`[-\da-f]+`%- and -%`[-\da-f]+`%- !!$/
        },
        {
            delimiter: '%',
            source: 'I am %<% and %<% !!',
            expected: /^I am -%`[-\da-f]+`%- and -%`[-\da-f]+`%- !!$/
        },
        {
            delimiter: '%',
            source: '%> %',
            expected: /^-%`[-\da-f]+`%-$/
        },
        {
            delimiter: '%',
            source: '%>-|< %',
            expected: /^-%`[-\da-f]+`%-$/
        }
    ]
;

var resolvingTests = [
        {
            delimiter: '%',
            compilation: 0,
            context: ['foo', 'bar'],
            expected: 'foo'
        },
        {
            delimiter: '%',
            compilation: 1,
            context: ['foo', 'bar'],
            expected: 'foo.bar'
        },
        {
            delimiter: '%',
            compilation: 2,
            context: 'foo.bar',
            expected: ['foo', 'bar']
        },
        {
            delimiter: '%',
            compilation: 3,
            context: ['foo', 'bar'],
            expected: 'I am foo.bar!!'
        },
        {
            delimiter: '%',
            compilation: 4,
            context: 'foo.bar',
            expected: ['I am foo!!', 'I am bar!!']
        },
        {
            delimiter: '%',
            compilation: 5,
            context: ['foo', 'bar'],
            expected: 'I am foo.bar and foo.bar !!'
        },
        {
            delimiter: '%',
            compilation: 6,
            context: 'foo.bar',
            expected: [
                'I am foo and foo !!',
                'I am bar and foo !!',
                'I am foo and bar !!',
                'I am bar and bar !!'
            ]
        }
    ]
;

describe('ReferencesResolver', function() {
    compilationTests.forEach(function(test) {
        it('method "compile" should compile references in a source', function() {
            var result = referencesResolver.compile(
                    test.delimiter,
                    test.source,
                    test.from
                )
            ;

            if (test.expected instanceof RegExp) {
                assert.ok(
                    test.expected.test(result),
                    'source "{0}" compilation "{1}" should follow pattern "{2}".'.format(
                        test.source,
                        result,
                        test.expected
                    )
                );
            } else {
                assert.deepEqual(
                  result,
                  test.expected,
                  'source "{0}" compilation "{1}" should be equal to "{2}".'.format(
                      test.source,
                      result,
                      test.expected
                  )
                );
            }

            compilations.push(result);
        });
    });

    resolvingTests.forEach(function(test) {
        it('method "resolve" should resolve the compiled references in a source from a context', function() {
            var compilation = compilations[test.compilation],
                result = referencesResolver.resolve(
                    test.delimiter,
                    compilations[test.compilation],
                    test.context
                )
            ;

            assert.deepEqual(
                result,
                test.expected,
                'source "{0}" should resolve to "{1}", "{2}" resolved instead.'.format(
                    compilation,
                    test.expected,
                    result || 'undefined'
                )
            );
        });
    });
});
