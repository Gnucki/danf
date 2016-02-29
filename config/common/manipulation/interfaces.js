'use strict';

module.exports = {
    escaper: {
        methods: {
            /**
             * Escape strings.
             *
             * @param {mixed} source The source to look for the strings.
             * @param {string_array} strings The strings.
             *
             * @return {mixed} The escaped source.
             */
            escape: {
                arguments: [
                    'mixed/source',
                    'string_array/strings'
                ],
                returns: 'mixed'
            },
            /**
             * Unescape strings.
             *
             * @param {mixed} source The source to look for the strings.
             * @param {string_array} strings The strings.
             *
             * @return {string} The unescaped source.
             */
            unescape: {
                arguments: [
                    'mixed/source',
                    'string_array/strings'
                ],
                returns: 'mixed'
            }
        }
    },
    uniqueIdGenerator: {
        methods: {
            /**
             * Generate a unique id.
             *
             * @return {string} The unique id.
             */
            generate: {
                returns: 'string'
            }
        }
    },
    referenceResolver: {
        methods: {
            /**
             * Extract an existing reference in a source.
             *
             * @param {string} source The string where the reference occurred.
             * @param {string} type The type of the reference.
             * @param {string|null} inText An optionnal text specifying where the reference is declared (errors).
             * @return {string_array|null} The existing reference or null.
             */
            extract: {
                arguments: [
                    'string/source',
                    'string/type',
                    'string|null/inText'
                ],
                returns: 'string_array|null'
            },
            /**
             * Resolve the references occurring in a source.
             *
             * Examples:
             *
             *     source = %foo.bar%
             *     type = '%'
             *     context = { foo: { bar: 'ok' } }
             *     => returns 'ok'
             *
             *     source = I love %who%
             *     type = '%'
             *     context = { who: 'you' }
             *     => returns 'I love you'
             *
             *     source = I love %who%
             *     type = '%'
             *     context = { who: ['you', 'me'] }
             *     => returns ['I love you', 'I love me']
             *
             *     source = %who%
             *     type = '%'
             *     context = {
             *         who: {
             *             you: 'Johna Doe',
             *             me: 'John Doe'
             *         }
             *     }
             *     => returns { you: 'Johna Doe', me: 'John Doe' }
             *
             *     source = I love %who%
             *     type = '%'
             *     context = {
             *         who: {
             *             you: 'Johna Doe',
             *             me: 'John Doe'
             *         }
             *     }
             *     => returns ['I love you', 'I love me']
             *
             *     source = '%who.name.first% %who.name.last% is %who.age% and lives in %who.cities%',
             *     context = {
             *         who: [
             *             {
             *                 name: {
             *                     first: 'John',
             *                     last: 'Doe'
             *                 },
             *                 age: 25,
             *                 cities: ['Paris', 'New York']
             *             },
             *             {
             *                 name: {
             *                     first: 'Bobby',
             *                     last: 'Bob'
             *                 },
             *                 age: 28,
             *                 cities: ['Houston']
             *             },
             *         ]
             *     }
             *     => returns [
             *            'John Doe is 25 and lives in Paris',
             *            'John Doe is 25 and lives in New York',
             *            'Bobby Bob is 28 and lives in Houston'
             *        ]
             *
             * @param {string} source The string where the reference occurred.
             * @param {string} type The type of the reference.
             * @param {mixed} context The context allowing to resolve the reference.
             * @param {string|null} inText An optionnal text specifying where the reference is declared (errors).
             * @return {mixed} The resolved references.
             */
            resolve: {
                arguments: [
                    'string/source',
                    'string/type',
                    'mixed/context',
                    'string|null/inText'
                ],
                returns: 'mixed'
            }
        }
    },
    referenceType: {
        getters: {
            /**
             * Identifier name.
             *
             * @return {string}
             */
            name: 'string',
            /**
             * Delimiter.
             *
             * @return {string}
             */
            delimiter: 'string',
            /**
             * Size.
             *
             * if size = 1 & delimiter = % => %ref%
             * if size = 4 & delimiter = > => >ref>is>like>that>
             *
             * @return {number}
             */
            size: 'number',
            /**
             * Indexes of the reference which should be namespaced when asked.
             *
             * if size = 4 & delimiter = > & namespace = [0, 2] => >prefix:ref>is>prefix:like>that>
             *
             * @return {number_array}
             */
            namespace: 'number_array',
            /**
             * Whether or not the type allow the concatenation.
             *
             * @return {boolean}
             */
            allowsConcatenation: 'boolean'
        }
    },
    dataResolver: {
        methods: {
            /**
             * Merge two data from a contract.
             *
             * @param {mixed} data1 The first data.
             * @param {mixed} data2 The second data.
             * @param {object} contract The contract the data should respect.
             * @param {object} erase Should erase data1 with data2 if conflict?
             * @param {string} namespace The namespace of the data.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @param {boolean} isRoot Whether or not this is the root merging.
             * @return {mixed} The merged data.
             */
            merge: {
                arguments: [
                    'mixed/data1',
                    'mixed/data2',
                    'object/contract',
                    'boolean|undefined/erase',
                    'string|undefined/namespace',
                    'object|undefined/parameters',
                    'boolean|undefined/isRoot'
                ],
                returns: 'mixed'
            },
            /**
             * Resolve a data from a contract.
             *
             * @param {mixed} data The data.
             * @param {object} contract The contract the data should respect.
             * @param {string} namespace The optional namespace.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @param {boolean} isRoot Whether or not this is the root resolving.
             * @return {mixed} The resolved data.
             */
            resolve: {
                arguments: [
                    'mixed/data',
                    'object/contract',
                    'string|undefined/namespace',
                    'object|undefined/parameters',
                    'boolean|undefined/isRoot'
                ],
                returns: 'mixed'
            }
        }
    },
    dataInterpreter: {
        methods: {
            /**
             * Format a contract.
             *
             * @param {object} contract The contract.
             * @return {object} The formatted contract.
             */
            formatContract: {
                arguments: ['object/contract'],
                returns: 'object'
            },
            /**
             * Merge two data from a contract.
             *
             * @param {string} name The name of the data.
             * @param {mixed} value The passed value between data interpreters.
             * @param {mixed} data1 The first data.
             * @param {mixed} data2 The second data.
             * @param {object} contract The contract the data should respect.
             * @param {object} erase Should erase data1 with data2 if conflict?
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @return {mixed} The resolved data.
             */
            merge: {
                arguments: [
                    'string/name',
                    'mixed/value',
                    'mixed/data1',
                    'mixed/data2',
                    'object/contract',
                    'boolean|undefined/erase',
                    'object|undefined/parameters'
                ],
                returns: 'mixed'
            },
            /**
             * Interpret a value from a contract.
             *
             * @param {string} name The name of the data.
             * @param {mixed} value The value.
             * @param {object} contract The contract the data should respect.
             * @param {object|null} parameters The additional parameters used for the resolving.
             * @return {mixed} The interpreted value.
             */
            interpret: {
                arguments: [
                    'string/name',
                    'mixed/value',
                    'object/contract',
                    'object|undefined/parameters'
                ],
                returns: 'mixed'
            }
        },
        getters: {
            /**
             * Order of execution.
             *
             * @return {number}
             */
            order: 'number'
        },
        setters: {
            /**
             * Data resolver.
             *
             * @param {danf:manipulation.dataResolver}
             */
            dataResolver: 'danf:manipulation.dataResolver'
        }
    },
    map: {
        methods: {
            /**
             * Set an item.
             *
             * @param {string|number} key The key.
             * @param {mixed} value The value.
             */
            set: {
                arguments: ['string|number/key', 'mixed/value']
            },
            /**
             * Unset an item.
             *
             * @param {string|number} key The key.
             */
            unset: {
                arguments: ['string|number/key']
            },
            /**
             * Clear all items.
             */
            clear: {
                arguments: []
            },
            /**
             * Whether or not a key exists.
             *
             * @param {string|number} key The key.
             * @return {boolean} True if the key exists, false otherwise.
             */
            has: {
                arguments: ['string|number/key'],
                returns: 'boolean'
            },
            /**
             * Get an item.
             *
             * @param {string|number} key The key.
             * @return {mixed} The value.
             * @throw {error} If the key does not exist.
             */
            get: {
                arguments: ['string|number/key'],
                returns: 'mixed'
            },
            /**
             * Get all the items.
             *
             * @return {object} The items.
             */
            getAll: {
                returns: 'object'
            }
        }
    },
    registry: {
        methods: {
            /**
             * Register an item.
             *
             * @param {string} name The identifier name of the item.
             * @param {mixed} item The item.
             */
            register: {
                arguments: ['string/name', 'mixed/item']
            },
            /**
             * Register a list of items.
             *
             * @param {object} items The list of items.
             */
            registerSet: {
                arguments: ['object/items']
            },
            /**
             * Deregister an item.
             *
             * @param {string} name The identifier name of the item.
             */
            deregister: {
                arguments: ['string/name']
            },
            /**
             * Deregister all items.
             */
            deregisterAll: {
                arguments: []
            },
            /**
             * Whether or not an item has been registered.
             *
             * @param {string} name The identifier name of the item.
             * @return {boolean} True if the item has been registered, false otherwise.
             */
            has: {
                arguments: ['string/name'],
                returns: 'boolean'
            },
            /**
             * Get a registered item from its name.
             *
             * @param {string} name The identifier name of the item.
             * @return {mixed} The item.
             * @throw {error} If the item is not registered.
             */
            get: {
                arguments: ['string/name'],
                returns: 'mixed'
            },
            /**
             * Get all the items.
             *
             * @return {object} The items.
             */
            getAll: {
                returns: 'object'
            }
        }
    },
    notifierRegistry: {
        extends: 'danf:manipulation.registry',
        methods: {
            /**
             * Add an observer notified on each change.
             *
             * @param {danf:manipulation.registryObserver} observer The observer.
             */
            addObserver: {
                arguments: ['danf:manipulation.registryObserver/observer']
            },
            /**
             * Remove an observer.
             *
             * @param {danf:manipulation.registryObserver} observer The observer.
             */
            removeObserver: {
                arguments: ['danf:manipulation.registryObserver/observer']
            },
            /**
             * Remove all observers.
             */
            removeAllObservers: {
                arguments: []
            }
        }
    },
    registryObserver: {
        methods: {
            /**
             * Handle a change coming from a registry.
             *
             * @param {object} items The items.
             * @param {boolean} reset Whether or not it is a reset.
             * @param {string} name The name of the registry.
             */
            handleRegistryChange: {
                arguments: [
                    'object/items',
                    'boolean/reset',
                    'string/name'
                ]
            }
        }
    },
    callbackExecutor: {
        methods: {
            /**
             * Execute a callback.
             *
             * @param {function} callback The callback.
             * @param {mixed} argN The N-th argument to pass to the callback.
             * @return {mixed} The return of the callback.
             */
            execute: {
                arguments: ['function/callback', 'mixed.../argN']
            }
        }
    },
    proxyExecutor: {
        methods: {
            /**
             * Execute a method of an object.
             *
             * @param {object} object The object.
             * @param {string} method The method.
             * @param {mixed} argN The N-th argument to pass to the method.
             */
            execute: {
                arguments: ['object/object', 'string/method', 'mixed.../argN']
            },
            /**
             * Execute an asynchronous method of an object.
             *
             * @param {object} object The object.
             * @param {string} method The method.
             * @param {string|null} scope The stream scope.
             * @param {mixed} argN The N-th argument to pass to the method.
             */
            executeAsync: {
                arguments: ['object/object', 'string/method', 'string|null/scope', 'mixed.../argN']
            }
        }
    },
    flow: {
        methods: {
            /**
             * Wait for a task to execute.
             *
             * @return {number} The id of the task.
             */
            wait: {
                arguments: [],
                returns: 'number'
            },
            /**
             * End a task.
             *
             * @param {number} task The id of the task.
             * @param {error|null} error The optional error.
             * @param {mixed|undefined} returnedValue The optional value returned by the task.
             */
            end: {
                arguments: [
                    'number/task',
                    'error|null/error',
                    'mixed|undefined/returnedValue'
                ]
            },
            /**
             * Add a tributary and set the context as this tributary.
             *
             * @param {string|null} scope The optional scope.
             * @param {function|null} catch The optional function allowing to catch the errors.
             * @param {function|null} format The optional function allowing to format the result.
             * @param {function|null} callback The optional final callback.
             * @return {number} The id of the tributary.
             */
            addTributary: {
                arguments: [
                    'string|number|null/scope',
                    'function|null/catch',
                    'function|null/format',
                    'function|null/callback'
                ],
                returns: 'number'
            },
            /**
             * Set an already added tributary as context.
             *
             * @param {number} tributary The id of the tributary.
             */
            setTributary: {
                arguments: ['number/tributary']
            },
            /**
             * Merge tributary and set the context as its parent if the current
             * one was the merged tributary.
             *
             * @param {number} tributary The id of the tributary.
             */
            mergeTributary: {
                arguments: ['number/tributary']
            },
            /**
             * Retrieve a tributary embedded level.
             *
             * @param {number} tributary The id of the tributary.
             * @return {number} The embedded level.
             */
            getTributaryLevel: {
                arguments: ['number/tributary'],
                returns: 'number'
            }
        },
        getters: {
            /**
             * Unique identifier.
             *
             * @return {string}
             */
            id: 'string',
            /**
             * Context of execution.
             *
             * @return {danf:manipulation.map}
             */
            context: 'danf:manipulation.map',
            /**
             * Stream.
             *
             * @return {object}
             */
            stream: 'object',
            /**
             * Current stream.
             *
             * @return {object}
             */
            currentStream: 'object',
            /**
             * Parent stream of the current one.
             *
             * @return {object}
             */
            parentStream: 'object',
            /**
             * Current tributary.
             *
             * @return {string}
             */
            currentTributary: 'number',
            /**
             * Tributary count.
             *
             * @return {string}
             */
            tributaryCount: 'number',
            /**
             * Embedded level of the current tributary.
             *
             * @return {string}
             */
            currentLevel: 'number',
            /**
             * Whether or not the current tributary errored.
             *
             * @return {boolean}
             */
            errored: 'boolean',
            /**
             * The current tributary errors.
             *
             * @return {error_array}
             */
            errors: 'error_array'
        },
        setters: {
            /**
             * Current stream.
             *
             * @param {object}
             */
            currentStream: 'object'
        }
    },
    flowDriver: {
        methods: {
            /**
             * Proxy to async collections method each.
             * (https://github.com/caolan/async#each)
             */
            each: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method eachSeries.
             * (https://github.com/caolan/async#eachSeries)
             */
            eachSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method eachLimit.
             * (https://github.com/caolan/async#eachLimit)
             */
            eachLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method each.
             * (https://github.com/caolan/forEachOf#each)
             */
            forEachOf: {
                arguments: ['array|object/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method eachSeries.
             * (https://github.com/caolan/async#forEachOfSeries)
             */
            forEachOfSeries: {
                arguments: ['array|object/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method forEachOfLimit.
             * (https://github.com/caolan/async#eachLimit)
             */
            forEachOfLimit: {
                arguments: ['array|object/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method map.
             * (https://github.com/caolan/async#map)
             */
            map: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method mapSeries.
             * (https://github.com/caolan/async#mapSeries)
             */
            mapSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method mapLimit.
             * (https://github.com/caolan/async#mapLimit)
             */
            mapLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method filter.
             * (https://github.com/caolan/async#filter)
             */
            filter: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method filterSeries.
             * (https://github.com/caolan/async#filter)
             */
            filterSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method filterLimit.
             * (https://github.com/caolan/async#filter)
             */
            filterLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method reject.
             * (https://github.com/caolan/async#reject)
             */
            reject: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method rejectSeries.
             * (https://github.com/caolan/async#reject)
             */
            rejectSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method rejectLimit.
             * (https://github.com/caolan/async#reject)
             */
            rejectLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method reduce.
             * (https://github.com/caolan/async#reduce)
             */
            reduce: {
                arguments: ['array/arr', 'mixed/memo', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method reduceRight.
             * (https://github.com/caolan/async#reduceRight)
             */
            reduceRight: {
                arguments: ['array/arr', 'mixed/memo', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method detect.
             * (https://github.com/caolan/async#detect)
             */
            detect: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method detectSeries.
             * (https://github.com/caolan/async#detect)
             */
            detectSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method detectLimit.
             * (https://github.com/caolan/async#detect)
             */
            detectLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method some.
             * (https://github.com/caolan/async#some)
             */
            some: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method someLimit.
             * (https://github.com/caolan/async#some)
             */
            someLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method every.
             * (https://github.com/caolan/async#every)
             */
            every: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method everyLimit.
             * (https://github.com/caolan/async#every)
             */
            everyLimit: {
                arguments: ['array/arr', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method concat.
             * (https://github.com/caolan/async#concat)
             */
            concat: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async collections method concatSeries.
             * (https://github.com/caolan/async#concatSeries)
             */
            concatSeries: {
                arguments: ['array/arr', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async control flow method series.
             * (https://github.com/caolan/async#series)
             */
            series: {
                arguments: ['function_array|function_object/tasks', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method parallel.
             * (https://github.com/caolan/async#parallel)
             */
            parallel: {
                arguments: ['function_array|function_object/tasks', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method parallelLimit.
             * (https://github.com/caolan/async#parallel)
             */
            parallelLimit: {
                arguments: ['function_array|function_object/tasks', 'number/limit', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method whilst.
             * (https://github.com/caolan/async#whilst)
             */
            whilst: {
                arguments: ['function/test', 'function/fn', 'function/callback']
            },
            /**
             * Proxy to async control flow method doWhilst.
             * (https://github.com/caolan/async#doWhilst)
             */
            doWhilst: {
                arguments: ['function/fn', 'function/test', 'function/callback']
            },
            /**
             * Proxy to async control flow method until.
             * (https://github.com/caolan/async#until)
             */
            until: {
                arguments: ['function/test', 'function/fn', 'function/callback']
            },
            /**
             * Proxy to async control flow method doUntil.
             * (https://github.com/caolan/async#doUntil)
             */
            doUntil: {
                arguments: ['function/fn', 'function/test', 'function/callback']
            },
            /**
             * Proxy to async control flow method during.
             * (https://github.com/caolan/async#during)
             */
            during: {
                arguments: ['function/test', 'function/fn', 'function/callback']
            },
            /**
             * Proxy to async control flow method doDuring.
             * (https://github.com/caolan/async#doDuring)
             */
            doDuring: {
                arguments: ['function/fn', 'function/test', 'function/callback']
            },
            /**
             * Proxy to async control flow method forever.
             * (https://github.com/caolan/async#forever)
             */
            forever: {
                arguments: ['function/fn', 'function/errback']
            },
            /**
             * Proxy to async control flow method waterfall.
             * (https://github.com/caolan/async#waterfall)
             */
            waterfall: {
                arguments: ['function_array|function_object/tasks', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method compose.
             * (https://github.com/caolan/async#compose)
             */
            compose: {
                arguments: ['function.../fnN'],
                returns: 'function'
            },
            /**
             * Proxy to async control flow method seq.
             * (https://github.com/caolan/async#seq)
             */
            seq: {
                arguments: ['function.../fnN'],
                returns: 'function'
            },
            /**
             * Proxy to async control flow method applyEach.
             * (https://github.com/caolan/async#applyEach)
             */
            applyEach: {
                arguments: ['function_array|function_object/fns', 'mixed...|function/args|callback', 'function/callback']
            },
            /**
             * Proxy to async control flow method applyEachSeries.
             * (https://github.com/caolan/async#applyEach)
             */
            applyEachSeries: {
                arguments: ['function_array|function_object/fns', 'mixed...|function/args|callback', 'function/callback']
            },
            /**
             * Proxy to async control flow method queue.
             * (https://github.com/caolan/async#queue)
             */
            queue: {
                arguments: ['function/worker', 'concurrency/number'],
                returns: 'object'
            },
            /**
             * Proxy to async control flow method priorityQueue.
             * (https://github.com/caolan/async#priorityQueue)
             */
            priorityQueue: {
                arguments: ['function/worker', 'concurrency/number']
            },
            /**
             * Proxy to async control flow method cargo.
             * (https://github.com/caolan/async#cargo)
             */
            cargo: {
                arguments: ['function/worker', 'concurrency|null/payload'],
                returns: 'object'
            },
            /**
             * Proxy to async control flow method auto.
             * (https://github.com/caolan/async#auto)
             */
            auto: {
                arguments: ['function_array|function_object/tasks', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method retry.
             * (https://github.com/caolan/async#retry)
             */
            retry: {
                arguments: ['number|function/times|task', 'function|null/task|callback', 'function|null/callback']
            },
            /**
             * Proxy to async control flow method iterator.
             * (https://github.com/caolan/async#iterator)
             */
            iterator: {
                arguments: ['function_array|function_object/tasks'],
                returns: 'function'
            },
            /**
             * Proxy to async control flow method times.
             * (https://github.com/caolan/async#times)
             */
            times: {
                arguments: ['number/n', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async control flow method timesSeries.
             * (https://github.com/caolan/async#times)
             */
            timesSeries: {
                arguments: ['number/n', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async control flow method timesLimit.
             * (https://github.com/caolan/async#times)
             */
            timesLimit: {
                arguments: ['number/n', 'number/limit', 'function/iterator', 'function/callback']
            },
            /**
             * Proxy to async control flow method apply.
             * (https://github.com/caolan/async#apply)
             */
            apply: {
                arguments: ['function/fn', 'mixed...|null/args'],
                returns: 'function'
            },
            /**
             * Proxy to async control flow method nextTick.
             * (https://github.com/caolan/async#nextTick)
             */
            nextTick: {
                arguments: ['function/callback']
            },
            /**
             * Proxy to async utils method memoize.
             * (https://github.com/caolan/async#memoize)
             */
            memoize: {
                arguments: ['function/fn', 'function|null/hasher'],
                returns: 'function'
            },
            /**
             * Proxy to async utils method unmemoize.
             * (https://github.com/caolan/async#unmemoize)
             */
            unmemoize: {
                arguments: ['function/fn', 'function|null/hasher']
            },
            /**
             * Proxy to async utils method ensureAsync.
             * (https://github.com/caolan/async#ensureAsync)
             */
            ensureAsync: {
                arguments: ['function/fn'],
                returns: 'function'
            },
            /**
             * Proxy to async utils method constant.
             * (https://github.com/caolan/async#constant)
             */
            constant: {
                arguments: ['mixed...|null/values'],
                returns: 'mixed'
            },
            /**
             * Proxy to async utils method asyncify.
             * (https://github.com/caolan/async#asyncifyfunc)
             */
            asyncify: {
                arguments: ['function/fn'],
                returns: 'function'
            },
            /**
             * Proxy to async utils method asyncify.
             * (https://github.com/caolan/async#asyncifyfunc)
             */
            wrapSync: {
                arguments: ['function/fn'],
                returns: 'function'
            },
            /**
             * Proxy to async utils method log.
             * (https://github.com/caolan/async#log)
             */
            log: {
                arguments: ['function/fn', 'mixed...|null/args']
            },
            /**
             * Proxy to async utils method dir.
             * (https://github.com/caolan/async#dir)
             */
            dir: {
                arguments: ['function/fn', 'mixed...|null/args']
            }
        }
    },
    asynchronousCallback: {
        methods: {
            /**
             * Adapt asynchronous callback execution.
             *
             * @param {function} callback The callback.
             * @param {error} error The optional error.
             * @param {mixed} result The result.
             */
            execute: {
                arguments: ['function/callback', 'error|null/error', 'mixed/result']
            },
            /**
             * Adapt asynchronous callback.
             *
             * @param {function} callback The callback.
             * @return {function} The adapted callback.
             */
            wrap: {
                arguments: ['function/callback'],
                returns: 'function'
            }
        }
    },
    asynchronousInput: {
        methods: {
            /**
             * Format the input of a collection.
             *
             * @param {mixed} input The input.
             * @return {mixed} The formatted input.
             */
            format: {
                arguments: ['mixed/input'],
                returns: 'mixed'
            }
        }
    },
    asynchronousIterator: {
        methods: {
            /**
             * Adapt asynchronous iterator.
             *
             * @param {function} iterator The iterator.
             * @return {function} The adapted iterator.
             */
            wrap: {
                arguments: ['function/iterator'],
                returns: 'function'
            }
        }
    },
    asynchronousCollection: {
        methods: {
            /**
             * Format the input of a collection.
             *
             * @param {mixed} input The input.
             * @return {mixed} The formatted input.
             */
            formatInput: {
                arguments: ['mixed/input'],
                returns: 'mixed'
            },
            /**
             * Adapt asynchronous iterator.
             *
             * @param {function} iterator The iterator.
             * @return {function} The adapted iterator.
             */
            wrapIterator: {
                arguments: ['function/iterator'],
                returns: 'function'
            },
            /**
             * Adapt asynchronous callback execution.
             *
             * @param {function} callback The callback.
             * @param {error} error The optional error.
             * @param {mixed} result The result.
             */
            executeIteratorCallback: {
                arguments: ['function/callback', 'error|null/error', 'mixed/result']
            },
            /**
             * Adapt asynchronous callback.
             *
             * @param {function} callback The callback.
             * @return {function} The adapted callback.
             */
            wrapCallback: {
                arguments: ['function/callback'],
                returns: 'function'
            }
        },
        getters: {
            /**
             * Async method name.
             *
             * @return {string}
             */
            method: 'string',
            /**
             * Optional alias name.
             *
             * @return {string|null}
             */
            alias: 'string|null',
            /**
             * Parameters.
             *
             * @return {object}
             */
            parameters: 'object'
        }
    }
};
