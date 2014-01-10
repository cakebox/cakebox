app.directive('webplayer', ["$location", function ($location) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '@',
      url: '@',
      height: '@',
      width: '@'
    },
    templateUrl: "partials/webplayer.html",
    compile: function(elem, attrs, transcludeFn) {
      return function link (scope, element, attrs) {

        attrs.$observe('url', function(url) {
            if (url) {
                scope.url = $location.protocol() + "://" + $location.host() +  url;
            }
        });

      };
    }
  };

}]);
