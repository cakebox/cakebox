cakeboxCtrl.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $scope.mediaPath = '/access/' + $routeParams.path;

        /*
        $http.get('/api/file/' + $routeParams.path).success(function(data) {
            $scope.fileInfo = data;
        });
		*/
}]);
