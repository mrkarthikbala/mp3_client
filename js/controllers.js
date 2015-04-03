
var taskManagerControllers = angular.module('taskManagerControllers', []);

taskManagerControllers.controller('UserController', ['$scope','$http', 'Users', function($scope, $http, Users){

  $scope.newUserName = "Username";
  $scope.newUserEmail = "Email";

  $scope.getUsers = function(id){
    Users.getUsers("?select={\"name\": 1, \"email\": 1, \"_id\": 1 }").success(function(data){
    $scope.users = data.data;
    });
  };

  $scope.deleteUser = function(id){
    Users.deleteUser(id).success(function(data){
      $scope.getUsers();
    });
  };

  $scope.addUser = function(){
      if ($scope.newUserName == "Username" || $scope.newUserEmail == "Email"){
        alert("Please enter a valid username and email");
        return;
      }
      Users.postUser({"name":$scope.newUserName, "email": $scope.newUserEmail}).success(function(data){
      alert("User " + data.data.name  + " has been added!");
    }).error(function(data){
      alert("Please enter a different email.");
    });
  }

   $scope.getUsers();
}]);


taskManagerControllers.controller('TaskController', ['$scope', '$http', 'Tasks', function($scope, $http, Tasks){
  $scope.skip=0;
  $scope.newTaskName = "Name";

  $scope.addTask = function(){
    if ($scope.newTaskName == "Name"){
      alert("Please enter a valid task name");
      return;
    }
    Tasks.postTask({"name" : $scope.newTaskName, "description": $scope.newTaskDescription, "deadline" : $scope.newTaskDeadline}).success(function(data){
      alert("Posted.");
    });
  }
  $scope.getNext = function(num){
    $scope.skip += num;
    if ($scope.skip < 0) $scope.skip = 0;
    $scope.getTasks();
  }
  //where={completed:"+ false+ "}&
  $scope.getTasks = function(id){
    Tasks.getTasks("?select={\"name\": 1, \"assignedUserName\": 1 }&skip="+ $scope.skip + "&limit=10").success(function(data){
      $scope.tasks = data.data;
    });
  };
  $scope.deleteTask = function(id){
    Tasks.deleteTask(id).success(function(id){
      $scope.getTasks();
    });
  };

  $scope.getTasks();
}]);
taskManagerControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


