app.factory('File', ['$resource', function ($resource) {
    var File, actions;

    actions = {
        deleteFile: {
            method: 'GET',
            url: '/api/file/deleteFile',
        }
    };

    return File = $resource('/api/file/info', null, actions);
}]);
