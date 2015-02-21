'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiPlayer factory
 *
 * provide kodiPlayer entity
 */
    .factory('kodiPlayer', [
        function () {
            function kodiPlayer() {
                if (!(this instanceof kodiPlayer)) throw 'You must instanciate with "new" operator';

                var _this = this;

                _this._id;
                _this._item = {};
                _this.interval;

                return _this;
            }

            return kodiPlayer;
        }
    ]);
