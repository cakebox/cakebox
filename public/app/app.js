var app = angular.module('cakebox',  [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ngClipboard',
    'pascalprecht.translate'
]);

app.config(['$routeProvider', '$translateProvider',

    function($routeProvider, $translateProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/browse/', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/browse/:path*', {
            templateUrl: 'partials/browse.html',
            controller:  'BrowseCtrl'
        }).
        when('/play/:path*', {
            templateUrl: 'partials/play.html',
            controller:  'MediaCtrl'
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
        otherwise({
            redirectTo: '/'
        });

        $translateProvider.useStaticFilesLoader({
            prefix: 'ressources/languages/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('fr');
    }
]);

function isCharacterKeyPress(evt) {
	if (typeof evt.which == "undefined") {
		// This is IE, which only fires keypress events for printable keys
		return true;
	} else if (typeof evt.which == "number" && evt.which > 0) {
		// In other browsers except old versions of WebKit, evt.which is
		// only greater than zero if the keypress is a printable key.
		// We need to filter out backspace and ctrl/alt/meta key combinations
		return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
	}
	return false;
}
document.addEventListener("keypress", function(evt){
	evt = evt || window.event;
	if(isCharacterKeyPress(evt) && document.activeElement == document.body){
		$('form input').focus().val('');
	}
});
