(function() {
    'use strict';

    angular.module('cakebox')
    .factory('Betaseries', function ($resource) {
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

        Betaseries = $resource('api/betaseries/info/:filename', null, actions);
        return Betaseries;
    });

})();
