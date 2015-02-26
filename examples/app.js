var app = angular.module('app', ['kodi', 'ngRoute'])
    .config(function($routeProvider, $websocketProvider) {
        $websocketProvider.path = 'ws://localhost:9090';

        $routeProvider
            .when(
                '/simple',
                {
                    controller: 'SimpleCtrl',
                    templateUrl: 'simple.html'
                }
            )
            .when(
                '/movies',
                {
                    controller: 'MovieCtrl',
                    templateUrl: 'movies.html'
                }
            )
            .otherwise({redirectTo:'/simple'});
    })
    .controller('SimpleCtrl', function (kodiCore, $scope) {
        kodiCore.onReady(function (kodiServer) {
            kodiServer.JSONRPC.Version().then(
                function (data) {
                    $scope.version = data.version;
                }
            );

            kodiServer.System.GetProperties({properties: kodiServer.getFields('System.Property.Name')}).then(
                function (system) {
                    $scope.system = system;
                }
            );
        });
    })
    .controller('MovieCtrl', function (kodiCore, kodiCache, $scope) {
        kodiCore.onReady(function (kodiServer) {
            console.log(kodiServer.getServerSchema());
            kodiServer.VideoLibrary.GetMovies({
                properties: kodiServer.getFields('Video.Fields.Movie'),
                limits: {end: 3}
            }).then(
                function (firstMovieSelection) {
                    $scope.firstMovieSelection = firstMovieSelection;
                }
            );

            kodiServer.VideoLibrary.GetMovies({
                properties: kodiServer.getFields('Video.Fields.Movie'),
                limits: {start: 3, end: 6}
            }).then(
                function (secondMovieSelection) {
                    $scope.secondMovieSelection = secondMovieSelection;
                }
            );

            $scope.movies = kodiCache.getMovie();
        });
        $scope.sortBy = function(collection, field){
            collection = collection.applySimpleSort(field);
        };
    });

