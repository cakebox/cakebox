app.directive('webplayer', ["$location", function ($location) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      playertype: '@',
      url: '@',
      height: '@',
      width: '@',
      type: '@'
    },
    template: "<div class='video'></div>",
    link: function (scope, element, attrs) {

        var $_current = element;

        attrs.$observe('url', function(url) {

            if (url) {

                scope.url = $location.protocol() + "://" + $location.host() +  url;

                var $_clone = element.clone(),
                    content = '';

                if (scope.playertype == "HTML5") {
                    content += '<video src="' + scope.url + '" type="' + scope.type + '" controls></video>'; 
                }
                else if (scope.playertype == "DIVX") {
                    content += '<object classid="clsid:67DABFBF-D0AB-41fa-9C46-CC0F21721616" width="' + scope.width + '" height="' + scope.height + '" codebase="http://go.divx.com/plugin/DivXBrowserPlugin.cab">';
                    content += '<param name="custommode" value="none" />';
                    content += '<param name="autoPlay" value="false" />';
                    content += '<param name="src" value="' + scope.url  + '" />';
                    content += '<embed type="video/divx" src="' + scope.url  + '" width="' + scope.width + '" height="' + scope.height + '" autoPlay="false" custommode="none" pluginspage="http://go.divx.com/plugin/download/" />';
                    content += '</object>';
                }
                else if (scope.playertype == "VLC") {
                    content += '<embed type="application/x-vlc-plugin" target="' + scope.url + '" width="' + scope.width + '" height="' + scope.height + '"  autoplay="no" pluginspage="http://www.videolan.org" />';
                }

                $_current.replaceWith($_clone.html(content));
                $_current = $_clone;
            }

        }, true);
    }
  }
}]);
