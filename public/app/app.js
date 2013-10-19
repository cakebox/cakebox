var app = angular.module('cakebox',  [
  'ngRoute',
  'cakeboxCtrl',
  'services.breadcrumbs'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index.html',
        controller: 'MainCtrl'
      }).
      when('/get/:path*', {
        templateUrl: 'partials/index.html',
        controller: 'MainCtrl'
      }).
      when('/play/:path', {
        templateUrl: 'partials/play.html',
        controller: 'MediaCtrl'
      }).
      when('/about', {
        templateUrl: 'partials/about.html'
      }).
      when('/contact', {
        templateUrl: 'partials/contact.html'
      }).
      otherwise({
        //redirectTo: '/'
      });
  }]);

var cakeboxCtrl = angular.module('cakeboxCtrl', []);
