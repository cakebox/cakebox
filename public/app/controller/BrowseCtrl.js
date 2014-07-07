app.controller('BrowseCtrl', ['$scope', '$routeParams', 'breadcrumbs', 'Directory', 'File',
    function($scope, $routeParams, breadcrumbs, Directory, File) {
        $scope.currentPath = "";
        $scope.breadcrumbs = breadcrumbs;

        function retrieveDirectories(path) {
            $scope.informations = "Chargement des fichiers, veuillez patienter ...";

            $scope.entries = Directory.query({'path': path}, function(data) {
                $scope.informations = "";
                if (data.length == 0)
                    $scope.informations = "Rien dans ce répertoire.";
            }, function(error) {
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        }

        $scope.$watch('location.path()', function(event, current) {
            $scope.entries = [];

            if ($routeParams.path != "")
                $scope.currentPath += $routeParams.path + "/";

            retrieveDirectories($scope.currentPath);
        });

        $scope.refreshDatas = function(event) {
            // Force unbinding
            $scope.entries = [];

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

        $scope.rmDirectory = function(dirName) {

            Directory.deleteDir({'path': $scope.currentPath + dirName}, function(data) {
                alertify.log("Le dossier " + dirName + " est bien supprimé.", "success", 0);
                retrieveDirectories($scope.currentPath);
            }, function(error) {
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });   
        };

        $scope.rmFile = function(fileName) {

            File.deleteFile({'path': $scope.currentPath + fileName}, function(data) {
                alertify.log("Le fichier " + fileName + " est bien supprimé.", "success", 0);
                retrieveDirectories($scope.currentPath);
            }, function(error) {
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        };

        $scope.getExtraClasses = function(entry) {
            extraclasses = "";

            if (entry.type == "dir") {
                extraclasses = "glyphicon-folder-open";
            }
            else if (entry.type == "file") {
                extraclasses = "glyphicon-file";

                if (entry.extraType) {
                    switch (entry.extraType) {
                        case "video":
                            extraclasses = "glyphicon-film";
                            break;
                        case "audio":
                            extraclasses = "glyphicon-music";
                            break;
                        case "image":
                            extraclasses = "glyphicon-picture";
                            break;
                        case "archive":
                            extraclasses = "glyphicon-compressed";
                            break;
                        case "subtitle":
                            extraclasses = "glyphicon-subtitles";
                            break;
                        default:
                            console.log ("No glyphicon class defined for " + entry.extraType);
                            break;
                    }
                }
            }

            return "glyphicon " + extraclasses;
        }

        $scope.getUrl = function(entry) {
            url = ""

            if (entry.type == "dir") {
                url = "#/browse/" + $scope.currentPath + entry.name;
            }
            else if (entry.type == "file" && $scope.rights.canPlayMedia) {
                url = entry.access;
                if (entry.extraType == "video")
                    url = "#/play/" + $scope.currentPath + entry.name;
            }

            return url;
        }

        $scope.isRecentFile = function(entry) {
            currentTS = Math.round(new Date().getTime() / 1000);

            if (entry.type == "file") {
                if (((currentTS - entry.ctime) / 3600) <= 24)
                    return true;
            }
            return false;
        }
    }
]);
