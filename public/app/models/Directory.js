app.factory('Directory', ['$resource', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: '/api/directory/archive',
        }
    };

    return Directory = $resource('/api/directory/content', null, actions);
}]);
