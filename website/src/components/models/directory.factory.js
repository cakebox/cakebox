'use strict';

angular.module('cakebox')
.factory('Directory', function ($resource) {
    var Directory, actions;

    actions = {
        archive: {
            method: 'GET',
            url: 'api/directories/archive',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            url: 'api/directories',
            isArray: true
        }
    };

    return Directory = $resource('api/directories', null, actions);
});
