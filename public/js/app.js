var app = angular.module('cakebox', []);

app.controller('MainCtrl', function($scope, $http, $location) {

	$scope.currentPath = "";
	$scope.location = $location;

	$scope.$watch("location.path()", function(path) {

		$scope.currentPath = path;
		$http.get('/api/directories' + $scope.currentPath).success(function(data) {
			scope.dirs = data;
		});
	})
});
