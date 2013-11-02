app.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $http.get('/api/player/settings').success(function(data) {
            $scope.player = data;
        });

        $http.get('/api/files/info/' + $routeParams.path).success(function(data) {
            $scope.fileinfo = data;
        });

        $scope.watched = function (e, showname) {

            $http.post('/api/betaseries/watched/' + showname).success(function(data) {

                if (data != "false")
                    $(e.target).text("Épisode vu !");
                else
                    $(e.target).text("Error with BetaSeries API !");
            });
        }
    }
]);
