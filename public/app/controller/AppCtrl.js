app.controller('AppCtrl', ['$scope', '$http', '$location', '$translate', 'Rights', 'App',
    function($scope, $http, $location, $translate, Rights, App) {
        $scope.search =
        {
            text: ""
        };
        $scope.sortOptions =
        {
            sortBy: "",
            reverse: false
        };
        $scope.appVersions = {};

        $scope.app = App.get(null, function(data) {
            $translate.use(data.language);

            $scope.appVersions = data.version;
            if ($scope.appVersions.local != $scope.appVersions.remote)
                alertify.log("Cakebox-light " + $scope.appVersions.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), "success", 10000);
        });

        $scope.rights = Rights.get();

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $scope.copyText = function(data) {
            return $location.protocol() + "://" + $location.host() + data.access;
        }

        $scope.copyfileinfo = function() {
            alertify.log($translate.instant('NOTIFICATIONS.LINK_COPY') , "success", 10000);
        }
    }
]);
