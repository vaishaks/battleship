/// <reference path="scripts/typings/angularjs/angular.d.ts" />
var battleshipApp = angular.module('battleshipApp', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when('/floor', { templateUrl: 'floor.html', controller: 'FloorCtrl' }).otherwise({ redirectTo: 'floor.html' });
}).controller('FloorCtrl', function ($scope) {
});
//# sourceMappingURL=app.js.map
