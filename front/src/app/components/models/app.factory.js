(function() {
    'use strict';

    angular.module('cakebox')
    .factory('App', function ($resource, BACKEND_URL) {
        var App;

        App = $resource(BACKEND_URL + '/app', null, null);
        return App;
    });

})();
