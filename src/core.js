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

            _this.isReady = false;
            _this.kodiServeur = {};

            /**
             * When the introspect request was done
             *
             * @param callback Provide a kodiServeur object
             */
            _this.onReady = function (callback) {
                if (!_this.isReady) {
                    $rootScope.$on('kodi.ready', function(){
                        callback.call(null, _this.kodiServeur);
                    });
                }
                else {
                    callback.call(null, _this.kodiServeur);
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
                return kodiRequestService.handle(
                    kodiRequestService.create(
                        {
                            method: method,
                            params: params
                        },
                        options
                    )
                );
            };

            /**
             * Get kodiServeur from the JSONRPC.Introspect result
             * and trigger event "kodi.ready" with a kodiServeur object
             */
            $rootScope.$on('kodi.open', function () {
                _this.request('JSONRPC.Introspect', null, {'validate': false, 'hydrate': false}).then(
                    function (kodiServeur) {
                        _this.kodiServeur = kodiServeur;
                        _this.isReady = true;
                        $rootScope.$emit('kodi.ready', _this.kodiServeur);
                    },
                    function(){
                        console.error('FATAL ERROR');
                    }
                );
            });

            /**
             * Handle and handle kodi response/notification
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
