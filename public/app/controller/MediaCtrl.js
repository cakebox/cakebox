app.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $http.get('/api/player/settings')
            .success(function(data, status, headers, config) {
                $scope.player = data;
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/players/settings");
            });

        $http.get('/api/files/info/' + $routeParams.path)
            .success(function(data, status, headers, config) {

                $scope.fileinfo = data;

                $http.get("/api/betaseries/info/" + data.name)
                    .success(function(data, status, headers, config) {

                        if (data.errors && data.errors.length == 0) {
                            $scope.betaseries = data;
                        }
                        else {
                            angular.forEach(data.errors, function(value, key) {
                                console.error("BetaSeries: " + value.text);
                            });
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.error("Cakebox: API is unreachable on /api/betaseries/info/");
                    });
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/files/info/");
            });

        $scope.watched = function (event, id) {

            $http.post('/api/betaseries/watched/' + id)
                .success(function(data, status, headers, config) {

                    if (data.errors && data.errors.length == 0) {
                        $(event.target).text("Épisode vu !");
                    }
                    else {
                        angular.forEach(data.errors, function(value, key) {
                            console.error("BetaSeries: " + value.text);
                        });
                    }
                })
                .error(function(data, status, headers, config) {
                    console.error("Cakebox: API is unreachable on /api/betaseries/watched/");
                });
        }
    }
]);
