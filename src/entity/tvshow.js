'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiTvShow factory
 *
 * provide kodiTvShow entity
 */
    .factory('kodiTvShow', [
        function () {
            function kodiTvShow() {
                if (!(this instanceof kodiTvShow)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._genres = {};
                _this._seasons = {};
                _this._episodes = {};

                return _this;
            }

            return kodiTvShow;
        }
    ]);