(function() {
    'use strict';

    angular.module('cakebox')
    .controller('PlayCtrl', function ($scope, $routeParams, $translate, File, Player, Betaseries) {

        $translate(['NOTIFICATIONS.BETASERIES_ERROR']).then(function (translations) {
            $scope.betaseries_error = translations['NOTIFICATIONS.BETASERIES_ERROR'];
        });

        $scope.player = Player.get(null, function(data) {
            data.default_type = data.available_types[data.default_type];
        });

        $scope.bsConfig = Betaseries.getConfig();

        $scope.fileinfo = File.get({'path': $routeParams.path}, function(data) {
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
    });

})();
