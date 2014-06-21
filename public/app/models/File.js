app.factory('File', ['$resource', function ($resource) {
    var File;

    return File = $resource('/api/file/info', null, null);
}]);
