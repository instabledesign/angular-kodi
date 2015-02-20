'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiConnexionService
 *
 * Provide connexion service method
 */
    .service('kodiConnexionService', ['$rootScope', '$websocket',
        function ($rootScope, $websocket) {

            var _this = this;

            _this.onOpen = null;
            _this.onClose = null;
            _this.onMessage = null;
            _this.onError = null;

            /**
             * Send transport data
             *
             * @param data
             */
            _this.send = function (data) {
                $rootScope.$emit('kodi.send', data);
                $websocket.send(data);
            };

            /**
             * When the websocket is connected
             */
            $rootScope.$on('websocket.open', function (event, originalEvent) {
                $rootScope.$emit('kodi.open', originalEvent);
                if (angular.isFunction(_this.onOpen)) {
                    _this.onOpen.call(null, originalEvent);
                }
            });

            /**
             * When the websocket close
             */
            $rootScope.$on('websocket.close', function (event, originalEvent) {
                $rootScope.$emit('kodi.close', originalEvent);
                if (angular.isFunction(_this.onClose)) {
                    _this.onClose.call(null, originalEvent);
                }
            });

            /**
             * When the websocket get a message
             */
            $rootScope.$on('websocket.message', function (event, originalEvent) {
                if (!originalEvent.hasOwnProperty('data')) {
                    throw 'No data field found';
                }

                $rootScope.$emit('kodi.message', originalEvent.data);
                if (angular.isFunction(_this.onMessage)) {
                    _this.onMessage.call(null, originalEvent.data);
                }
            });

            /**
             * When the websocket get an error
             */
            $rootScope.$on('websocket.error', function (event, originalEvent) {
                $rootScope.$emit('kodi.error', originalEvent);
                if (angular.isFunction(_this.onError)) {
                    _this.onError.call(null, originalEvent);
                }
            });
        }
    ]);
