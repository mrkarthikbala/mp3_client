
var taskManagerControllers = angular.module('taskManagerControllers', []);
 

taskManagerControllers.controller('UserController', ['$scope','$http', 'Users', 'Tasks', function($scope, $http, Users, Tasks){

  $scope.newUserName = "Username";
  $scope.newUserEmail = "Email";

  $scope.getUsers = function(id){
    Users.getUsers("?select={\"name\": 1, \"email\": 1, \"_id\": 1 }").success(function(data){
    $scope.users = data.data;
    });
  };

  $scope.deleteUser = function(id,name){
  

    Tasks.getTasks("?where={\"assignedUser\": \"" + id + "\", \"assignedUserName\": \"" + name + "\"}").success(function(data){
        for (var i = 0; i < data.data.length; i++){
          data.data[i].assignedUser = "";
          data.data[i].assignedUserName = "unassigned";
          Tasks.updateTask(data.data[i]);
        }
    });

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

    Tasks.getTasks("?where={\"assignedUser\": \"" + $scope.user._id + "\", \"completed\": false}").success(function(data){
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
           user.pendingTasks.splice(i, 1);}
        }
        Users.updateUser(user);
        $scope.loadCompletedTasks($scope.user.name);
    };

    $scope.loadCompletedTasks = function(name){
      Tasks.getTasks("?where={\"assignedUserName\":" +"\""+ name + "\""+", \"completed\": true}").success(function(data){
        $scope.completedTasks = data.data;
      });

    };

}]);

taskManagerControllers.controller('TaskDetailController', ['$scope', '$routeParams', '$http', 'Users','Tasks', function($scope, $routeParams, $http, Users,Tasks){
  //get possible assigned users
   Users.getUsers("?select={\"name\": 1, \"_id\": 1}").success(function(data){
      $scope.possibleAssignedUsers = data.data;
      $scope.possibleAssignedUsers.unshift({name: "Unassigned"});
    });


  $scope.submit = function(){
    if ($scope.assigned){
      $scope.task.assignedUser = $scope.assigned._id;
      $scope.task.assignedUserName = $scope.assigned.name;
    }
    Tasks.updateTask($scope.task);

  }
  var completionButton = function(){
    if ($scope.task.completed == true){
      $scope.Complete = "Mark Uncompleted";
      $scope.completed = "Yes";
    }
    else {
      $scope.Complete = "Mark Completed";
      $scope.completed = "No";
    }

  }
  Tasks.getTask($routeParams.id).success(function(data){
    $scope.task = data.data;
    if ($scope.task.completed == true){
      $scope.completed ="Yes";
    }
    else {
      $scope.completed = "No";
    }
    completionButton();
  });

  $scope.changeCompletionStatus = function(){
    $scope.task.completed = !($scope.task.completed);
    completionButton();
    Tasks.updateTask($scope.task);
  };
}]);
taskManagerControllers.controller('TaskController', ['$scope', '$http','Users', 'Tasks', function($scope, $http, Users, Tasks){
  $scope.skip=0;
  $scope.newTaskName = "Name";
  $scope.completed="pending";
  $scope.sortBy = "sortByName";
  $scope.ascendingOrder = "true";

   
    $scope.$watchGroup(['ascendingOrder','sortBy', 'completed'], function() {
       $scope.getTasks();
   });
  var whatToSortBy = function(){
    var asc;
    if ($scope.ascendingOrder === "true") asc = 1;
    else asc = -1;

    if ($scope.sortBy ==="sortByName"){
      return "&sort={\"name\": "+ asc+"}";
    }
    else if ($scope.sortBy === "sortByUserName"){
      return "&sort={\"assignedUserName\": " + asc + "}";
    }
    else if ($scope.sortBy ==="sortByDateCreated"){
      return "&sort={\"dateCreated\":"+ asc+"}";
    }
    else return "&sort={\"deadline\": "+asc+"}";
  };

  var whichTasks = function(){  //returns query based on value of $scope.completed
    var order = whatToSortBy();
    if ($scope.completed ==="pending"){
      if ($scope.was == "completed" || $scope.was == "all") $scope.skip = 0;
      return "?where={\"completed\": false}&select={\"name\": 1, \"assignedUserName\": 1 }"+ order + "&skip="+ $scope.skip + "&limit=10";
    } 
    if ($scope.completed ==="completed"){
      if ($scope.was == "pending" || $scope.was == "all") $scope.skip = 0;
      return "?where={\"completed\": true}&select={\"name\": 1, \"assignedUserName\": 1 }" + order + "&skip="+ $scope.skip + "&limit=10";
    }
    if ($scope.was == "pending" || $scope.was == "completed") $scope.skip = 0;
    return "?select={\"name\": 1, \"assignedUserName\": 1 }" + order + "&skip="+ $scope.skip + "&limit=10";
  };

//ADD NEW TASK
    //load users to assign task to
    Users.getUsers("?select={\"name\": 1, \"_id\": 1}").success(function(data){
      $scope.possibleAssignedUsers = data.data;
      $scope.possibleAssignedUsers.unshift({name: "Unassigned"});
    });

  $scope.addTask = function(){
    if ($scope.newTaskName == "Name"){
      alert("Please enter a valid task name");
      return;
    }
    //case assigned user is unassigned
    
    if ($scope.addAssignedUser.name == "Unassigned" || $scope.addAssignedUser == undefined){
      Tasks.postTask({"name" : $scope.newTaskName, "description": $scope.newTaskDescription, 
      "deadline" : $scope.newTaskDeadline, "completed" : false, "assignedUser" : "", "assignedUserName": "unassigned"
    }).success(function(data){
            alert("Task Added!");
    }).error(function(err){
      alert(err.message);
    });
    return;
  }
  //otherwise
    Tasks.postTask({"name" : $scope.newTaskName, "description": $scope.newTaskDescription, 
      "deadline" : $scope.newTaskDeadline, "completed" : false, "assignedUser" : $scope.addAssignedUser._id, "assignedUserName": $scope.addAssignedUser.name
    }).success(function(data){
        alert("Task Added!");

    }).error(function(err){
      alert(err.message);
    });

  }

  $scope.getNext = function(num){
    if ($scope.tasks.length < 10 && num > 0) return;
    $scope.skip += num;
    if ($scope.skip < 0) $scope.skip = 0;
    $scope.was = $scope.completed;
    $scope.getTasks();
  }
  $scope.getTasks = function(id){
    var query = whichTasks();
    Tasks.getTasks(query).success(function(data){
      $scope.tasks = data.data;
    });
  };
  $scope.countTasks = function(){
    if ($scope.tasks.length < 10) return true;
    return false;
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


