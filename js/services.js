// js/services/todos.js
angular.module('taskManagerServices', [])
        .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;                
            }
        }
    })
    .factory('Users', function($http, $window) {      
        var baseUrl = $window.sessionStorage.baseurl;
        var Users = {};
        Users.getUsers = function(paramString) {
                return $http.get(baseUrl+'/api/users' + paramString);
            }
        Users.postUser = function(user){

            return $http.post(baseUrl + '/api/users' ,user);
        };
        Users.getUser = function(id){
                return $http.get(baseUrl + '/api/users/' + id);
        }
        Users.updateUser = function(user){
            return $http.put(baseUrl + '/api/users/' + user._id, user);
        }
        Users.deleteUser = function(id){
                return $http.delete(baseUrl + '/api/users/' + id);
        }
        return Users;
        
    })
    .factory('Tasks', function($http, $window) {      
        var baseUrl = $window.sessionStorage.baseurl;
        var Tasks = {};
        Tasks.getTasks = function(paramString){
            return $http.get(baseUrl + '/api/tasks' + paramString);
        }
        Tasks.postTask = function(task){
      
            return $http.post(baseUrl + '/api/tasks', task);
        };
        Tasks.updateTask = function(task){
            return $http.put(baseUrl + '/api/tasks/' + task._id, task);
        }
        Tasks.deleteTask = function(id){
            return $http.delete(baseUrl + '/api/tasks/' + id);
        }
        return Tasks;
    });
    //if you can't work this try a service
    
