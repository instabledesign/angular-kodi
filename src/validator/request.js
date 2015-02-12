'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiRequestValidator
 *
 * Provide connexion service method
 */
    .service('kodiRequestValidator', [
        function () {
            this.validate = function (request) {
                // TODO implement request validation
                // TODO move to kodiRequestService ???
                return true;
            }
        }
    ]);
