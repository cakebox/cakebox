app.controller('BrowseCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs',
    function($scope, $http, $routeParams, breadcrumbs) {

        $scope.getDone = false;
        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;

        $scope.$watch('location.path()', function(event, current) {

            if ($routeParams.path != "")
                $scope.currentPath += $routeParams.path + "/";

            $http.get('/api/directories/content/' + $scope.currentPath)
                .success(function(data, status, headers, config) {
                    $scope.dirs = data;
                    $scope.getDone = true;
                })
                .error(function(data, status, headers, config) {
                    console.error("Cakebox: API is unreachable on /api/directories/content/");
                });
        });
    }
]);
