var app = angular.module('cakebox',  [
  'ngRoute',
  'ui.bootstrap'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/browse.html',
        controller:  'MainCtrl'
      }).
      when('/browse/', {
        templateUrl: 'partials/browse.html',
        controller:  'MainCtrl'
      }).
      when('/browse/:path*', {
        templateUrl: 'partials/browse.html',
        controller:  'MainCtrl'
      }).
      when('/play/:path*', {
        templateUrl: 'partials/play.html',
        controller:  'MediaCtrl'
      }).
      when('/about', {
        templateUrl: 'partials/about.html'
      }).
      when('/contact', {
        templateUrl: 'partials/contact.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);



