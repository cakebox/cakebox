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

        $scope.archiveDirectory = function(directory) {
            alertify.log("L'archive " + directory.name + ".tar est en cours de création, veuillez patienter.", "success", 6000);

            Directory.archive({'path': $scope.currentPath + directory.name}, function(data) {
                alertify.log("L'archive " + directory.name + ".tar a bien été créée.", "success", 6000);
            }, function(error) {
                if(error.status == 403) {
                    alertify.log("Le repertoire de destination n'a pas les droits necessaires.", "error", 6000);
                }
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        };

        $scope.removeDirectory = function(directory) {
            Directory.delete({'path': $scope.currentPath + directory.name}, function(data) {
                alertify.log("Le dossier " + directory.name + " est bien supprimé.", "success", 6000);
                retrieveDirectories($scope.currentPath);
            }, function(error) {
                if(error.status == 403) {
                    alertify.log("Le dossier " + directory.name + " n'a pas les droits necessaires pour être supprimé.", "error", 6000);
                }
                $scope.informations = "Erreur " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
            });
        };

        $scope.removeFile = function(file) {
            File.delete({'path': $scope.currentPath + file.name}, function(data) {
                alertify.log("Le fichier " + file.name + " est bien supprimé.", "success", 6000);
                retrieveDirectories($scope.currentPath);
            }, function(error) {
                if(error.status == 403) {
                    alertify.log("Le fichier " + file.name + " n'a pas les droits necessaires pour être supprimé.", "error", 6000);
                }
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
