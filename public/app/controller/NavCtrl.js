app.controller('NavCtrl', function($scope, $location) {
    $scope.currentPage = "";

    $scope.$on('$routeChangeSuccess', function(event, current) {
        $scope.currentPage = $location.path().slice(1).split('/')[0];
    });
});
