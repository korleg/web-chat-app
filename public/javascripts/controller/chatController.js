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
   $scope.loadingMessages = false;
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

   socket.on('receiveMessage', (data) => {
      $scope.messages[data.roomId].push({
         userId: data.userId,
         username: data.username,
         surname: data.surname,
         message: data.message
      });
      $scope.$apply();

   });

   $scope.newMessage = () => {
      if ($scope.message !== '') {
         socket.emit('newMessage', {
            message: $scope.message, //clientte fonksiyon tetiklendiğinde gelen mesaj message değişkenine tanımlanır,
            roomId: $scope.roomId  // odaya girildiğinde alınan room bilgisi ile birlikte server'a emit edilir.
         });

         $scope.messages[$scope.roomId].push({
            userId: $scope.user._id,
            username: $scope.user.name,
            surname: $scope.user.surname,
            message: $scope.message
         });

         $scope.message = "";
      }
      
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

      if (!$scope.messages.hasOwnProperty(room.id)) {
         $scope.loadingMessages = true;


         chatFactory.getMessages(room.id).then( (data) => {
            $scope.messages[room.id] = data;
            $scope.loadingMessages = false;
         })
      }

      
   };
   $scope.changeTab = tab => {
      $scope.activeTab = tab;
   }
  

   
}]);