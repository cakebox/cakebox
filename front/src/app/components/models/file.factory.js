(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('File', File);

    function File($resource, BACKEND_URL) {
        var actions;

        actions = {
            delete: {
                method:  'DELETE',
                url:     BACKEND_URL + '/files',
                isArray: true
            }
        };

        return $resource(BACKEND_URL + '/files', null, actions);
    }

})();
