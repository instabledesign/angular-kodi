'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiMovie factory
 *
 * provide kodiMovie entity
 */
    .factory('kodiMovie', [
        function () {
            function kodiMovie() {
                if (!(this instanceof kodiMovie)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._genres = {};

                return _this;
            }

            return kodiMovie;
        }
    ]);
