(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('App', App);

    function App($resource, BACKEND_URL) {
        var resource;

        resource = $resource(BACKEND_URL + '/app', null, null);
        return resource;
    }

})();
