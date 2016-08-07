'use strict';

module.exports = {
    escaper: require('../../../lib/common/manipulation/escaper'),
    uniqueIdGenerator: require('../../../lib/common/manipulation/unique-id-generator'),
    referencesResolver: require('../../../lib/common/manipulation/reference-resolver'),
    referenceProcessor: {
        abstract: require('../../../lib/common/manipulation/reference-processor/abstract'),
        //selection: require('../../../lib/common/manipulation/reference-processor/selection')
    },
    referenceResolver: require('../../../lib/common/manipulation/reference-resolver'),
    referenceType: require('../../../lib/common/manipulation/reference-type'),
    dataResolver: require('../../../lib/common/manipulation/data-resolver'),
    map: require('../../../lib/common/manipulation/map'),
    registry: require('../../../lib/common/manipulation/registry'),
    notifierRegistry: require('../../../lib/common/manipulation/notifier-registry'),
    callbackExecutor: require('../../../lib/common/manipulation/callback-executor'),
    proxyExecutor: require('../../../lib/common/manipulation/proxy-executor'),
    flow: require('../../../lib/common/manipulation/flow'),
    flowDriver: require('../../../lib/common/manipulation/flow-driver'),
    dataInterpreter: {
        abstract: require('../../../lib/common/manipulation/data-interpreter/abstract'),
        default: require('../../../lib/common/manipulation/data-interpreter/default'),
        flatten: require('../../../lib/common/manipulation/data-interpreter/flatten'),
        format: require('../../../lib/common/manipulation/data-interpreter/format'),
        required: require('../../../lib/common/manipulation/data-interpreter/required'),
        type: require('../../../lib/common/manipulation/data-interpreter/type'),
        validate: require('../../../lib/common/manipulation/data-interpreter/validate')
    },
    asynchronousCallback: {
        error: require('../../../lib/common/manipulation/asynchronous-callback/error'),
        errorResult: require('../../../lib/common/manipulation/asynchronous-callback/error-result'),
        result: require('../../../lib/common/manipulation/asynchronous-callback/result')
    },
    asynchronousInput: {
        array: require('../../../lib/common/manipulation/asynchronous-input/array'),
        object: require('../../../lib/common/manipulation/asynchronous-input/object')
    },
    asynchronousIterator: {
        collection: require('../../../lib/common/manipulation/asynchronous-iterator/collection'),
        key: require('../../../lib/common/manipulation/asynchronous-iterator/key'),
        memo: require('../../../lib/common/manipulation/asynchronous-iterator/memo')
    },
    asynchronousCollection: require('../../../lib/common/manipulation/asynchronous-collection')
};
