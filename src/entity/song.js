'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiSong factory
 *
 * provide kodiSong entity
 */
    .factory('kodiSong', [
        function () {

            function kodiSong() {
                if (!(this instanceof kodiSong)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._artist;
                _this._album = {};
                _this._genres = {};

                return _this;
            }

            return kodiSong;
        }
    ]);
