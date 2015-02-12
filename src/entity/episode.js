'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiEpisode factory
 *
 * provide kodiEpisode entity
 */
    .factory('kodiEpisode', [,
        function () {

            function kodiEpisode() {
                if (!(this instanceof kodiEpisode)) throw 'You must instanciate with "new" operator';
                var _this = this;

                _this._id;
                _this._tvshow = {};
                _this._season = {};

                return _this;
            }

            return kodiEpisode;
        }
    ]);
