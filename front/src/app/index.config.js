(function() {
    'use strict';

    angular.module('cakebox')
        .config(['$routeProvider', '$translateProvider', function ($routeProvider, $translateProvider) {
            $routeProvider
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
        }]);

})();
