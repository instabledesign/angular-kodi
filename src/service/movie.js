'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiMovieService
 *
 * Provide movie service method
 */
    .service('kodiMovieService', ['kodiMovie', 'kodiCache',
        function (kodiMovie, kodiCache) {

            var _this = this;
            var cache = kodiCache.getMovie();

            /**
             * Hydrate a kodiMovie or an array of kodiMovie
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {

                if (response.result.hasOwnProperty('movies')) {
                    var movies = response.result.movies;

                    for (var i in movies) {
                        var movie = _this.updateOrCreate(movies[i].movieid, movies[i]);
                        if (movie._response.indexOf(response.id) == -1) {
                            movie._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('moviedetails')) {
                    var movie = _this.updateOrCreate(response.result.moviedetails.movieid, response.result.moviedetails);
                    if (movie._response.indexOf(response.id) == -1) {
                        movie._response.push(response.id);
                    }
                }

                return cache
                    .addDynamicView()
                    .applyFind(
                        {'_response': {'$contains': response.id}}
                    );
            };

            /**
             * Create a movie or update from cache
             *
             * @param movieId
             * @param data
             *
             * @returns kodiMovie
             */
            _this.updateOrCreate = function (movieId, data) {
                var movie = cache.findOne({'movieid': movieId});

                if (movie) {
                    _this.update(movie, data);
                }
                else {
                    movie = _this.create(data);
                    cache.insert(movie);
                }

                return movie;
            };

            /**
             * Create and hydrate movie
             *
             * @param data
             *
             * @return kodiMovie
             */
            _this.create = function (data) {
                var movie = new kodiMovie();

                if (data) {
                    _this.hydrate(movie, data);
                }
                movie._response = [];

                return movie;
            };

            /**
             * Hydrate a movie
             *
             * @param movie
             * @param data
             *
             * @return kodiMovie
             */
            _this.hydrate = function (movie, data) {
                if (!movie instanceof kodiMovie) throw '"movie" must be an instance of "kodiMovie"';
                if (!data.hasOwnProperty('movieid')) throw '"data" must have a movieid';

                _this.update(movie, data);

                return movie;
            };

            /**
             * Update a movie
             *
             * @param movie
             * @param data
             *
             * @return kodiMovie
             */
            _this.update = function (movie, data) {
                if (!movie instanceof kodiMovie) throw '"movie" must be an instance of "kodiMovie"';

                angular.extend(movie, data);

                return movie;
            };

            return _this;
        }
    ]);
