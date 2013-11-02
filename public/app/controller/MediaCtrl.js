app.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $http.get('/api/player/settings').success(function(data) {
            $scope.player = data;
        });

        $http.get('/api/files/info/' + $routeParams.path).success(function(data) {

            $scope.fileinfo = data;

            $http.get("/api/betaseries/info/" + data.name).success(function(data) {

                if (data.errors && data.errors.length == 0) {
                    $scope.betaseries = data;
                }
                else {
                    angular.forEach(data.errors, function(value, key) {
                        console.error("BetaSeries: " + value.text);
                    });
                }
            });
        });

        $scope.watched = function (event, id) {

            $http.post('/api/betaseries/watched/' + id).success(function(data) {

                if (data.errors && data.errors.length == 0) {
                    $(event.target).text("Épisode vu !");
                }
                else {
                    angular.forEach(data.errors, function(value, key) {
                        console.error("BetaSeries: " + value.text);
                    });
                }
            });
        }
    }
]);
