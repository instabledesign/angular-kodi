'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServerService
 *
 * Provide server service method
 */
    .service('kodiServerService', ['kodiServer', 'kodiServerSchema',
        function (kodiServer, kodiServerSchema) {

            var _this = this;

            _this.hydrateFromResponse = function (response) {
                return new kodiServer(
                    new kodiServerSchema(response.result)
                );
            };

            return _this;
        }
    ]);
