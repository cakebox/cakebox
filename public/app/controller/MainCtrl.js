app.controller('MainCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $http.get('api/app/version')
            .success(function(data, status, headers, config) {
                $scope.versions = data;

                if (data.local != data.remote)
                    alertify.success("Cakebox-light " + data.remote + " disponnible !");
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/app/version");
            });
    }
]);
