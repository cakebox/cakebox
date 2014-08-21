app.controller('MediaCtrl', ['$location', '$scope', '$routeParams', 'File', 'Player', 'Betaseries',
    function($location, $scope, $routeParams, File, Player, Betaseries) {

        $scope.player = Player.get(null, function(data) {
            data.default_type = data.available_types[data.default_type];
        });

        $scope.bsConfig = Betaseries.getConfig();

        $scope.fileinfo = File.get({'path': $routeParams.path}, function(data) {
            if ($scope.bsConfig.apikey)
                $scope.betaseries = Betaseries.get({'filename': data.name});
        });

        $scope.watched = function (event, id) {
            if ($scope.bsConfig.apikey && $scope.bsConfig.login && $scope.bsConfig.passwd)
                $scope.betaseries = Betaseries.setWatched({'id': id});
            else
                alertify.log("Les accès BetaSeries ne sont pas correctement renseignés dans le fichier de configuration.", "error", 6000);
        }

        $scope.unwatched = function (event, id) {
            if ($scope.bsConfig.apikey && $scope.bsConfig.login && $scope.bsConfig.passwd)
                $scope.betaseries = Betaseries.setUnwatched({'id': id});
            else
                alertify.log("Les accès BetaSeries ne sont pas correctement renseignés dans le fichier de configuration.", "error", 6000);
        }
    }
]);
