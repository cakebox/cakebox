(function() {
    'use strict';

    angular
        .module('cakebox')
        .controller('PlayCtrl', PlayCtrl);

    /** ngInject */
    function PlayCtrl($scope, $routeParams, $translate, File, Betaseries, BACKEND_URL) {

        $translate(['NOTIFICATIONS.BETASERIES_ERROR']).then(function (translations) {
            $scope.betaseries_error = translations['NOTIFICATIONS.BETASERIES_ERROR'];
        });

        $scope.bsConfig = Betaseries.getConfig();

        File
            .get({'path': $routeParams.path}).$promise
            .then(function(data) {
                $scope.file = data;

                if ($scope.bsConfig.apikey) {
                    $scope.betaseries = Betaseries.get({'filename': data.name});
                }
            });

        $scope.watched = function (event, id) {
            if ($scope.bsConfig.apikey && $scope.bsConfig.login && $scope.bsConfig.passwd) {
                $scope.betaseries = Betaseries.setWatched({'id': id});
            } else {
                alertify.log($scope.betaseries_error, 'error', 6000);
            }
        };

        $scope.unwatched = function (event, id) {
            if ($scope.bsConfig.apikey && $scope.bsConfig.login && $scope.bsConfig.passwd) {
                $scope.betaseries = Betaseries.setUnwatched({'id': id});
            } else {
                alertify.log($scope.betaseries_error, 'error', 6000);
            }
        };

        $scope.getDownloadLink = function() {
            return BACKEND_URL + '/files/download?path=' + $routeParams.path;
        };
    }

})();
