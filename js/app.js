
var taskManagerApp = angular.module('taskManagerApp', ['ngRoute', 'taskManagerControllers', 'taskManagerServices']);
taskManagerApp.config(['$routeProvider', function($routeProvider){
  $routeProvider.
  when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UserController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TaskController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/addUser', {
    templateUrl: 'partials/addNewUser.html',
    controller: 'UserController'
  }).
  when('/userDetails:id',{
    templateUrl: 'partials/userDetails.html',
    controller: 'UserController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);