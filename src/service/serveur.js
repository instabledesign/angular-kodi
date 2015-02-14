'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServeurService
 *
 * Provide serveur service method
 */
    .service('kodiServeurService', ['kodiServeur', 'kodiRequestService',
        function (kodiServeur, kodiRequestService) {
            var _this = this;

            _this.hydrateFormResponse = function (response) {
                var serveur = new kodiServeur(response.result);

                extend(serveur, _this.getMethodsFromSchema(serveur.schema));
                extend(serveur, _this.getNotificationsFromSchema(serveur.schema));

                return serveur;
            };

            /**
             * Create proxy methods object from schema
             *
             * @param schema
             *
             * @returns Object
             */
            _this.getMethodsFromSchema = function (schema) {
                if (!schema.hasOwnProperty('methods')) throw 'Schema must have a "methods" property';

                var methods = {};
                for (var method in schema.methods) {
                    var methodFrag = method.split('.');
                    if (!methods.hasOwnProperty(methodFrag[0])) {
                        methods[methodFrag[0]] = {};
                    }

                    if (methods[methodFrag[0]].hasOwnProperty(methodFrag[1])) throw '"' + method + '" already exist.';

                    methods[methodFrag[0]][methodFrag[1]] = (function (method){
                        return function (params, options) {
                            kodiRequestService.handle(
                                kodiRequestService.create(
                                    {
                                        method: method,
                                        params: params
                                    },
                                    options
                                )
                            );
                        };
                    })(methods);
                }

                return methods;
            };

            /**
             * Create proxy notifications from schema
             *
             * @param schema
             * @returns Object
             */
            _this.getNotificationsFromSchema = function (schema) {
                if (!schema.hasOwnProperty('notifications')) throw 'Schema must have a "notifications" property';

                var notifications = {};
                for (var notification in schema.notifications) {
                    var notificationFrag = notification.split('.');
                    if (!notifications.hasOwnProperty(notificationFrag[0])) {
                        notifications[notificationFrag[0]] = {};
                    }

                    if (notifications[notificationFrag[0]].hasOwnProperty(notificationFrag[1])) throw '"' + notification + '" already exist.';

                    notifications[notificationFrag[0]][notificationFrag[1]] = (function (notification) {
                        // TODO Create and handle notification
                        return function (callback) {
                            $rootScope.$on('kodi.' + notification, function (event, data) {
                                callback(data);
                            });
                        }
                    })(notification);
                }

                return notifications;
            };

            /**
             * Extend object recursively
             *
             * @param target
             * @param object
             */
            var extend = function (target, object) {
                for (var key in object) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = object[key];
                    }
                    else if (typeof target[key] == 'object' && typeof object[key] == 'object') {
                        extend(target[key], object[key]);
                    }
                }
            };

            return _this;
        }
    ]);
