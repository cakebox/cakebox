(function() {
    'use strict';

    angular.module('cakebox')
    .filter('bytes', function() {
        return function(bytes, precision) {
            var units = ['o', 'ko', 'Mo', 'Go', 'To', 'Po'],
                number = 0;

            if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '0 ' + units[0];
            }

            if (angular.isUndefined(precision)) {
                precision = 1;
            }

            number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };
    });

})();
