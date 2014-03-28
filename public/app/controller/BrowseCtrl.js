app.controller('BrowseCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs',
    function($scope, $http, $routeParams, breadcrumbs) {

        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;
        $scope.informations = "Chargement des fichiers, veuillez patienter ...";

        function getDatas(path) {

            $http.get('api/directory/content/' + path)
                .success(function(data, status, headers, config) {
                    $scope.informations = "";
                    $scope.dirs = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.informations = "Une erreur est survenue (Erreur " + status + ")";
                    console.error("Cakebox: API is unreachable on /api/directory/content/ (" + status + ")");
                });
        }

        $scope.$watch('location.path()', function(event, current) {

            $scope.dirs = [];
            $scope.currentTS = Math.round(new Date().getTime() / 1000);

            if ($routeParams.path != "")
                $scope.currentPath += $routeParams.path + "/";

            getDatas($scope.currentPath);
        });

        $scope.refreshDatas = function() {
            getDatas($scope.currentPath);
        };
    }
]);
