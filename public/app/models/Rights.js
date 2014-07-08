app.factory('Rights', ['$resource', function ($resource) {
    var Rights;

    return Rights = $resource('api/rights', null, null);
}]);
