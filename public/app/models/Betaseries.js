app.factory('Betaseries', ['$resource', function ($resource) {
    var Betaseries, actions;

    actions = {
        getConfig: {
            method: 'GET',
            url: 'api/betaseries/config'
        },
        setWatched: {
            method: 'POST',
            url: 'api/betaseries/watched/:id',
            params: {
                id: '@id',
            }
        },
        setUnwatched: {
            method: 'DELETE',
            url: 'api/betaseries/watched/:id',
            params: {
                id: '@id',
            }
        }
    };

    return Betaseries = $resource('api/betaseries/info/:filename', null, actions);
}]);
