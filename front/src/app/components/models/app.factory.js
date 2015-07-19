(function() {
    'use strict';

    angular.module('cakebox')
    .factory('App', function ($resource) {
        var App;

        App = $resource('api/app', null, null);
        return App;
    });

})();
