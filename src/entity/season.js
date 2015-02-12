'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiSeason factory
 *
 * provide kodiSeason entity
 */
    .factory('kodiSeason', [
        function () {

            function kodiSeason() {
                if (!(this instanceof kodiSeason)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._tvshow;
                _this._episodes = {};

                return _this;
            }

            return kodiSeason;
        }
    ]);
