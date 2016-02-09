(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('Directory', Directory);

    function Directory($resource, BACKEND_URL) {
        var actions;

        actions = {
            archive: {
                method: 'GET',
                url: BACKEND_URL + '/directories/archive',
                isArray: true
            },
            delete: {
                method: 'DELETE',
                url: BACKEND_URL + '/directories',
                isArray: true
            }
        };

        return $resource(BACKEND_URL + '/directories', null, actions);
    }

})();
