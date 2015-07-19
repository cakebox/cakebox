(function() {
    'use strict';

    angular.module('cakebox')
    .factory('Rights', function ($resource) {
        var Rights;

        Rights = $resource('api/rights', null, null);
        return Rights;
    });

})();
