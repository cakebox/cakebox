app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: 'api/directories/archive',
        },
        delete: {
            method: 'DELETE',
            url: 'api/directories',
        }
    };

    return Directory = $resource('api/directories', null, actions);
}]);
