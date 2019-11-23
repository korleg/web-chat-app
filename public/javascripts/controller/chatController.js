app.controller('chatController', ['$scope', ($scope) => {

   //angular veriables
   $scope.activeTab = 1;
   $scope.onlineList = [];
   $scope.roomList = [];
   $scope.roomId = "";
   $scope.chatClicked = false;
   $scope.chatName = "";
   $scope.message = "";

   //socket.io event handling.
   const socket = io.connect("http://localhost:3000")
   socket.on('onlineList', (users) => {
      $scope.onlineList = users;
      $scope.$apply();
   });

   $scope.newMessage = () => {
      socket.emit('newMessage', {
         message: $scope.message, //clientte fonksiyon tetiklendiğinde gelen mesaj message değişkenine tanımlanır,
         roomId: $scope.roomId  // odaya girildiğinde alınan room bilgisi ile birlikte server'a emit edilir.
      });
      $scope.message = "";
   };

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
      $scope.roomId = room.id;
      $scope.chatName = room.name;
      $scope.chatClicked= true;
   };
   $scope.changeTab = tab => {
      $scope.activeTab = tab;
   }
  

   
}]);