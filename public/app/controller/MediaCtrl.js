app.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $http.get('/api/files/info/' + $routeParams.path).success(function(data) {
            $scope.fileinfo = data;
        });

        $http.get('/api/player/settings').success(function(data) {
            $scope.player = data;
        });
    }
]);
