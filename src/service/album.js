'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiAlbumService
 *
 * Provide album service method
 */
    .service('kodiAlbumService', ['KodiAlbum', 'kodiCache',
        function (kodiAlbum, kodiCache) {
            var _this = this;

            _this.albumCache = kodiCache.album;

            /**
             * Hydrate a kodiAlbum or an array of kodiAlbum
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {
                var responseView = _this.albumCache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('albums')) {
                    var albums = response.result.albums;

                    for (var i in albums) {
                        var album = _this.updateOrCreate(albums[i].albumid, albums[i]);
                        if (album._response.indexOf(response.id) == -1) {
                            album._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('albumdetails')) {
                    var album = _this.updateOrCreate(response.result.albumdetails.albumid, response.result.albumdetails);
                    if (album._response.indexOf(response.id) == -1) {
                        album._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a album or update from cache
             *
             * @param albumId
             * @param data
             *
             * @returns kodiAlbum
             */
            _this.updateOrCreate = function (albumId, data) {
                var album = _this.albumCache.get(albumId);

                if (album) {
                    _this.update(album, data);
                }
                else {
                    album = _this.create(data);
                    _this.albumCache.insert(album);
                }

                return album;
            };

            /**
             * Create and hydrate album
             *
             * @param data
             *
             * @return kodiAlbum
             */
            _this.create = function (data) {
                var album = new kodiAlbum();

                if (data) {
                    _this.hydrate(album, data);
                }
                album._response = [];

                return album;
            };

            /**
             * Hydrate a album
             *
             * @param album
             * @param data
             *
             * @return kodiAlbum
             */
            _this.hydrate = function (album, data) {
                if (!album instanceof kodiAlbum) throw '"album" must be an instance of "kodiAlbum"';
                if (!data.hasOwnProperty('albumid')) throw '"data" must have a albumid';

                _this.update(album, data);

                return album;
            };

            /**
             * Update a album
             *
             * @param album
             * @param data
             *
             * @return kodiAlbum
             */
            _this.update = function (album, data) {
                if (!album instanceof kodiAlbum) throw '"album" must be an instance of "kodiAlbum"';

                angular.extend(album, data);

                return album;
            };

            return _this;
        }
    ]);
