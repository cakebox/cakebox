'use strict';

angular.module('cakebox')
.factory('Player', function ($resource) {
    var Player;

    Player = $resource('api/player', null, null);
    return Player;
});
