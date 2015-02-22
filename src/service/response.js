'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiResponseService
 *
 * Provide response service method
 */
    .service('kodiResponseService', ['kodiResponse', 'kodiCache', 'kodiServerService', 'kodiAlbumService', 'kodiArtistService', 'kodiEpisodeService', 'kodiGenreService', 'kodiMovieService', 'kodiPlayerService', 'kodiSeasonService', 'kodiSongService', 'kodiTvShowService',
        function (kodiResponse, kodiCache, kodiServerService, kodiAlbumService, kodiArtistService, kodiEpisodeService, kodiGenreService, kodiMovieService, kodiPlayerService, kodiSeasonService, kodiSongService, kodiTvShowService) {

            var _this = this;
            var cache = kodiCache.getResponse();

            /**
             * Create and hydrate a kodiResponse
             *
             * @param attributes
             * @returns kodiResponse
             */
            _this.create = function (attributes) {
                var response = new kodiResponse(attributes);

                var objectService = _this.guess(response);
                response.data = objectService.hydrateFormResponse(response);

                cache.insert(response);

                return response;
            };

            /**
             * Return object manager
             *
             * @param response
             *
             * @returns Object
             */
            _this.guess = function (response) {
                if (!response instanceof kodiResponse) throw 'Invalid argument. "kodiResponse" expected';

                switch (true) {
                    case response.result.hasOwnProperty('methods'):
                    case response.result.hasOwnProperty('notifications'):
                    case response.result.hasOwnProperty('types'):
                        return kodiServerService;
                        break;

                    case response.result.hasOwnProperty('player'):
                    case response.result.hasOwnProperty('playerdetails'):
                        return kodiAlbumService;
                        break;

                    case response.result.hasOwnProperty('albums'):
                    case response.result.hasOwnProperty('albumdetails'):
                        return kodiAlbumService;
                        break;

                    case response.result.hasOwnProperty('artists'):
                    case response.result.hasOwnProperty('artistdetails'):
                        return kodiArtistsService;
                        break;

                    case response.result.hasOwnProperty('episodes'):
                    case response.result.hasOwnProperty('episodedetails'):
                        return kodiEpisodeService;
                        break;

                    case response.result.hasOwnProperty('genres'):
                    case response.result.hasOwnProperty('genredetails'):
                        return kodiGenreService;
                        break;

                    case response.result.hasOwnProperty('movies'):
                    case response.result.hasOwnProperty('moviedetails'):
                        return kodiMovieService;
                        break;

                    case response.result.hasOwnProperty('seasons'):
                    case response.result.hasOwnProperty('seasondetails'):
                        return kodiSeasonService;
                        break;

                    case response.result.hasOwnProperty('songs'):
                    case response.result.hasOwnProperty('songdetails'):
                        return kodiSongService;
                        break;

                    case response.result.hasOwnProperty('tvshows'):
                    case response.result.hasOwnProperty('tvshowdetails'):
                        return kodiTvShowService;
                        break;
                }
            };
        }
    ]);
