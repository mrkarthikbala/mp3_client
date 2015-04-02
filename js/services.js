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
        }
        Users.getUser = function(id){
                return $http.get(baseUrl + '/api/users' + id);
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
        return Tasks;
    });
    //if you can't work this try a service
    
