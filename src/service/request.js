'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiRequestService
 *
 * Provide request service method
 */
    .service('kodiRequestService', ['$q', 'kodiRequest', 'kodiRequestValidator', 'kodiCache', '$kodiRequestQueue', 'kodiConnexionService',
        function ($q, kodiRequest, kodiRequestValidator, kodiCache, $kodiRequestQueue, kodiConnexionService) {

            var _this = this;
            var requestId = 1;
            var cache = kodiCache.getRequest();

            /**
             * Create and initialize request
             *
             * @param attributes
             * @param options
             *
             * @returns kodiRequest
             */
            _this.create = function (attributes, options) {
                var request = new kodiRequest(requestId++, attributes, options);

                _this.addStateMachine(request);

                // Initialise the request workflow
                request.create();

                return request;
            };

            /**
             * Handle a kodiRequest
             *
             * @param request
             *
             * @returns promise
             */
            _this.handle = function (request) {
                if (!request instanceof kodiRequest) throw 'Invalid argument. "kodiRequest" expected';

                // Asynchronous to have the really first notification
                setTimeout(function () {
                    request.resolveFromCache();

                    if (request.current !== 'resolvedFromCache') {
                        request.validate();
                        request.pendingProcessing();
                        $kodiRequestQueue.process();
                    }
                }, 0);

                return request.defer.promise;
            };

            /**
             * Create and handle request shortcut
             *
             * @param attributes
             * @param options
             *
             * @returns promise
             */
            _this.createAndHandle = function (attributes, options) {
                return _this.handle(
                    _this.create(attributes, options)
                )
            };

            /**
             * Resolve request with a response
             *
             * @param response
             */
            _this.resolveWith = function (response) {
                var request = cache.get(response.id);
                if (!request) throw 'No request was found for response id "' + response.id + '"';

                request.success(response);
            };

            /**
             * Kodi request state machine
             *
             * @param request
             */
            _this.addStateMachine = function (request) {
                if (!request instanceof kodiRequest) throw 'Invalid argument. "kodiRequest" expected';

                StateMachine.create({
                    target:    request,
                    events:    [
                        {
                            name: 'create',
                            from: 'none',
                            to:   'created'
                        },
                        {
                            name: 'resolveFromCache',
                            from: 'created',
                            to:   'resolvedFromCache'
                        },
                        {
                            name: 'validate',
                            from: 'created',
                            to:   'validated'
                        },
                        {
                            name: 'pendingProcessing',
                            from: ['created', 'validated'],
                            to:   'pendingProcess'
                        },
                        {
                            name: 'process',
                            from: 'pendingProcess',
                            to:   'inProcess'
                        },
                        {
                            name: 'success',
                            from: 'inProcess',
                            to:   'processed'
                        },
                        {
                            name: 'fail',
                            from: ['create', 'inProcess'],
                            to:   'failed'
                        }
                    ],
                    callbacks: {
                        /*
                         * Global statemachine handlers
                         */
                        onbeforeevent:             function (event, from, to, message) {
                            this.defer.notify(event);
                        },
                        onafterevent:              function (event, from, to, message) {
                            this[event + 'At'] = new Date().getTime();
                            this.defer.notify(this.current);
                        },
                        error:                     function (event, from, to, args, errorCode, errorMessage) {
                            if (this.defer) {
                                this.defer.reject(event);
                            }
                        },
                        /*
                         * Event statemachine handlers
                         */
                        onbeforecreate:            function () {
                            this.defer = $q.defer();
                            cache.insert(this);
                        },
                        onbeforeresolveFromCache: function () {
                            if (this.getOption('cache') == true) {
                                var _this = this;
                                var resultSet = cache.findOne({'$and':[{'hash': _this.hash}, {'id': {'$ne': _this.id}}]});

                                if (resultSet !== null) {
                                    var cachedRequest = resultSet[0];
                                    cachedRequest.defer.promise.then(
                                        function() {
                                            _this.response = cachedRequest.response;
                                            _this.defer.resolve(
                                                _this.getOption('raw') === true ?
                                                    _this.response.result :
                                                    _this.response.data
                                            );
                                        },
                                        function (error) {
                                            _this.defer.reject(error);
                                        },
                                        function (notify) {
                                            _ths.defer.notify(notify);
                                        }
                                    );

                                    return true;
                                }
                            }

                            return false;
                        },
                        onbeforevalidate:          function () {
                            if (this.getOption('validate') == false) {
                                this.defer.notify('Validation skipped by option');

                                return false;
                            }

                            // TODO implement validation
                            this.defer.notify('Validation comming soon');
                            return false;
                        },
                        onvalidate:                function (event) {
                            try {
                                return kodiRequestValidator.validate(this);
                            }
                            catch (e) {
                                this.defer.reject(event);

                                return false;
                            }
                        },
                        onbeforependingProcessing: function () {
                            if (this.getOption('queue') == false) {
                                this.defer.notify('Don\'t wait the queue by option');
                                this.process();

                                return false;
                            }
                        },
                        onpendingProcessing:       function () {
                            $kodiRequestQueue.add(this, false);
                        },
                        onprocess:                 function () {
                            kodiConnexionService.send(this.toJson());
                        },
                        onsuccess:                 function (event, from, to, response) {
                            this.response = response;
                            this.defer.resolve(
                                this.getOption('raw') === true ?
                                    this.response.result :
                                    this.response.data
                            );
                        },
                        onfail:                    function (event, from, to, data) {
                            this.defer.reject(data);
                        }
                    }
                });
            };
        }
    ]);
