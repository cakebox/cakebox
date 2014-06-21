app.controller('MediaCtrl', ['$scope', '$http', '$routeParams', 'File', 'Player', 'Betaseries',
    function($scope, $http, $routeParams, File, Player, Betaseries) {

        $scope.player = Player.get();

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
