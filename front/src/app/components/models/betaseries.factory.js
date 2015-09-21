(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('Betaseries', Betaseries);

    function Betaseries($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            getConfig: {
                method: 'GET',
                url: BACKEND_URL + '/betaseries/config'
            },
            setWatched: {
                method: 'POST',
                url: BACKEND_URL + '/betaseries/watched/:id',
                params: {
                    id: '@id',
                }
            },
            setUnwatched: {
                method: 'DELETE',
                url: BACKEND_URL + '/betaseries/watched/:id',
                params: {
                    id: '@id',
                }
            }
        };

        resource = $resource(BACKEND_URL + '/betaseries/info/:filename', null, actions);
        return resource;
    }

})();
