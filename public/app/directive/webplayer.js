app.directive('webplayer', ["$location", function ($location) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      url: '@',
    },
    template: '<embed ng-src="{{ url }}" type="video/divx" pluginspage="http://go.divx.com/plugin/download/"></embed>',        
    compile: function(elem, attrs, transcludeFn) {
      return function link (scope, element, attrs) {

        attrs.$observe('url', function(url) {
              scope.url = $location.protocol() + "://" + $location.host() +  url;
        });

      };
    }
  };

}]);
