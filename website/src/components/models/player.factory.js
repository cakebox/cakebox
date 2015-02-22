'use strict';

angular.module('cakebox')
.factory('Player', function ($resource) {
    var Player;

    return Player = $resource('api/player', null, null);
});
