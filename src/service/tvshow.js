'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiTvShowService
 *
 * Provide TV show service method
 */
    .service('kodiTvShowService', ['kodiTvShow', 'kodiCache',
        function (kodiTvShow, kodiCache) {

            var _this = this;
            var cache = kodiCache.getTvShow();

            /**
             * Hydrate a kodiTvShow or an array of kodiTvShow
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {
                var responseView = cache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('tvShows')) {
                    var tvShows = response.result.tvShows;

                    for (var i in tvShows) {
                        var tvShow = _this.updateOrCreate(tvShows[i].tvShowid, tvShows[i]);
                        if (tvShow._response.indexOf(response.id) == -1) {
                            tvShow._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('tvShowdetails')) {
                    var tvShow = _this.updateOrCreate(response.result.tvShowdetails.tvShowid, response.result.tvShowdetails);
                    if (tvShow._response.indexOf(response.id) == -1) {
                        tvShow._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a tvShow or update from cache
             *
             * @param tvShowId
             * @param data
             *
             * @returns kodiTvShow
             */
            _this.updateOrCreate = function (tvShowId, data) {
                var tvShow = cache.get(tvShowId);

                if (tvShow) {
                    _this.update(tvShow, data);
                }
                else {
                    tvShow = _this.create(data);
                    cache.insert(tvShow);
                }

                return tvShow;
            };

            /**
             * Create and hydrate tvShow
             *
             * @param data
             *
             * @return kodiTvShow
             */
            _this.create = function (data) {
                var tvShow = new kodiTvShow();

                if (data) {
                    _this.hydrate(tvShow, data);
                }
                tvShow._response = [];

                return tvShow;
            };

            /**
             * Hydrate a tvShow
             *
             * @param tvShow
             * @param data
             *
             * @return kodiTvShow
             */
            _this.hydrate = function (tvShow, data) {
                if (!tvShow instanceof kodiTvShow) throw '"tvShow" must be an instance of "kodiTvShow"';
                if (!data.hasOwnProperty('tvShowid')) throw '"data" must have a tvShowid';

                _this.update(tvShow, data);

                return tvShow;
            };

            /**
             * Update a tvShow
             *
             * @param tvShow
             * @param data
             *
             * @return kodiTvShow
             */
            _this.update = function (tvShow, data) {
                if (!tvShow instanceof kodiTvShow) throw '"tvShow" must be an instance of "kodiTvShow"';

                angular.extend(tvShow, data);

                return tvShow;
            };

            return _this;
        }
    ]);
