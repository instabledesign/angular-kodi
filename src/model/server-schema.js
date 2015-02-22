'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiServerSchema factory
 *
 * provide kodiServerSchema model
 */
    .factory('kodiServerSchema', [
        function () {

            function kodiServerSchema(schema) {
                if (!(this instanceof kodiServerSchema)) throw 'You must instanciate with "new" operator';
                if (!schema.methods || !schema.notifications || !schema.types) throw 'Invalid schema';

                var schemaTypes = angular.copy(schema.types);
                var _this = this;

                _this.rawSchema = schema;
                _this.methods = angular.copy(schema.methods);
                _this.notifications = angular.copy(schema.notifications);
                _this.types = {};

                /**
                 * Extend deep object with another
                 *
                 * @param target
                 * @param object
                 */
                var extend = function (target, object) {
                    for (var key in object) {
                        if (!target.hasOwnProperty(key)) {
                            target[key] = object[key];
                        }
                        else if (typeof target[key] == 'object' && typeof object[key] == 'object') {
                            extend(target[key], object[key]);
                        }
                    }
                };

                /**
                 * Resolve a schema type
                 *
                 * @param typeName
                 * @param ancestorType
                 *
                 * @returns Object
                 */
                var resolveType = function (typeName, ancestorType) {
                    if (_this.types.hasOwnProperty(typeName)) return _this.types[typeName];
                    if (!schemaTypes.hasOwnProperty(typeName)) throw 'Type "' + typeName + '" not found in schema.types';

                    // Prevent circular references
                    if (ancestorType == undefined) ancestorType = {};
                    if (ancestorType.hasOwnProperty(typeName)) {
                        //console.info('Circular reference type %o with %o', typeName, ancestorType);
                        return ancestorType[typeName];
                    }

                    var type = schemaTypes[typeName];

                    ancestorType[typeName] = type;
                    resolveRef(type, typeName, ancestorType);
                    resolveExtend(type);

                    _this.types[typeName] = type;

                    return type;
                };

                /**
                 * Resolve deep "$ref" reference
                 *
                 * @param object       Object to scan for "$ref"
                 * @param typeName     The ancestor typeName to solve circular reference
                 * @param ancestorType The ancestor stack type to solve circular reference
                 *
                 * @returns Object
                 */
                var resolveRef = function (object, typeName, ancestorType) {
                    for (var key in object) {
                        if (typeof object[key] == 'object' && object[key] !== null) {
                            resolveRef(object[key], typeName, ancestorType);
                        }

                        if (key == '$ref') {
                            extend(object, resolveType(object[key], ancestorType));
                            delete object[key];
                        }
                    }
                };

                /**
                 * Resolve the "extends" references
                 *
                 * @param type
                 */
                var resolveExtend = function (type) {
                    if (type.hasOwnProperty('extends')) {
                        var parentTypes = type.extends;
                        if (typeof parentTypes == 'object') {
                            for (var typeName in parentTypes) {
                                if (!schema.types.hasOwnProperty(parentTypes[typeName])) throw 'Type "' + parentTypes[typeName] + '" not found in schema.types';
                                extend(type, parentTypes[typeName]);
                            }
                        }
                        else {
                            if (!schema.types.hasOwnProperty(parentTypes)) throw 'Type "' + parentTypes + '" not found in schema.types';
                            extend(type, schema.types[parentTypes]);
                        }
                        delete type.extends;
                    }
                };

                /**
                 * Resolve schemaType
                 */
                for (var typeName in schemaTypes) {
                    if (!_this.types.hasOwnProperty(typeName)) {
                        resolveType(typeName);
                    }
                }

                return _this;
            }

            kodiServerSchema.prototype.getTypeFields = function(name) {
                if (!this.types.hasOwnProperty(name)) throw 'Type "' + name + '" was not found';

                var type = this.types[name];
                var enums;

                if (type.hasOwnProperty('enums')) {
                    return type.enums;
                }

                if (type.hasOwnProperty('items') && type.items.hasOwnProperty('enums')) {
                    return type.items.enums;
                }

                throw 'No value found in "' + name + '"';
            };

            return kodiServerSchema;
        }
    ]);
