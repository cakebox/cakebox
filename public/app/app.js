var app = angular.module('cakebox',  [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ngClipboard',
    'pascalprecht.translate',
    'ngFileUpload',
    'ngCookies'
]);

app.config(['$routeProvider', '$translateProvider', 'ngClipProvider',

    function($routeProvider, $translateProvider, ngClipProvider) {
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
        when('/login', {
            templateUrl: 'partials/login.html',
            controller:  'LoginCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

        $translateProvider.useStaticFilesLoader({
            prefix: 'ressources/languages/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('fr');
        $translateProvider.useSanitizeValueStrategy(null);
        ngClipProvider.setPath("components/zeroclipboard/dist/ZeroClipboard.swf");
    }
]);

app.run(['$rootScope', '$location', '$cookies', 'Auth', 'App', function ($rootScope, $location, $cookies, Auth, App) {

    var cookie = $cookies.get('cakebox');
    console.log(cookie)
    if(cookie !== undefined) {
        App.cookie({ cookie: $cookies.get('cakebox') }, function(data, status) {
            console.log('logged with cookie')
            Auth.setUser("logged"); //Update the state of the user in the app
        }, function(data) {
            console.log("cookie not ok")
        });
    } else {
        console.log("redirect from cookie check")
        App.cookie({}, function(data, status) {
            console.log(data)
            console.log('logged without cookie')
            Auth.setUser("logged"); //Update the state of the user in the app
        }, function(data) {
            console.log("cookie not ok")
            $location.path('/login');
        });
    }

    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            console.log("user not logged")
            $location.path('/login');
        } else {
            console.log("user logged")
        }
    });
}]);