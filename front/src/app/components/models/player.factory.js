(function() {
    'use strict';

    angular.module('cakebox')
    .factory('Player', function ($resource, BACKEND_URL) {
        var Player;

        Player = $resource(BACKEND_URL + '/player', null, null);
        return Player;
    });

})();
