'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiSongService
 *
 * Provide song service method
 */
    .service('kodiSongService', ['kodiSong', 'kodiCache',
        function (kodiSong, kodiCache) {

            var _this = this;
            var cache = kodiCache.getSong();

            /**
             * Hydrate a kodiSong or an array of kodiSong
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {
                var responseView = cache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('songs')) {
                    var songs = response.result.songs;

                    for (var i in songs) {
                        var song = _this.updateOrCreate(songs[i].songid, songs[i]);
                        if (song._response.indexOf(response.id) == -1) {
                            song._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('songdetails')) {
                    var song = _this.updateOrCreate(response.result.songdetails.songid, response.result.songdetails);
                    if (song._response.indexOf(response.id) == -1) {
                        song._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a song or update from cache
             *
             * @param songId
             * @param data
             *
             * @returns kodiSong
             */
            _this.updateOrCreate = function (songId, data) {
                var song = cache.get(songId);

                if (song) {
                    _this.update(song, data);
                }
                else {
                    song = _this.create(data);
                    cache.insert(song);
                }

                return song;
            };

            /**
             * Create and hydrate song
             *
             * @param data
             *
             * @return kodiSong
             */
            _this.create = function (data) {
                var song = new kodiSong();

                if (data) {
                    _this.hydrate(song, data);
                }
                song._response = [];

                return song;
            };

            /**
             * Hydrate a song
             *
             * @param song
             * @param data
             *
             * @return kodiSong
             */
            _this.hydrate = function (song, data) {
                if (!song instanceof kodiSong) throw '"song" must be an instance of "kodiSong"';
                if (!data.hasOwnProperty('songid')) throw '"data" must have a songid';

                _this.update(song, data);

                return song;
            };

            /**
             * Update a song
             *
             * @param song
             * @param data
             *
             * @return kodiSong
             */
            _this.update = function (song, data) {
                if (!song instanceof kodiSong) throw '"song" must be an instance of "kodiSong"';

                angular.extend(song, data);

                return song;
            };

            return _this;
        }
    ]);
