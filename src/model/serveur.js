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
    .factory('kodiServeur', [
        function () {

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

                return _this;
            }

            return kodiServeur;
        }
    ]);
