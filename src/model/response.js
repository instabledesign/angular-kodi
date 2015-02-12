'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiResponse factory
 *
 * provide kodiResponse model
 */
    .factory('kodiResponse', [
        function () {

            function kodiResponse(attributes) {
                if (!(this instanceof kodiResponse)) throw 'You must instanciate with "new" operator';
                angular.extend(this, attributes);

                return this;
            }

            kodiResponse.prototype.toJson = function () {
                return JSON.stringify({
                    id     : this.id,
                    jsonrpc: this.jsonrpc,
                    result : this.result
                });
            };

            return kodiResponse;
        }
    ]);
