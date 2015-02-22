'use strict';

angular.module('cakebox')
.factory('File', function ($resource) {
    var File, actions;

    actions = {
        delete: {
            method: 'DELETE',
            url: 'api/files',
            isArray: true
        }
    };

    return File = $resource('api/files', null, actions);
});
