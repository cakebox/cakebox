app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: '/api/directory/archive/:path',
            params: {
                path: '@path'
            }
        }
    };

    return Directory = $resource('/api/directory/content/:path', null, actions);
}]);
