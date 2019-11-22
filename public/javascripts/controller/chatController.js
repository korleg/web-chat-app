app.controller('chatController', ['$scope', ($scope) => {

   //angular veriables
   $scope.activeTab = 1;
   $scope.onlineList = [];
   $scope.roomList = [];
   $scope.chatClicked = false;
   $scope.chatName = "";

   //socket.io event handling.
   const socket = io.connect("http://localhost:3000")
   socket.on('onlineList', (users) => {
      $scope.onlineList = users;
      $scope.$apply();
   });

   socket.on('roomList', rooms => {
      $scope.roomList = rooms;
      $scope.$apply();
   });
  
   $scope.newRoom = () => {
      // let randomName = Math.random().toString(36).substring(7);

      let roomName = window.prompt("Enter Room Name");
      if (roomName !== '' && roomName !== null) {
         socket.emit('newRoom', roomName);
      }
      
   };

   $scope.switchRoom = (room) => {
      $scope.chatName = room.roomName;
      $scope.chatClicked= true;
   };
   $scope.changeTab = tab => {
      $scope.activeTab = tab;
   }
  

   
}]);