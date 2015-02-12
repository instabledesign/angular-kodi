'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServeurService
 *
 * Provide serveur service method
 */
    .service('kodiServeurService', ['kodiServeur',
        function (kodiServeur) {
            var _this = this;

            _this.hydrateFormResponse = function (response) {
                // TODO refacto The creation and hydratation with the KodiServeurService
                return new kodiServeur(response.result);
            };

            return _this;
        }
    ]);
