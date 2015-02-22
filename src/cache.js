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

            var db = new kodiLoki('kodi');
            var request = db.addCollection('request', ['id', 'hash']);
            var response = db.addCollection('response', ['id']);
            var album = db.addCollection('album', ['id']);
            var artist = db.addCollection('artist', ['id']);
            var episode = db.addCollection('episode', ['id']);
            var movie = db.addCollection('movie', ['id']);
            var season = db.addCollection('season', ['id']);
            var song = db.addCollection('song', ['id']);
            var tvShow = db.addCollection('tvshow', ['id']);

            _this.getDb = function () {
                return db;
            };

            _this.getRequest = function () {
                return request;
            };

            _this.getResponse = function () {
                return response;
            };

            _this.getAlbum = function () {
                return album;
            };

            _this.getArtist = function () {
                return artist;
            };

            _this.getEpisode = function () {
                return episode;
            };

            _this.getMovie = function () {
                return movie;
            };

            _this.getSeason = function () {
                return season;
            };

            _this.getSong = function () {
                return song;
            };

            _this.getTvShow = function () {
                return tvShow;
            };

            return _this;
        }
    ]);