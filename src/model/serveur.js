'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServeur factory
 *
 * provide kodiServeur model
 *
 * @require kodiRequestService Request service
 */
    .factory('kodiServeur', ['kodiRequestService',
        function (kodiRequestService) {

            function kodiServeur(schema) {
                if (!(this instanceof kodiServeur)) throw 'You must instanciate with "new" operator';
                if (
                    !schema.methods ||
                    !schema.notifications ||
                    !schema.types
                ) {
                    throw 'Invalid schema';
                }

                var _this = this;

                _this.schema = schema;

                // Method introspection
                angular.forEach(
                    _this.schema.methods,
                    function (methodProperties, method) {
                        var methodFrag = method.split('.');
                        _this[methodFrag[0]] = _this[methodFrag[0]] || {};
                        _this[methodFrag[0]][methodFrag[1]] = function (params, options) {
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
                    },
                    _this
                );

                //Notification introspection
                //angular.forEach(
                //    _this.schema.notifications,
                //    function (notificationsProperties, notification) {
                //        var _this = this;
                //        var notificationFrag = notification.split('.');
                //        _this[notificationFrag[0]] = _this[notificationFrag[0]] || {};
                //        _this[notificationFrag[0]][notificationFrag[1]] = _this[notificationFrag[0]][notificationFrag[1]] || (function (notification) {
                //            return function (callback) {
                //                $rootScope.$on('websocket.' + notification, function (event, data) {
                //                    callback(data.params);
                //                });
                //            };
                //        })(notification);
                //    },
                //    _this
                //);

                return _this;
            }

            return kodiServeur;
        }
    ]);
