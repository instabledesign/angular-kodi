'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiRequestCache service
 *
 * provide a request cache indexed by "request.id" and "request.md5"
 *
 * @require $cacheFactory Angular cache factory
 */
    .factory('kodiRequestCache', ['$cacheFactory',
        function($cacheFactory) {
            return {
                byId: $cacheFactory('kodiRequestByIdCache'),
                byHash: $cacheFactory('kodiRequestByHashCache')
            };
        }
    ]);