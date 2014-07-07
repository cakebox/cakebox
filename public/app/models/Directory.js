app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: '/api/directory/archive',
        },
        deleteDir: {
            method: 'GET',
            url: '/api/directory/deleteDir',
        }
    };

    return Directory = $resource('/api/directory/content', null, actions);
}]);
