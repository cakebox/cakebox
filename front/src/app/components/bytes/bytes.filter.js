(function() {
    'use strict';

    angular.module('cakebox')
    .filter('bytes', function() {
        return function(bytes, precision) {
            var units = ['bytes', 'kb', 'Mb', 'Gb', 'Tb', 'Pb'],
                pow = 0;

            if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '0 ' + units[0];
            }

            if (angular.isUndefined(precision)) {
                precision = 1;
            }

            pow = Math.floor(Math.log(bytes) / Math.log(1024));

            if (pow === 0) {
                precision = 0;
            }

            return (bytes / Math.pow(1024, Math.floor(pow))).toFixed(precision) + ' ' + units[pow];
        };
    });

})();
