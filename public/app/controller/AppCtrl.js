app.controller('AppCtrl', ['$scope', '$http', '$location', 'Rights',
    function($scope, $http, $location, Rights) {
        $scope.global = {
            predicate: "",
            reverse: "",
            searchText: "",
            versions: {}
        };

        $scope.rights = Rights.get();

        $scope.$on('$locationChangeSuccess',function(eventt, newurl, oldurl) {
            $scope.previouspage = oldurl;
        });

        $scope.copyText = function(data) {

            return $location.protocol() + "://" + $location.host() + data.access;
        }
        $scope.copyfileinfo = function(){
            alertify.log("Le lien a bien êtes copié", "success", 10000);
        }

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
