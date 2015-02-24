'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiLoki factory
 *
 * provide loki model
 */
    .factory('kodiLoki', ['$window',
        function ($window) {
            return $window.loki;
        }
    ]);
