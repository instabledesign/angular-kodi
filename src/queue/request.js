'use strict';

/**
 * Angular kodi module
 * @url https://github.com/instabledesign/angular-kodi
 */
angular.module('kodi')
/**
 * Angular $kodiRequestQueue provider
 *
 * Provide request queue system
 */
    .provider('$kodiRequestQueue', [
        function () {

            var _this = this;
            var queue = [];
            var inProcess = false;
            var queueId;

            // TODO implement queue parallel process and request lifetime
            //_this.requestParallel = 2;
            //_this.requestInProcessLifeTime = 30;// in second
            //_this.requestProcessedLifeTime = 300;// in second

            _this.$get = [
                function () {
                    _this.add = function (request) {
                        queue.push(request);
                    };

                    _this.process = function (id) {
                        if (true == inProcess && queueId != id) {
                            return;
                        }

                        if (queue.length == 0) {
                            inProcess = false;
                            return;
                        }

                        inProcess = true;
                        queueId = Math.floor(Math.random() * 1000000);
                        queue[0].process();
                        queue.splice(0, 1);

                        _this.process(queueId);
                    };

                    return this;
                }
            ];
        }
    ]);
