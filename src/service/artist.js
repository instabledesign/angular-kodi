'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiArtistService
 *
 * Provide artist service method
 */
    .service('kodiArtistService', ['kodiArtist', 'kodiCache',
        function (kodiArtist, kodiCache) {
            var _this = this;

            _this.artistCache = kodiCache.artist;

            /**
             * Hydrate a kodiArtist or an array of kodiArtist
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {
                var responseView = _this.artistCache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('artists')) {
                    var artists = response.result.artists;

                    for (var i in artists) {
                        var artist = _this.updateOrCreate(artists[i].artistid, artists[i]);
                        if (artist._response.indexOf(response.id) == -1) {
                            artist._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('artistdetails')) {
                    var artist = _this.updateOrCreate(response.result.artistdetails.artistid, response.result.artistdetails);
                    if (artist._response.indexOf(response.id) == -1) {
                        artist._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a artist or update from cache
             *
             * @param artistId
             * @param data
             *
             * @returns kodiArtist
             */
            _this.updateOrCreate = function (artistId, data) {
                var artist = _this.artistCache.get(artistId);

                if (artist) {
                    _this.update(artist, data);
                }
                else {
                    artist = _this.create(data);
                    _this.artistCache.insert(artist);
                }

                return artist;
            };

            /**
             * Create and hydrate artist
             *
             * @param data
             *
             * @return kodiArtist
             */
            _this.create = function (data) {
                var artist = new kodiArtist();

                if (data) {
                    _this.hydrate(artist, data);
                }
                artist._response = [];

                return artist;
            };

            /**
             * Hydrate a artist
             *
             * @param artist
             * @param data
             *
             * @return kodiArtist
             */
            _this.hydrate = function (artist, data) {
                if (!artist instanceof kodiArtist) throw '"artist" must be an instance of "kodiArtist"';
                if (!data.hasOwnProperty('artistid')) throw '"data" must have a artistid';

                _this.update(artist, data);

                return artist;
            };

            /**
             * Update a artist
             *
             * @param artist
             * @param data
             *
             * @return kodiArtist
             */
            _this.update = function (artist, data) {
                if (!artist instanceof kodiArtist) throw '"artist" must be an instance of "kodiArtist"';

                angular.extend(artist, data);

                return artist;
            };

            return _this;
        }
    ]);
