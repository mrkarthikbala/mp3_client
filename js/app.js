//add '720kb.datepicker' into list?
var taskManagerApp = angular.module('taskManagerApp', ['ngRoute', 'taskManagerControllers', 'taskManagerServices', '720kb.datepicker']);

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
    controller: 'UserDetailController'
  }).
  when('/addTask',{
    templateUrl: 'partials/addTask.html',
    controller: 'TaskController'
  }).
  when('/editTask:id', {
    templateUrl: 'partials/editTask.html',
    controller: 'TaskDetailController'
  }).
  when('/taskDetails:id', {
    templateUrl: 'partials/taskDetails.html',
    controller: 'TaskDetailController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);