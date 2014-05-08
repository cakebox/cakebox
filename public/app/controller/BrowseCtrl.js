app.controller('BrowseCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs',
    function($scope, $http, $routeParams, breadcrumbs) {
        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;

        function getDatas(path) {
            $scope.informations = "Chargement des fichiers, veuillez patienter ...";

            $http.get('api/directory/content/' + path)
                .success(function(data, status, headers, config) {
                    $scope.informations = "";
                    if (data.length == 0)
                        $scope.informations = "Rien dans ce répertoire.";
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

        $scope.refreshDatas = function(event) {
            // Force unbinding
            $scope.dirs = 0;

            $(event.target).addClass("spin");
            getDatas($scope.currentPath); // This is fast too fast to see the spinning
            $(event.target).removeClass("spin");
        };

        $scope.archiveDirectory = function(dirName) {
            console.log($scope.currentPath + dirName);
            $http.get('api/directory/archive/' + $scope.currentPath + dirName)
                .success(function(data, status, headers, config) {
                    //alertify.warning("L'archive " + dirName + ".tar est en cours de création, veuillez patienter.");
                })
                .error(function(data, status, headers, config) {
                    $scope.informations = "Une erreur est survenue (Erreur " + status + ")";
                    console.error("Cakebox: API is unreachable on /api/directory/content/ (" + status + ")");
                });
        };
    }
]);
