(function() {
    'use strict';

    angular
        .module('cakebox')
        .factory('App', App);

    function App($resource, BACKEND_URL) {
        var App;

        App = $resource(BACKEND_URL + '/app', null, null);
        return App;
    }

})();
