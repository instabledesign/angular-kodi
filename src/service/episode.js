'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular kodiEpisodeService
 *
 * Provide episode service method
 */
    .service('kodiEpisodeService', ['kodiEpisode', 'kodiCache',
        function (kodiEpisode, kodiCache) {

            var _this = this;
            var cache = kodiCache.getEpisode();

            /**
             * Hydrate a kodiEpisode or an array of kodiEpisode
             *
             * @param response
             *
             * @returns DynamicView
             */
            _this.hydrateFormResponse = function (response) {
                var responseView = cache.addDynamicView();
                var result = responseView.applyFind({'_response': {'$in': response.id.toString()}});

                if (response.result.hasOwnProperty('episodes')) {
                    var episodes = response.result.episodes;

                    for (var i in episodes) {
                        var episode = _this.updateOrCreate(episodes[i].episodeid, episodes[i]);
                        if (episode._response.indexOf(response.id) == -1) {
                            episode._response.push(response.id);
                        }
                    }
                }

                if (response.result.hasOwnProperty('episodedetails')) {
                    var episode = _this.updateOrCreate(response.result.episodedetails.episodeid, response.result.episodedetails);
                    if (episode._response.indexOf(response.id) == -1) {
                        episode._response.push(response.id);
                    }
                }

                return result;
            };

            /**
             * Create a episode or update from cache
             *
             * @param episodeId
             * @param data
             *
             * @returns kodiEpisode
             */
            _this.updateOrCreate = function (episodeId, data) {
                var episode = cache.get(episodeId);

                if (episode) {
                    _this.update(episode, data);
                }
                else {
                    episode = _this.create(data);
                    cache.insert(episode);
                }

                return episode;
            };

            /**
             * Create and hydrate episode
             *
             * @param data
             *
             * @return kodiEpisode
             */
            _this.create = function (data) {
                var episode = new kodiEpisode();

                if (data) {
                    _this.hydrate(episode, data);
                }
                episode._response = [];

                return episode;
            };

            /**
             * Hydrate a episode
             *
             * @param episode
             * @param data
             *
             * @return kodiEpisode
             */
            _this.hydrate = function (episode, data) {
                if (!episode instanceof kodiEpisode) throw '"episode" must be an instance of "kodiEpisode"';
                if (!data.hasOwnProperty('episodeid')) throw '"data" must have a episodeid';

                _this.update(episode, data);

                return episode;
            };

            /**
             * Update a episode
             *
             * @param episode
             * @param data
             *
             * @return kodiEpisode
             */
            _this.update = function (episode, data) {
                if (!episode instanceof kodiEpisode) throw '"episode" must be an instance of "kodiEpisode"';

                angular.extend(episode, data);

                return episode;
            };

            return _this;
        }
    ]);
