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
    .service('kodiMovieService', ['kodiMovie',
        function (kodiMovie) {
            var _this = this;

            _this.hydrateFormResponse = function (response) {
                return response;
                // TODO create and return an hydrated kodiMovie
                //return new kodiMovie();
            };

            return _this;
        }
    ]);
