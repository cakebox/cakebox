(function() {
    'use strict';

    angular
        .module('cakebox')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $translate, App) {

        $rootScope.search = {
            text: ''
        };
        $rootScope.sortOptions = {
            sortBy: '',
            reverse: false
        };

        App.get().$promise
            .then(function(data) {
                $rootScope.rights = data.rights;
                $translate.use(data.language);

                if (data.version.local !== data.version.remote) {
                    alertify.log('Cakebox-light ' + data.version.remote + $translate.instant('NOTIFICATIONS.AVAILABLE'), 'success', 10000);
                }
            });

        $rootScope.$on('$locationChangeSuccess',function(event, newurl, oldurl) {
            $rootScope.previouspage = oldurl;
        });
    }

})();
