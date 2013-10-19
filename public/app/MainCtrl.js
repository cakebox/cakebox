var cakeboxCtrl = angular.module('cakeboxCtrl', []);

cakeboxCtrl.controller('MainCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.currentPath = "";
        $scope.location = $location;
        $scope.breadcrumbs = [];

        $scope.$watch("location.path()", function(path) {

            $scope.currentPath = path;
            $http.get('/api/directories' + $scope.currentPath).success(function(data) {
                $scope.dirs = data;
            });

            // Parse breadcrumbs
            var pathElements = path.split('/'), result = [], i;
            var breadcrumbPath = function (index) {
                return '/' + (pathElements.slice(0, index + 1)).join('/');
            };
            result.push({name: ".", path: "."});
            pathElements.shift();
            for (i=0; i<pathElements.length; i++) {
                result.push({name: pathElements[i], path: breadcrumbPath(i)});
            }

            $scope.breadcrumbs = result;
	   });
}]);
