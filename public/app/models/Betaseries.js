app.factory('Betaseries', ['$resource', function ($resource) {
    var Betaseries, actions;

    actions = {
        watched: {
            method: 'POST',
            url: 'api/betaseries/watched/:id',
            params: {
                id: '@id',
            }
        },
        unwatched: {
            method: 'DELETE',
            url: 'api/betaseries/watched/:id',
            params: {
                id: '@id',
            }
        }
    };

    return Betaseries = $resource('api/betaseries/info/:filename', null, actions);
}]);
