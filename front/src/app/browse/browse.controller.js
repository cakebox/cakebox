(function() {
    'use strict';

    angular
        .module('cakebox')
        .controller('BrowseCtrl', BrowseCtrl);

    /** ngInject */
    function BrowseCtrl($rootScope, $window, $location, $routeParams, $scope, $translate, breadcrumbs, Directory, File) {

        $scope.currentPath = '';
        $scope.breadcrumbs = breadcrumbs;

        function retrieveDirectories(path) {
            $scope.informations = $translate.instant('NOTIFICATIONS.LOAD_FILE');

            Directory
                .query({'path': path}).$promise
                .then(function(data) {
                    $scope.entries = data;

                    $scope.informations = '';
                    if (data.length === 0) {
                        $scope.informations = $translate.instant('NOTIFICATIONS.NOT_FOUND');
                    }
                })
                .catch(function(error) {
                    $scope.informations = 'Error ' + error.status + ' (' + error.statusText + '): ';
                });
        }

        $scope.$watch('location.path()', function() {
            // Force unbinding
            $scope.entries = [];

            if ($routeParams.path !== '') {
                $scope.currentPath += $routeParams.path;
            }

            retrieveDirectories($scope.currentPath);
        });

        $scope.refreshDatas = function(event) {
            // Force unbinding
            $scope.entries = [];

            // I'm not a fan to mix jquery and angular here
            //$(event.target).addClass('spin');
            retrieveDirectories($scope.currentPath); // This is fast too fast to see the spinning
            //$(event.target).removeClass('spin');
        };

        $scope.archiveDirectory = function(directory) {
            alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ARCHIVE_N') + directory.name + $translate.instant('NOTIFICATIONS.ARCHIVE.IN_CREATION'), 'success', 6000);

            Directory
                .archive({'path': $scope.currentPath + '/' + directory.name}).$promise
                .then(function(data) {
                    $scope.entries = data;
                    alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ARCHIVE_N') + directory.name + $translate.instant('NOTIFICATIONS.ARCHIVE.SUCCESS'), 'success', 6000);
                })
                .catch(function(error) {
                    if (error.status === 403) {
                        alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ERROR_RIGHT'), 'error', 6000);
                    }
                    if (error.status === 406) {
                        alertify.log($translate.instant('NOTIFICATIONS.ARCHIVE.ERROR_EXIST'), 'error', 6000);
                    }
                });
        };

        $scope.removeDirectory = function(directory) {
            var sure = $window.confirm($translate.instant('NOTIFICATIONS.SURE'));

            if (sure) {
                Directory
                    .delete({'path': $scope.currentPath + '/' + directory.name}).$promise
                    .then(function(data) {
                        $scope.entries = data;
                        alertify.log(directory.name + $translate.instant('NOTIFICATIONS.DELETE_OK'), 'success', 6000);
                    })
                    .catch(function(error) {
                        if (error.status === 403) {
                            alertify.log(directory.name + $translate.instant('NOTIFICATIONS.DELETE_NOTOK'), 'error', 6000);
                        }
                    });
            }
        };

        $scope.removeFile = function(file) {
            var sure = $window.confirm($translate.instant('NOTIFICATIONS.SURE'));

            if (sure) {
                File
                    .delete({'path': $scope.currentPath + '/' + file.name}).$promise
                    .then(function(data) {
                        alertify.log(file.name + $translate.instant('NOTIFICATIONS.DELETE_OK'), 'success', 6000);
                        $scope.entries = data;
                    }).catch(function(error) {
                        if (error.status === 403) {
                            alertify.log(file.name + $translate.instant('NOTIFICATIONS.DELETE_NOTOK'), 'error', 6000);
                        }
                    });
            }
        };

        $scope.getExtraClasses = function(entry) {
            var extraclasses = '';

            if (entry.type === 'dir') {
                extraclasses = 'glyphicon-folder-open';
            }
            else if (entry.type === 'file') {
                extraclasses = 'glyphicon-file';

                if (entry.extraType) {
                    switch (entry.extraType) {
                        case 'video':
                            extraclasses = 'glyphicon-film';
                            break;
                        case 'audio':
                            extraclasses = 'glyphicon-music';
                            break;
                        case 'image':
                            extraclasses = 'glyphicon-picture';
                            break;
                        case 'archive':
                            extraclasses = 'glyphicon-compressed';
                            break;
                        case 'subtitle':
                            extraclasses = 'glyphicon-subtitles';
                            break;
                        default:
                            break;
                    }
                }
            }

            return 'glyphicon ' + extraclasses;
        };

        $scope.getUrl = function(entry) {
            var url = '';

            if (entry.type === 'dir') {
                url = '#/browse' + ($scope.currentPath ? '/' + $scope.currentPath : '') + '/' + entry.name;
            }
            else if (entry.type === 'file' && $rootScope.rights.canPlayMedia) {
                url = entry.access;
                if (entry.extraType === 'video') {
                    url = '#/play' + ($scope.currentPath ? '/' + $scope.currentPath : '') + '/' + entry.name;
                }
            }

            return url;
        };

        $scope.isRecentFile = function(entry) {
            var currentTS = Math.round(new Date().getTime() / 1000);

            if (entry.type === 'file') {
                if (((currentTS - entry.mtime) / 3600) <= 24) {
                    return true;
                }
            }
            return false;
        };

        $scope.copyText = function(data) {
            return $location.protocol() + '://' + $location.host() + data.access;
        };

        $scope.copyfileinfo = function() {
            alertify.log($translate.instant('NOTIFICATIONS.LINK_COPY') , 'success', 10000);
        };
    }

})();
