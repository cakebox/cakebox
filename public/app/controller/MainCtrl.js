app.controller('MainCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $http.get('/api/app/commitid').success(function(data) {
            $scope.appinfo = data;
        });
    }
]);
