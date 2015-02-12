'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiArtist factory
 *
 * provide kodiArtist entity
 */
    .factory('kodiArtist', [,
        function () {

            function kodiArtist() {
                if (!(this instanceof kodiArtist)) throw 'You must instanciate with "new" operator';
                var _this = this;

                _this._id;
                _this._songs = {};
                _this._albums = {};

                return _this;
            }

            return kodiArtist;
        }
    ]);
