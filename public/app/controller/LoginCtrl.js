app.controller('LoginCtrl', function($scope, $location, App) {

    $scope.user = [];
    $scope.user.username = "";
    $scope.user.password = "";

    $scope.loginUser = function(user) {
        console.log(user);
        App.login({ username: user.username, 'password': CryptoJS.SHA256(user.password).toString() }, function(data, status) {
            $location.path('/');
        }, function(data) {
            console.log(data)
        });
    }
});
