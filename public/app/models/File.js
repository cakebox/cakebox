app.factory('File', ['$resource', function ($resource) {
    var File, actions;

    actions = {
        delete: {
            method: 'GET',
            url: '/api/file/delete',
        }
    };

    return File = $resource('/api/file/info', null, actions);
}]);
