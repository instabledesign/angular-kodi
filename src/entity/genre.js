'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiGenre factory
 *
 * provide kodiGenre entity
 */
    .factory('kodiGenre', [
        function () {

            function kodiGenre() {
                if (!(this instanceof kodiGenre)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._songs = {};
                _this._albums = {};
                _this._movies = {};
                _this._artists = {};
                _this._tvshows = {};

                return _this;
            }

            return kodiGenre;
        }
    ]);
