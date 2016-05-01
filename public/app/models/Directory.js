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
            isArray: false
        },
        delete: {
            method: 'DELETE',
            url: 'api/directories/delete',
            isArray: false
        },
        rename: {
            method: 'GET',
            url: 'api/directories/rename',
            isArray: true
        }
    };

    return Directory = $resource('api/directories', null, actions);
}]);
