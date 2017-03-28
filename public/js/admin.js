ravadaApp.directive("solShowMachine", swMach)
        .controller("machinesPage", machinesPageC)
        .controller("usersPage", usersPageC)
        .controller("messagesPage", messagesPageC)
        .controller("notifCrtl", notifCrtl)

  function swMach() {
    return {
      restrict: "E",
      templateUrl: '/ng-templates/admin_machine.html',
    };
  };

  function machinesPageC($scope, $http, $interval, request, listMach) {
    $http.get('/pingbackend.json').then(function(response) {
      $scope.pingbe_fail = !response.data;
    });
    $scope.getMachines = function() {
      $http.get("/list_machines.json").then(function(response) {
        $scope.list_machines= response.data;
      });
    };
    $scope.orderParam = ['none'];
    $scope.orderMachineList = function(type1,type2){
      if ($scope.orderParam[0] === '-'+type1)
        $scope.orderParam = ['none'];
      else if ($scope.orderParam[0] === type1 )
        $scope.orderParam = ['-'+type1,type2];
      else $scope.orderParam = [type1,'-'+type2];
    }
    $scope.hide_clones = true;
    $scope.hideClones = function(){
      $scope.hide_clones = !$scope.hide_clones;
    }
    $scope.action = function(target,action,machineId){
      $http.get('/'+target+'/'+action+'/'+machineId+'.json');
    };
    $scope.set_public = function(machineId, value) {
      $http.get("/machine/public/"+machineId+"/"+value);
    };

    //On load code
    $scope.rename= {new_name: 'new_name'};
    $scope.show_rename = false;
    $scope.new_name_duplicated=false;
    $scope.getMachines();
    $interval($scope.getMachines,3000);
  };

  function usersPageC($scope, $http, $interval, request) {
    $http.get('/pingbackend.json').then(function(response) {
      $scope.pingbe_fail = !response.data;
    });
    $scope.getUsers = function() {
      $http.get('/list_users.json').then(function(response) {
        $scope.list_users= response.data;
      });
    }
    $scope.action = function(target,action,machineId){
      $http.get('/'+target+'/'+action+'/'+machineId+'.json');
    };
    //On load code
    $scope.getUsers();
    $scope.updatePromise = $interval($scope.getUsers,3000);
  };

  function messagesPageC($scope, $http, $interval, request) {
    $http.get('/pingbackend.json').then(function(response) {
      $scope.pingbe_fail = !response.data;
    });
    $scope.getMessages = function() {
      $http.get('/messages.json').then(function(response) {
        $scope.list_message= response.data;
      });
    }
    $scope.updateMessages = function() {
      $http.get('/messages.json').then(function(response) {
        for (var i=0, iLength = response.data.length; i<iLength; i++){
          if (response.data[0].id != $scope.list_message[i].id){
            $scope.list_message.splice(i,0,response.data.shift());
          }
          else{break;}
        }
      });
    }
    $scope.asRead = function(messId){
        var toGet = '/messages/read/'+messId+'.json';
        $http.get(toGet);
    };
    $scope.asUnread = function(messId){
        var toGet = '/messages/unread/'+messId+'.json';
        $http.get(toGet);
    };
    //On load code
    $scope.getMessages();
    $scope.updatePromise = $interval($scope.updateMessages,3000);
  };

  function notifCrtl($scope, $interval, $http, request){
    $scope.getAlerts = function() {
      $http.get('/unshown_messages.json').then(function(response) {
              $scope.alerts= response.data;
      });
    };
    $interval($scope.getAlerts,10000);
    $scope.closeAlert = function(index) {
      var message = $scope.alerts.splice(index, 1);
      var toGet = '/messages/read/'+message[0].id+'.html';
      $http.get(toGet);
    };
  }
