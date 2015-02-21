'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiRequestCache service
 *
 * provide a cache
 */
    .service('kodiCache', ['kodiLoki',
        function(kodiLoki) {
            var _this = this;

            _this.db = new kodiLoki('kodi');
            _this.request = _this.db.addCollection('request', ['id', 'hash']);
            _this.response = _this.db.addCollection('response', ['id']);
            _this.movie = _this.db.addCollection('movie', ['id']);

            return _this;
        }
    ]);