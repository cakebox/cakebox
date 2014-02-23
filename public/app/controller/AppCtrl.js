app.controller('AppCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        $scope.global = {
            predicate: "",
            reverse: "",
            searchText: "",
            versions: {}
        };

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $http.get('api/app/version')
            .success(function(data, status, headers, config) {
                $scope.global.versions = data;

                alertify.set({ delay: 10000 });
                if ($scope.global.versions.local != $scope.global.versions.remote)
                    alertify.success("Cakebox-light " + $scope.global.versions.remote + " est disponnible !");
            })
            .error(function(data, status, headers, config) {
                console.error("Cakebox: API is unreachable on /api/app/version");
            });
    }
]);
