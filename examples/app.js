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
    .controller('MovieCtrl', function (kodiCore, $scope) {
        kodiCore.onReady(function (kodiServer) {
            kodiServer.VideoLibrary.GetMovies({properties: kodiServer.getFields('Video.Fields.Movie')}).then(
                function (movies) {
                    $scope.movies = movies;
                }
            );
        });
        $scope.sortBy = function(field){
            $scope.movies = $scope.movies.applySimpleSort(field);
        };
    });

