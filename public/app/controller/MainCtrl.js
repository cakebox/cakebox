app.controller('MainCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $http.get('api/app/commitid')
            .success(function(data, status, headers, config) {
                $scope.appinfo = data;
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/app/commitid");
            });
    }
]);
