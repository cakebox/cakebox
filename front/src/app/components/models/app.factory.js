(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('Application', Application);

    function Application($resource, BACKEND_URL) {
        return $resource(BACKEND_URL + '/app', null, null);
    }

})();
