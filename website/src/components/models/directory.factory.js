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

    Directory = $resource('api/directories', null, actions);
    return Directory;
});
