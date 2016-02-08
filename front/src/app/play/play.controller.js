(function() {
    'use strict';

    angular
        .module('cakebox')
        .controller('PlayCtrl', PlayCtrl);

    /** ngInject */
    function PlayCtrl($scope, $routeParams, $translate, File, App, Betaseries) {

        $translate(['NOTIFICATIONS.BETASERIES_ERROR']).then(function (translations) {
            $scope.betaseries_error = translations['NOTIFICATIONS.BETASERIES_ERROR'];
        });

        App.get(null, function(data) {
            $scope.player = data.player;
            $scope.player.default_type = data.player.available_types[data.player.default_type];
            //data.default_type = data.player.available_types[data.player.default_type];
        });

        $scope.bsConfig = Betaseries.getConfig();

         File
            .get({'path': $routeParams.path}).$promise
            .then(function(data) {
                $scope.fileinfo = data;

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
    }

})();
