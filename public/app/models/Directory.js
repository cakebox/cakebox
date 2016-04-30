app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: 'api/directories/archive',
            isArray: true
        },
        create: {
            method: 'GET',
            url: 'api/directories/create',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            url: 'api/directories/delete',
            isArray: true
        },
        rename: {
            method: 'GET',
            url: 'api/directories/rename',
            isArray: true
        }
    };

    return Directory = $resource('api/directories', null, actions);
}]);
