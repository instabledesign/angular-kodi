'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 *
 * This module provided some powerful utilities to interact with Kodi websocket
 *
 * @require angular-websocket https://github.com/instabledesign/angular-websocket
 * @require angular-md5 https://github.com/gdi2290/angular-md5
 * @require javascript-state-machine https://github.com/jakesgordon/javascript-state-machine
 */
angular.module('kodi', ['websocket', 'angular-md5'])
/**
 * Angular kodiCore service
 *
 * provide a front tool to make all operation/request
 *
 * @require $rootscope          Listen events
 * @require kodiRequestService  Request service
 * @require kodiResponseService Response service
 */
    .service('kodiCore', ['$rootScope', 'kodiRequestService', 'kodiResponseService',
        function ($rootScope, kodiRequestService, kodiResponseService) {
            var _this = this;

            var isReady = false;
            var server = {};

            /**
             * When the introspect request was done
             *
             * @param callback Provide a kodiServer object
             */
            _this.onReady = function (callback) {
                if (!isReady) {
                    $rootScope.$on('kodi.ready', function () {
                        callback.call(null, server);
                    });
                }
                else {
                    callback.call(null, server);
                }
            };

            /**
             * Create and handle request
             *
             * @param method
             * @param params
             * @param options
             *
             * @return $q.defer.promise
             */
            _this.request = function (method, params, options) {
                return kodiRequestService.createAndHandle(
                    {
                        method: method,
                        params: params
                    },
                    options
                );
            };

            /**
             * Listen when transport was ready and request "JSONRPC.Introspect"
             * in order to create and hydrate a kodiServer and emit a "kodi.ready" event
             */
            $rootScope.$on('kodi.open', function () {
                _this.request('JSONRPC.Introspect', null, {'validate': false, 'hydrate': false}).then(
                    function (kodiServer) {
                        server = kodiServer;
                        isReady = true;
                        $rootScope.$emit('kodi.ready', server);
                    },
                    function () {
                        console.error('FATAL ERROR');
                    }
                );
            });

            /**
             * Listen when transport get a message and dispatch to response or notification handler
             */
            $rootScope.$on('kodi.message', function (event, data) {
                var message = JSON.parse(data);

                if (message.hasOwnProperty('id')) {
                    kodiRequestService.resolveWith(
                        kodiResponseService.create(message)
                    );
                }
                else {
                    // TODO create notification
                    // TODO handle notification
                    console.log('Notification %o', message);
                    //kodiNotificationService.handle(
                    //    kodiNotificationService.create(message)
                    //);
                }
            });
        }
    ]);
