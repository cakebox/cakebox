var app = angular.module('cakebox',  [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ngClipboard'
]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/browse/', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/browse/:path*', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/play/:path*', {
            templateUrl: 'partials/play.html',
            controller:  'MediaCtrl'
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);
