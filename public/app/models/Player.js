app.factory('Player', ['$resource', function ($resource) {
    var Player;

    return Player = $resource('api/player/settings', null, null);
}]);
