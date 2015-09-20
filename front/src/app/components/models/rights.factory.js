(function() {
    'use strict';

    angular.module('cakebox')
    .factory('Rights', function ($resource, BACKEND_URL) {
        var Rights;

        Rights = $resource(BACKEND_URL + '/rights', null, null);
        return Rights;
    });

})();
