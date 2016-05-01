app.factory('App', ['$resource', function ($resource) {
    var App, actions;

    actions = {
        login: {
            method: 'POST',
            url: 'api/login',
            isArray: false
        },
        infos: {
            method: 'GET',
            url: 'api/app',
            isArray: false
        },
    };

    return Login = $resource('api', null, actions);
}]);
