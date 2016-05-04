app.controller('AppCtrl', function($scope, $http, $location, $translate, $cookies, Rights, App, Auth) {

    $scope.search =
    {
        text: ""
    };
    $scope.sortOptions =
    {
        sortBy: "",
        reverse: false
    };

    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
        if(!value && oldValue) {
            $location.path('/login');
        }
        if(value) {
            console.log("Connect LogginCtrl");
            $scope.rights = Rights.get();
            $location.path('/');
            App.infos(null, function(data) {
                $translate.use(data.language);
                $scope.app = data;

                if (data.version.local != data.version.remote)
                    alertify.log("Cakebox-light " + data.version.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), "success", 10000);
            });
        }
    }, true);

    $scope.disconnect = function () {
        App.disconnect({}, function (data) {
            Auth.setUser('');
            $location.path('/login');
        });
    }

    $scope.$on('$locationChangeSuccess',function(event, newurl, oldurl) {
        $scope.previouspage = oldurl;
    });

    $scope.copyText = function(data) {
        return $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.access;
    }

    $scope.copyfileinfo = function() {
        alertify.log($translate.instant('NOTIFICATIONS.LINK_COPY') , "success", 10000);
    }
});
