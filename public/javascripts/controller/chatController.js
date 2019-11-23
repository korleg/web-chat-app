app.controller('chatController', ['$scope','chatFactory','userFactory', ($scope, chatFactory, userFactory) => {

   //initialization
   function init () {
      userFactory.getUser().then((user) => {
         $scope.user = user;
      })
   }
   init();

   //angular veriables
   $scope.activeTab = 1;
   $scope.onlineList = [];
   $scope.roomList = [];
   $scope.roomId = "";
   $scope.chatClicked = false;
   $scope.chatName = "";
   $scope.message = "";
   $scope.messages = [];

   $scope.user = {};

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
      console.log($scope.user)
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
      chatFactory.getMessages(room.id).then( (data) => {
         $scope.messages[room.id] = data;
         console.log($scope.messages);
      })
   };
   $scope.changeTab = tab => {
      $scope.activeTab = tab;
   }
  

   
}]);