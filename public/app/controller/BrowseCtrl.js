app.controller('BrowseCtrl', ['$scope', '$http', '$routeParams', 'breadcrumbs', 'Directory',
    function($scope, $http, $routeParams, breadcrumbs, Directory) {
        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;

        function retrieveDirectories(path) {
            $scope.informations = "Chargement des fichiers, veuillez patienter ...";

            $scope.dirs = Directory.query({'path': path}, function(data) {
                $scope.informations = "";
                if (data.length == 0)
                    $scope.informations = "Rien dans ce répertoire.";
            }, function(error) {
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        }

        $scope.$watch('location.path()', function(event, current) {
            $scope.dirs = [];
            $scope.currentTS = Math.round(new Date().getTime() / 1000);

            if ($routeParams.path != "")
                $scope.currentPath += $routeParams.path + "/";

            retrieveDirectories($scope.currentPath);
        });

        $scope.refreshDatas = function(event) {
            // Force unbinding
            $scope.dirs = 0;

            $(event.target).addClass("spin");
            retrieveDirectories($scope.currentPath); // This is fast too fast to see the spinning
            $(event.target).removeClass("spin");
        };

        $scope.archiveDirectory = function(dirName) {
            alertify.log("L'archive " + dirName + ".tar est en cours de création, veuillez patienter.", "success", 0);

            Directory.archive({'path': $scope.currentPath + dirName}, function(data) {
                alertify.log("L'archive " + dirName + ".tar a bien été créée.", "success", 0);
            }, function(error) {
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        };
    }
]);
