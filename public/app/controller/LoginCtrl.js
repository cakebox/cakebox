app.controller('LoginCtrl', function($scope, $location, App, Auth, Rights) {

    $scope.user = [];
    $scope.user.username = "";
    $scope.user.password = "";

    $scope.loginUser = function(user) {
        App.login({ username: user.username, 'password': CryptoJS.SHA256(user.password).toString() }, function(data, status) {
            console.log($scope.rights);
            Auth.setUser(user.username); //Update the state of the user in the app
        }, function(data) {
            console.log(data)
        });
    }
});
