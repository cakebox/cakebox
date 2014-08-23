app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: 'api/directory/archive',
        },
        delete: {
            method: 'DELETE',
            url: 'api/directory',
        }
    };

    return Directory = $resource('api/directory', null, actions);
}]);
