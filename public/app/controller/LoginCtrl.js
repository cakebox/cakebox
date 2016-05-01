app.controller('LoginCtrl', function($scope, App) {

    $scope.user = [];
    $scope.user.username = "";
    $scope.user.password = "";

    $scope.loginUser = function(user) {
        console.log(user);
        App.login({ username: user.username, 'password': user.password }, function(data, status) {
            console.log(data)
        });
    }
});
