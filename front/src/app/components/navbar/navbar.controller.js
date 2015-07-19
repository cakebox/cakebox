(function() {
    'use strict';

    angular.module('cakebox')
    .controller('NavbarCtrl', function ($scope, $location) {

        $scope.currentPage = '';

        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };

        $scope.$on('$routeChangeSuccess', function() {
            $scope.currentPage = $location.path().slice(1).split('/')[0];
        });
    });

})();
