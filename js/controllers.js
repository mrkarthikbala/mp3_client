
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
      var a = $scope.newUserName;
      var b = $scope.newUserEmail;
      var obj = {"name":a, "email": b};
      Users.postUser(obj).success(function(data){
      alert("User " + data.data.name  + " has been added!");
    }).error(function(data){
      alert("Please enter a different email.");
    });
  }

   $scope.getUsers();
}]);


taskManagerControllers.controller('UserDetailController', ['$scope', '$routeParams', '$http', 'Users','Tasks', function($scope, $routeParams, $http, Users,Tasks){

    Users.getUser($routeParams.id).success(function(data){
      $scope.user = data.data;

      //SHOULD BE QUERYING TASKS WHERE username = my name

      var hardQuotes = "";
      for (var i = 0; i < $scope.user.pendingTasks.length; i++){
        hardQuotes += "\"" + $scope.user.pendingTasks[i] + "\",";
      }
      //edge case no pending tasks
      var query = '?where={\"_id\": {\"$in\": ['+hardQuotes.substring(0, hardQuotes.length-1)+
      '] }}';
      
     Tasks.getTasks(query).success(function(data){
         $scope.pendingTasks = data.data;
    });
    });
  
    $scope.markCompleted = function(id){
        var task;
        for (var i = 0; i < $scope.pendingTasks.length; i++){
          if ($scope.pendingTasks[i]._id === id){
            task = $scope.pendingTasks[i];
            task.completed = true;
            $scope.pendingTasks.splice(i, 1);
          }
        }
        Tasks.updateTask(task).success(function(){
          alert("Good job!");
        });
        var user = $scope.user;
        for (var i = 0; i < user.pendingTasks.length; i++){
          if (user.pendingTasks[i] == id){
           user.pendingTasks.splice(i, 1);
           alert("hi");}
        }
        Users.updateUser(user);

    };

    $scope.loadCompletedTasks = function(name){
      //SELECT * FrOM TASKS WHERE assignedUserName = name
      Tasks.getTasks("?where={\"assignedUserName\":" +"\""+ name + "\""+"}").success(function(data){
        $scope.completedTasks = data.data;
      });

    };

}]);

taskManagerControllers.controller('TaskDetailController', ['$scope', '$routeParams', '$http', 'Users','Tasks', function($scope, $routeParams, $http, Users,Tasks){
  var completionButton = function(){
    if ($scope.task.completed == true){
      $scope.Complete = "Mark Uncompleted";
    }
    else {
      $scope.Complete = "Mark Completed";
    }
  }
  Tasks.getTask($routeParams.id).success(function(data){
    $scope.task = data.data;
    completionButton();
  });

  $scope.changeCompletionStatus = function(){
    $scope.task.completed = !($scope.task.completed);
    completionButton();
    Tasks.updateTask($scope.task);
  };
}]);
taskManagerControllers.controller('TaskController', ['$scope', '$http', 'Tasks', function($scope, $http, Tasks){
  $scope.skip=0;
  $scope.newTaskName = "Name";
  $scope.completed="pending";

    $scope.$watch('completed', function() {
       $scope.getTasks();
   });
  var whichTasks = function(){  //returns query based on value of $scope.completed

    if ($scope.completed ==="pending"){
      return "?where={\"completed\": false}&select={\"name\": 1, \"assignedUserName\": 1 }&skip="+ $scope.skip + "&limit=10";
    } 
    if ($scope.completed ==="completed"){
      return "?where={\"completed\": true}&select={\"name\": 1, \"assignedUserName\": 1 }&skip="+ $scope.skip + "&limit=10";
    }
    return "?select={\"name\": 1, \"assignedUserName\": 1 }&skip="+ $scope.skip + "&limit=10";
  };

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
    var query = whichTasks();
    Tasks.getTasks(query).success(function(data){
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


