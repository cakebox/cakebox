(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('File', File);

    function File($resource, BACKEND_URL) {
        var resource, actions;

        actions = {
            delete: {
                method: 'DELETE',
                url: BACKEND_URL + '/files',
                isArray: true
            }
        };

        resource = $resource(BACKEND_URL + '/files', null, actions);
        return resource;
    }

})();
