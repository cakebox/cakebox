var app = angular.module('cakebox',  [
  'ngRoute',
  'cakeboxCtrl'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/about', {
        templateUrl: 'partials/about.html'
      }).
      when('/contact', {
        templateUrl: 'partials/contact.html'
      }).
      otherwise({
        templateUrl: 'partials/index.html',
        controller: 'MainCtrl'
      });
  }]);

