'use strict';

angular.module('cakebox')
.factory('Rights', function ($resource) {
    var Rights;

    return Rights = $resource('api/rights', null, null);
});
