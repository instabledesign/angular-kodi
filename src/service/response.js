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
    .service('kodiResponseService', ['$q', 'md5', 'kodiResponse', 'kodiRequestCache', 'kodiServeurService', 'kodiAlbumService', 'kodiArtistService', 'kodiEpisodeService', 'kodiGenreService', 'kodiMovieService', 'kodiPlayerService', 'kodiSeasonService', 'kodiSongService', 'kodiTvShowService',
        function ($q, md5, kodiResponse, kodiRequestCache, kodiServeurService, kodiAlbumService, kodiArtistService, kodiEpisodeService, kodiGenreService, kodiMovieService, kodiPlayerService, kodiSeasonService, kodiSongService, kodiTvShowService) {

            var _this = this;

            var getRequestById = function(response) {
                var request = kodiRequestCache.byId.get(response.id);

                if (!request) throw 'No request was found for response id "' + response.id + '"';

                return request;
            };

            _this.create = function (attributes) {
                return new kodiResponse(attributes);
            };

            /**
             * Handle response
             * @param response
             */
            _this.handle = function (response) {
                if (!response instanceof kodiResponse) throw 'Invalid argument. "kodiResponse" expected';

                var request = getRequestById(response);

                request.defer.notify('Get response');

                var objectService = _this.guess(response);

                var responseObject = objectService.hydrateFormResponse(response);

                request.success(responseObject);
            };

            /**
             * Return object manager
             *
             * @param response
             *
             * @returns {*}
             */
            _this.guess = function (response) {
                if (!response instanceof kodiResponse) throw 'Invalid argument. "kodiResponse" expected';

                switch (true) {
                    case response.result.hasOwnProperty('methods'):
                    case response.result.hasOwnProperty('notifications'):
                    case response.result.hasOwnProperty('types'):
                        return kodiServeurService;
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
