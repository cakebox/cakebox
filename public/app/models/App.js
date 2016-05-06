app.factory('App', ['$resource', function ($resource) {
    var App, actions;

    actions = {
        login: {
            method: 'GET', //not in POST because SILEX is the worst backend ever
            url: 'api/login'
        },
        infos: {
            method: 'GET',
            url: 'api/app'
        },
        cookie: {
            method: 'GET',
            url: 'api/cookie'
        },
        disconnect: {
            method: 'GET',
            url: 'api/disconnect'
        }
    };

    return Login = $resource('api', null, actions);
}]);
