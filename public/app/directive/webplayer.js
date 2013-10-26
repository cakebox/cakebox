app.directive('webplayer', function () {

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      video: '@',
      type: '@',
      width: '@',
      height: '@',
      preload: '@'
    },
    templateUrl: "partials/webplayer.html",
    compile: function(elem, attrs, transcludeFn) {
      return function link (scope, element, attrs) {
        // Prevent error when the  player connect source before scope.channel unready. (e.g. When ng-view)
        scope.$watch('video + type', function(video) {
          if (attrs.video && attrs.type)
            element.children().prepend('<source src="' + attrs.video + '" type="' + attrs.type + '" />');
        });
      };
    }
  };

});
