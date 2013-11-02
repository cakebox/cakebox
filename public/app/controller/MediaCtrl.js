app.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $http.get('/api/player/settings').success(function(data) {
            $scope.player = data;
        });

        $http.get('/api/files/info/' + $routeParams.path).success(function(data) {
            $scope.fileinfo = data;

            $http.get("/api/betaseries/info/" + data.name).success(function(data){
                $scope.betaseries = data;
                console.log(data);
            });
        });

        $scope.watched = function (event, id) {

            $http.post('/api/betaseries/watched/' + id).success(function(data) {

                if (!data.errors)
                    $(event.target).text("Épisode vu !");
                else
                    $(event.target).text("Error with BetaSeries API !");
            });
        }
    }
]);
