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
    .service('kodiServeurService', ['kodiServeur', 'kodiServeurSchema',
        function (kodiServeur, kodiServeurSchema) {
            var _this = this;

            _this.hydrateFormResponse = function (response) {
                return new kodiServeur(
                    new kodiServeurSchema(response.result)
                );
            };

            return _this;
        }
    ]);
