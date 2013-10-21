var app = angular.module('cakebox',  [
  'ngRoute',
  'cakeboxCtrl'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/browse.html',
        controller: 'MainCtrl'
      }).
      when('/browse/', {
        templateUrl: 'partials/browse.html',
        controller: 'MainCtrl'
      }).
      when('/browse/:path*', {
        templateUrl: 'partials/browse.html',
        controller: 'MainCtrl'
      }).
      when('/play/:path*', {
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
        redirectTo: '/'
      });
  }]);

var cakeboxCtrl = angular.module('cakeboxCtrl', [
  'services.breadcrumbs',
  'ui.bootstrap'
]);

// https://gist.github.com/thomseddon/3511330
cakeboxCtrl.filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  }
});
