app.controller('MediaCtrl', ['$location', '$scope', '$routeParams', 'File', 'Player', 'Betaseries',
    function($location, $scope, $routeParams, File, Player, Betaseries) {

        $scope.player = Player.get(null, function(data) {
            data.default_type = data.avalaible_types[data.default_type];
        });

        $scope.fileinfo = File.get({'path': $routeParams.path}, function(data) {
            $scope.betaseries = Betaseries.get({'filename': data.name});
        });

        $scope.watched = function (event, id) {
            Betaseries.watched({'id': id}, function(data) {
                $(event.target).text("Épisode vu !");
            });
        }
    }
]);
