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
        function (kodiLoki) {
            var _this = this;

            _this.db = new kodiLoki('kodi');
            _this.request = _this.db.addCollection('request', ['id', 'hash']);
            _this.response = _this.db.addCollection('response', ['id']);
            _this.album = _this.db.addCollection('album', ['id']);
            _this.artist = _this.db.addCollection('artist', ['id']);
            _this.episode = _this.db.addCollection('episode', ['id']);
            _this.movie = _this.db.addCollection('movie', ['id']);
            _this.season = _this.db.addCollection('season', ['id']);
            _this.song = _this.db.addCollection('song', ['id']);
            _this.tvshow = _this.db.addCollection('tvshow', ['id']);

            return _this;
        }
    ]);