(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('File', File);

    function File($resource, BACKEND_URL) {
        var File, actions;

        actions = {
            delete: {
                method: 'DELETE',
                url: BACKEND_URL + '/files',
                isArray: true
            }
        };

        File = $resource(BACKEND_URL + '/files', null, actions);
        return File;
    }

})();
