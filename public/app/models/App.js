app.factory('App', ['$resource', function ($resource) {
    var App;

    return App = $resource('api/app', null, null);
}]);
