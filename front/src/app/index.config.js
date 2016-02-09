(function() {
    'use strict';

    angular
        .module('cakebox')
        .config(config);

    /** @ngInject */
    function config($routeProvider, $translateProvider) {
        var customResolves = {
            checkAppSettings: checkAppSettings,
        };

        /** @ngInject */
        function checkAppSettings($rootScope, $translate, Application) {
            if ($rootScope.rights && $rootScope.player) {
                return true;
            }

            var promise = Application.get().$promise;
            promise
                .then(function(data) {
                    $translate.use(data.language);

                    $rootScope.rights = data.rights;

                    $rootScope.player = data.player;
                    $rootScope.player.default_type = data.player.available_types[data.player.default_type];

                    if (data.version.local !== data.version.remote) {
                        alertify.log('Cakebox-light ' + data.version.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), 'success', 10000);
                    }
                });

            return promise;
        }

        var customRouteProvider = {
            when: customWhen
        };

        function customWhen(path, route) {
            route.resolve = (route.resolve) ? route.resolve : {};
            angular.extend(route.resolve, customResolves);
            $routeProvider.when(path, route);
            return this;
        }

        var cakeboxRouteProvider = angular.extend({}, $routeProvider, customRouteProvider);

        cakeboxRouteProvider
            .when('/', {
                redirectTo: '/browse'
            })
            .when('/browse', {
                templateUrl: 'app/browse/browse.html',
                controller:  'BrowseCtrl'
            })
            .when('/browse/:path*', {
                templateUrl: 'app/browse/browse.html',
                controller:  'BrowseCtrl'
            })
            .when('/play/:path*', {
                templateUrl: 'app/play/play.html',
                controller:  'PlayCtrl'
            })
            .when('/about', {
                templateUrl: 'app/about/about.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/languages/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('fr');
    }

})();
