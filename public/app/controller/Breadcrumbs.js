app.factory('breadcrumbs', function($rootScope, $location, $routeParams) {
    var breadcrumbs = [];
    var breadcrumbsService = {};

    var loadBreadcrumbs = function(event, current) {

        if (angular.isUndefined($routeParams.path))
            $routeParams.path = "";

        var path = '/' + $routeParams.path;
        var pathElements = path.split('/'), result = [], i;
        var breadcrumbPath = function (index) {
            return '/' + (pathElements.slice(0, index + 1)).join('/');
        };

        result.push({name: ".", path: "/"});
        pathElements.shift();
        for (i=0; i<pathElements.length; i++) {
            result.push({name: pathElements[i], path: breadcrumbPath(i)});
        }

        breadcrumbs = result;
    };

    //we want to update breadcrumbs only when a route is actually changed
    //as $location.path() will get updated imediatelly (even if route change fails!)
    $rootScope.$on('$routeChangeSuccess', loadBreadcrumbs);
    loadBreadcrumbs();

    breadcrumbsService.getAll = function() {
        return breadcrumbs;
    };

    breadcrumbsService.getFirst = function() {
        return breadcrumbs[0] || {};
    };

    breadcrumbsService.getLast = function() {
        return breadcrumbs[breadcrumbs.length - 1] || {};
    };

    return breadcrumbsService;
});
