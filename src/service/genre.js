'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiGenreService
 *
 * Provide genre service method
 */
    .service('kodiGenreService', ['kodiGenre', 'kodiCache',
        function (kodiGenre, kodiCache) {

            var _this = this;
            var cache = kodiCache.getGenres();

            /**
             * Hydrate a kodiGenre or an array of kodiGenre
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFromResponse = function (response) {
                var responseView = cache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('genres')) {
                    var genres = response.result.genres;

                    for (var i in genres) {
                        var genre = _this.updateOrCreate(genres[i].genreid, genres[i]);
                        if (genre._response.indexOf(response.id) == -1) {
                            genre._response.push(response.id);
                        }
                    }
                }

                return result;
            };

            /**
             * Create a genre or update from cache
             *
             * @param genreId
             * @param data
             *
             * @returns kodiGenre
             */
            _this.updateOrCreate = function (genreId, data) {
                var genre = cache.get(genreId);

                if (genre) {
                    _this.update(genre, data);
                }
                else {
                    genre = _this.create(data);
                    cache.insert(genre);
                }

                return genre;
            };

            /**
             * Create and hydrate genre
             *
             * @param data
             *
             * @return kodiGenre
             */
            _this.create = function (data) {
                var genre = new kodiGenre();

                if (data) {
                    _this.hydrate(genre, data);
                }
                genre._response = [];

                return genre;
            };

            /**
             * Hydrate a genre
             *
             * @param genre
             * @param data
             *
             * @return kodiGenre
             */
            _this.hydrate = function (genre, data) {
                if (!genre instanceof kodiGenre) throw '"genre" must be an instance of "kodiGenre"';
                if (!data.hasOwnProperty('genreid')) throw '"data" must have a genreid';

                _this.update(genre, data);

                return genre;
            };

            /**
             * Update a genre
             *
             * @param genre
             * @param data
             *
             * @return kodiGenre
             */
            _this.update = function (genre, data) {
                if (!genre instanceof kodiGenre) throw '"genre" must be an instance of "kodiGenre"';

                angular.extend(genre, data);

                return genre;
            };

            return _this;
        }
    ]);
