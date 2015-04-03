//add '720kb.datepicker'
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
  when('/addTask',{
    templateUrl: 'partials/addTask.html',
    controller: 'TaskController'
  }).
  when('/taskDetails:id', {
    templateUrl: 'partials/taskDetails.html',
    controller: 'TaskController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);