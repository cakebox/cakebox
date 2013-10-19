cakeboxCtrl.controller('MediaCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $scope.mediaPath = $routeParams.path;
}]);
