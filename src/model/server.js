'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServer factory
 *
 * provide kodiServer model
 *
 * @require kodiRequestService Request service
 */
    .factory('kodiServer', ['kodiServerSchema', 'kodiRequestService',
        function (kodiServerSchema, kodiRequestService) {

            function kodiServer(schema) {
                if (!(this instanceof kodiServer)) throw 'You must instanciate with "new" operator';
                if (!schema instanceof kodiServerSchema) throw 'Schema must be a "kodiServerSchema"';

                var _this = this;

                _this.schema = schema;

                /**
                 * Create proxy methods object from schema
                 */
                for (var method in _this.schema.methods) {
                    var methodFrag = method.split('.');
                    if (!_this.hasOwnProperty(methodFrag[0])) {
                        _this[methodFrag[0]] = {};
                    }

                    if (_this[methodFrag[0]].hasOwnProperty(methodFrag[1])) throw '"' + method + '" already exist.';

                    _this[methodFrag[0]][methodFrag[1]] = (function (method) {
                        return function (params, options) {
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
                    })(method);
                }

                /**
                 * Create proxy notifications from schema
                 */
                for (var notification in _this.schema.notifications) {
                    var notificationFrag = notification.split('.');
                    if (!_this.hasOwnProperty(notificationFrag[0])) {
                        _this[notificationFrag[0]] = {};
                    }

                    if (_this[notificationFrag[0]].hasOwnProperty(notificationFrag[1])) throw '"' + notification + '" already exist.';

                    _this[notificationFrag[0]][notificationFrag[1]] = (function (notification) {
                        // TODO Create and handle notification
                        return function (callback) {
                            $rootScope.$on('kodi.' + notification, function (event, data) {
                                callback(data);
                            });
                        }
                    })(notification);
                }

                return _this;
            }

            return kodiServer;
        }
    ]);
