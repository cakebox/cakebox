app.directive('webplayer', function () {

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      video: '@',
      type: '@'
    },
    templateUrl: "partials/video.html",
    compile: function(elem, attrs, transcludeFn) {
      return function link (scope, element, attrs) {
        // Prevent error when the  player connect source before scope.channel unready. (e.g. When ng-view)
        scope.$watch('video', 'type', function(video, type) {
          element.append('<param name="src" value="' + video + '" />');
          element.append('<embed type="' + type + '" src="' + video + '" custommode="none" height="' + attrs.height + '" width="' + attrs.width + '" autoPlay="false"  pluginspage="http://go.divx.com/plugin/download/"></embed>');
        });
      };
    }
  };

});
