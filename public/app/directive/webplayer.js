app.directive('webplayer', ["$location",
    function ($location) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                player: '@',
                url: '@',
                mimetype: '@',
                autoplay: '@'
            },
            template: "<div class='video'></div>",
            link: function (scope, element, attrs) {
                var $_current = element;

                var action = function(data) {
                    if (data.url) {
                        scope.url = $location.protocol() + "://" + $location.host() + ":" + $location.port() + data.url;

                        var handleNextPlay = function(event) {
                            if (jQuery("input[name='autoplay']").val() != 1 || !jQuery("a[ng-show='nextplay']").length) {
                                return;
                            }

                            event = parseInt(event);
                            
                            /**
                             * If its Divx player we have to check if the event is 2 for end of playing
                             */
                            if (isNaN(event) || event === 2) {
                                window.location.href = jQuery("a[ng-show='nextplay']").attr("href") + "?autoplay=1";
                            }
                        };

                        var $_clone = element.clone(),
                            content = '';

                        if (scope.player == "html5") {
                            content = '<video id="html5" src="' + scope.url + '" type="' + scope.mimetype + '" controls '+(scope.autoplay ? 'autoplay' : '')+'></video>';
                        }
                        else if (scope.player == "divx") {
                            content = '<object id="divx" classid="clsid:67DABFBF-D0AB-41fa-9C46-CC0F21721616" codebase="http://go.divx.com/plugin/DivXBrowserPlugin.cab">';
                            content += '<param name="custommode" value="none" />';
                            content += '<param name="autoPlay" value="' + scope.autoplay  + '" />';
                            content += '<param name="src" value="' + scope.url  + '" />';
                            content += '<param name="statusCallback" value="statusCallbackSink" />';
                            content += '<embed id="divx_plugin" type="video/divx" src="' + scope.url  + '" width="100%" height="100%" autoPlay="' + scope.autoplay  + '" custommode="none" pluginspage="http://go.divx.com/plugin/download/" statusCallback="statusCallbackSink" />';
                            content += '</object>';
                            content += '<script type="text/javascript">';
                            content += 'var statusCallbackSink = ' + eval(handleNextPlay);
                            content += '</script>';
                        }
                        else if (scope.player == "vlc") {
                            content = '<embed id="vlc" type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2" target="' + scope.url + '" autoplay="' + scope.autoplay  + '" pluginspage="http://www.videolan.org"></embed>';
                        }

                        $_current.replaceWith($_clone.html(content));
                        $_current = $_clone;

                        if (scope.player == "html5") {
                            document.getElementById("html5").addEventListener("ended", handleNextPlay, false);
                        }
                        else if (scope.player == "vlc") {
                            document.getElementById("vlc").addEventListener("MediaPlayerEndReached", handleNextPlay, false);
                        }
                    }
                }

                scope.$watch(function () {
                    return {'player': attrs.player, 'url': attrs.url};
                }, action, true);
            }
        }
    }
]);
