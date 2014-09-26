app.controller('AppCtrl', ['$scope', '$http', '$location', '$translate', 'Rights', 'App',
    function($scope, $http, $location, $translate, Rights, App) {
        $scope.search = {
            predicate: "",
            reverse: "",
            text: "",
            versions: {}
        };

        $scope.app = App.get(null, function(data) {
            $translate.use(data.language);

            $scope.search.versions = data.version;
            if ($scope.search.versions.local != $scope.search.versions.remote)
                alertify.log("Cakebox-light " + $scope.search.versions.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), "success", 1000); 
        });

        $scope.rights = Rights.get();

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $scope.copyText = function(data) {
            return encodeURI($location.protocol() + "://" + $location.host() + data.access);
        }

        $scope.copyfileinfo = function() {
            alertify.log($translate.instant('NOTIFICATIONS.LINK_COPY') , "success", 10000);
        }
    }
]);
