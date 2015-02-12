'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiAlbum factory
 *
 * provide kodiAlbum entity
 */
    .factory('kodiAlbum', [,
        function () {

            function kodiAlbum() {
                if (!(this instanceof kodiAlbum)) throw 'You must instanciate with "new" operator';
                var _this = this;

                _this._id;
                _this._songs = {};
                _this._genres = {};
                _this._artists = {};

                return _this;
            }

            return kodiAlbum;
        }
    ]);
