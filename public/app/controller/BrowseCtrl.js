app.controller('BrowseCtrl', function($window, $location, $scope, $routeParams, breadcrumbs, Directory, File, $translate, Upload) {
    $scope.currentPath = "";
    $scope.breadcrumbs = breadcrumbs;
    $scope.actionedit = false;
    $scope.editkey = -1;
    $scope.file = [];
    $scope.file.name = "";
    $scope.file.oldname = "";
    $scope.progressPercentage = 0;

    function retrieveDirectories(path) {
        $scope.informations = $translate.instant('NOTIFICATIONS.LOAD_FILE');

        $scope.entries = Directory.query({'path': path}, function(data) {
            $scope.informations = "";
            if (data.length == 0)
                $scope.informations = $translate.instant('NOTIFICATIONS.NOT_FOUND');
        }, function(error) {
            $scope.informations = "Error " + error.status + " (" + error.statusText + "): " + error.config.method + " " + error.config.url;
        });
    }

    $scope.$watch('location.path()', function(event, current) {
        // Force unbinding
        $scope.entries = [];

        if ($routeParams.path != "")
            $scope.currentPath += $routeParams.path;

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
        alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ARCHIVE_N') + directory.name + $translate.instant('NOTIFICATIONS.ARCHIVE.IN_CREATION'), "success", 6000);

        Directory.archive({'path': $scope.currentPath + "/" + directory.name}, function(data) {
            $scope.entries = data;
            alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ARCHIVE_N') + directory.name + $translate.instant('NOTIFICATIONS.ARCHIVE.SUCCESS'), "success", 6000);
        }, function(error) {
            if (error.status == 403) {
                alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ERROR_RIGHT'), "error", 6000);
            }
            if (error.status == 406) {
                alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ERROR_EXIST'), "error", 6000);
            }
        });
    };

    $scope.addDirectory = function() {
        var folder = $window.prompt("Enter folder name :");
        if (folder) {
            Directory.create({'path': $scope.currentPath, 'folder': folder}, function(data) {
                alertify.log(name + ' ' + $translate.instant('NOTIFICATIONS.CREATE_DIR_OK'), "success", 6000);
            }, function(error) {
                console.log(error)
                if (error.status == 403) {
                    alertify.log(name + ' ' + $translate.instant('NOTIFICATIONS.CREATE_DIR_NOTOK'), "error", 6000);
                }
            });
            $scope.refreshDatas($scope.currentPath) // because php have some error
        }
    };

    $scope.removeDirectory = function(directory) {
        var sure = $window.confirm($translate.instant('NOTIFICATIONS.SURE'));

        if (sure) {
            Directory.delete({'path': $scope.currentPath + "/" + directory.name}, function(data) {
                alertify.log(directory.name + $translate.instant('NOTIFICATIONS.DELETE_OK'), "success", 6000);
            }, function(error) {
                if (error.status == 403) {
                    alertify.log(directory.name + $translate.instant('NOTIFICATIONS.DELETE_NOTOK'), "error", 6000);
                }
            });
            window.location.reload();
        }
    };

    $scope.removeFile = function(file) {
        var sure = $window.confirm($translate.instant('NOTIFICATIONS.SURE'));

        if (sure) {
            File.delete({'path': $scope.currentPath + "/" + file.name}, function(data) {
                alertify.log(file.name + $translate.instant('NOTIFICATIONS.DELETE_OK'), "success", 6000);
                $scope.entries = data;
            }, function(error) {
                if (error.status == 403) {
                    alertify.log(file.name + $translate.instant('NOTIFICATIONS.DELETE_NOTOK'), "error", 6000);
                }
            });
        }
    };

    $scope.ddclick = function(key) {
        $scope.actionedit = true;
        $scope.editkey = key;
    };

    $scope.changeName = function(file) {
        $scope.actionedit = false;
        $scope.editkey = -1;
        Directory.rename({'path': $scope.currentPath,'name': file.name, 'oldname': file.oldname}, function(data) {
        });
        $scope.refreshDatas($scope.currentPath) // because php have some error
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: 'api/files/upload',
            method: 'POST',
            data: {'file': file, 'path': $scope.currentPath},
            sendFieldsAs: 'form',
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(function (resp) {
            $scope.refreshDatas($scope.currentPath) // because php have some error
        }, function (resp) {
            console.log(resp);
        }, function (evt) {
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            if ($scope.progressPercentage == 100)
                $scope.progressPercentage = 0;
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
            url = "#/browse" + ($scope.currentPath ? "/" + $scope.currentPath : "") + "/" + entry.name;
        }
        else if (entry.type == "file" && $scope.rights.canPlayMedia) {
            url = entry.access;
            if (entry.extraType == "video")
                url = "#/play" + ($scope.currentPath ? "/" + $scope.currentPath : "") + "/" + entry.name;
        }

        return url;
    }

    $scope.isRecentFile = function(entry) {
        currentTS = Math.round(new Date().getTime() / 1000);

        if (entry.type == "file") {
            if (((currentTS - entry.mtime) / 3600) <= 24)
                return true;
        }
        return false;
    }
});
