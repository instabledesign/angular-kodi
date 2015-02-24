'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiSeasonService
 *
 * Provide season service method
 */
    .service('kodiSeasonService', ['kodiSeason', 'kodiCache',
        function (kodiSeason, kodiCache) {

            var _this = this;
            var cache = kodiCache.getSeason();

            /**
             * Hydrate a kodiSeason or an array of kodiSeason
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFromResponse = function (response) {
                var responseView = cache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('seasons')) {
                    var seasons = response.result.seasons;

                    for (var i in seasons) {
                        var season = _this.updateOrCreate(seasons[i].seasonid, seasons[i]);
                        if (season._response.indexOf(response.id) == -1) {
                            season._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('seasondetails')) {
                    var season = _this.updateOrCreate(response.result.seasondetails.seasonid, response.result.seasondetails);
                    if (season._response.indexOf(response.id) == -1) {
                        season._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a season or update from cache
             *
             * @param seasonId
             * @param data
             *
             * @returns kodiSeason
             */
            _this.updateOrCreate = function (seasonId, data) {
                var season = cache.get(seasonId);

                if (season) {
                    _this.update(season, data);
                }
                else {
                    season = _this.create(data);
                    cache.insert(season);
                }

                return season;
            };

            /**
             * Create and hydrate season
             *
             * @param data
             *
             * @return kodiSeason
             */
            _this.create = function (data) {
                var season = new kodiSeason();

                if (data) {
                    _this.hydrate(season, data);
                }
                season._response = [];

                return season;
            };

            /**
             * Hydrate a season
             *
             * @param season
             * @param data
             *
             * @return kodiSeason
             */
            _this.hydrate = function (season, data) {
                if (!season instanceof kodiSeason) throw '"season" must be an instance of "kodiSeason"';
                if (!data.hasOwnProperty('seasonid')) throw '"data" must have a seasonid';

                _this.update(season, data);

                return season;
            };

            /**
             * Update a season
             *
             * @param season
             * @param data
             *
             * @return kodiSeason
             */
            _this.update = function (season, data) {
                if (!season instanceof kodiSeason) throw '"season" must be an instance of "kodiSeason"';

                angular.extend(season, data);

                return season;
            };

            return _this;
        }
    ]);
