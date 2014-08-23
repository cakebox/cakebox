app.factory('File', ['$resource', function ($resource) {
    var File, actions;

    actions = {
        delete: {
            method: 'DELETE',
            url: 'api/files',
            isArray: true
        }
    };

    return File = $resource('api/files', null, actions);
}]);
