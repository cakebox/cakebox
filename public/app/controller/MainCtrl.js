app.controller('MainCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.$on('$locationChangeSuccess',function(evt, absNewUrl, absOldUrl) {
            $scope.previouspage  = absOldUrl;
        });

        $http.get('/api/app/commitid').success(function(data) {
            $scope.appinfo = data;
        });
    }
]);
