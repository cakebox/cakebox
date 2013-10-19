cakeboxCtrl.controller('MainCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs',
    function($scope, $http, $routeParams, breadcrumbs) {

    $scope.currentPath = "";
    $scope.breadcrumbs = breadcrumbs;

    if (typeof $routeParams.path == 'undefined')
    {
        $routeParams.path = "";
        $http.get('/api/directories/').success(function(data) {
            $scope.dirs = data;
        });
    }

    $scope.$watch('location.path()', function(event, current) {

        if ($routeParams.path)
            $scope.currentPath += $routeParams.path + '/';

        $http.get('/api/directories/' + $scope.currentPath).success(function(data) {
            $scope.dirs = data;
        });
    });
}]);
