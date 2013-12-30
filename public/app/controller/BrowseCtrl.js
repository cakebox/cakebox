app.controller('BrowseCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs',
    function($scope, $http, $routeParams, breadcrumbs) {

        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;
        $scope.informations = "Chargement des fichiers, veuillez patienter ...";

        $scope.$watch('location.path()', function(event, current) {

            if ($routeParams.path != "")
                $scope.currentPath += $routeParams.path + "/";

            $http.get('api/directories/content/' + $scope.currentPath)
                .success(function(data, status, headers, config) {
                    $scope.informations = "";
                    $scope.currentTS = Math.round(new Date().getTime() / 1000);
                    if (data.length == 0)
                        $scope.dirs = "empty";
                    else
                        $scope.dirs = data;
                })
                .error(function(data, status, headers, config) {
                    $scope.informations = "Une erreur est survenue (Erreur " + status + ")";
                    console.error("Cakebox: API is unreachable on /api/directories/content/ (" + status + ")");
                });
        });
    }
]);
