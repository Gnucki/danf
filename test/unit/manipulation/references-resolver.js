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
    splitProcessor = new SplitProcessor()
;

referencesResolver.uniqueIdGenerator = uniqueIdGenerator;
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
            source: '%>foo%',
            expected: /^-%`[^`]+`%-$/
        },
        {
            delimiter: '%',
            source: 'I am %>foo%!!',
            expected: /^I am -%`[^`]+`%-!!$/
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
                    'source "{0}" compiled in "{1}" should follow pattern "{2}".'.format(
                        test.source,
                        result,
                        test.expected
                    )
                );
            } else {
                assert.deepEqual(result, test.expected);
            }
        });
    });
});