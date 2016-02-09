(function() {
    'use strict';

    angular
        .module('cakebox')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope) {
        $rootScope.search = {
            text: ''
        };
        $rootScope.sortOptions = {
            sortBy: '',
            reverse: false
        };

        $rootScope.$on('$locationChangeSuccess',function(event, newurl, oldurl) {
            $rootScope.previouspage = oldurl;
        });
    }

})();
