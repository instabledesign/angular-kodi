'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiRequest factory
 *
 * provide kodiRequest model
 *
 * @require JSONRPC_VERSION Json rpc version
 */
    .constant('JSONRPC_VERSION', '2.0')
    .factory('kodiRequest', ['JSONRPC_VERSION',
        function (JSONRPC_VERSION) {

            function kodiRequest(id, attributes, options) {
                if (!(this instanceof kodiRequest)) throw 'You must instanciate with "new" operator';
                this.id = id;
                this.jsonrpc = JSONRPC_VERSION;
                this.method;
                this.params;
                this.options = {
                    cache   : true,
                    validate: true
                };

                angular.extend(this, attributes);
                angular.extend(this.options, options);

                return this;
            }

            kodiRequest.prototype.toJson = function () {
                return JSON.stringify({
                    id     : this.id,
                    jsonrpc: this.jsonrpc,
                    method : this.method,
                    params : this.params || undefined
                });
            };

            kodiRequest.prototype.getOption = function (name, defaultValue) {
                return this.options.hasOwnProperty(name) ? this.options[name] : defaultValue || null;
            };

            return kodiRequest;
        }
    ]);
