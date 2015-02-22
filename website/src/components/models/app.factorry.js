'use strict';

angular.module('cakebox')
.factory('App', function ($resource) {
    var App;

    return App = $resource('api/app', null, null);
});
