app.controller('AppCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.global = {
            searchText: "",
            versions: {}
        };

        $http.get('api/app/version')
            .success(function(data, status, headers, config) {
                $scope.global.versions = data;

                if ($scope.global.versions.local != $scope.global.versions.remote)
                    alertify.success("Cakebox-light " + $scope.global.versions.remote + " disponnible !");
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/app/version");
            });
    }
]);
