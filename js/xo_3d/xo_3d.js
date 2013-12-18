var xo_3d = {};

(function(){
   // Model
   var model = {};
   
   model.dateField = [[0,0,0],[0,0,0],[0,0,0]];
   model.gameWinner = "undifined";
   
   function Users(){
      this.marker = "X"||"O";
      this.madeMoves = 0;
      this.ind = 1 || 2;
   };
   var users = model.users = {};
   users.user1 = new Users;
   users.user2 = new Users;
   users.user2.marker = "O";
   users.user2.ind = 2;
   
   model.whoHaveLessMoves = function(){
      
      var user1 = xo_3d.model.users.user1;
      var user2 = xo_3d.model.users.user2;
      var result = "none";
      if (user2.madeMoves < user1.madeMoves) {
         result = user2;
      }else{
         result = user1;
      };
      
      return result;
   };
   
   model.whoWent = function(){
      
      var user1 = xo_3d.model.users.user1;
      var user2 = xo_3d.model.users.user2;
      var whoWent = "none";
      if (user2.madeMoves >= user1.madeMoves) {
         whoWent = user2;
      }else{
         whoWent = user1;
      };
      return whoWent;
   };
   
   model.changeDateModel = function(user, coor){
      if(user.marker == "X"){
         xo_3d.model.dateField[coor.y][coor.x] = 1;
      }else{
         xo_3d.model.dateField[coor.y][coor.x] = 2;
      };
      user.madeMoves += 1;
   };
   model.getWinner = function(){
      var size = xo_3d.model.dateField.length;
      var state = xo_3d.model.dateField;
      var firstUser = xo_3d.model.users.user1.ind;
      var secondUser = xo_3d.model.users.user2.ind;
      var self = this;
      
      this.addTo = function(value, mode) {
         return (value === firstUser) ? self.usersState.first[mode]++ : (value === secondUser) ? self.usersState.second[mode]++ : false;
      };
      this.usersState = {
         first: {
            'v': 0, 
            'h': 0, 
            'ld': 0, 
            'rd': 0
         }, 
         second: {
            'v': 0, 
            'h': 0, 
            'ld': 0, 
            'rd': 0
         }
      };
      
      this.resetForHV = function() {
         self.usersState.first.h = 0;
         self.usersState.first.v = 0;
         self.usersState.second.h = 0;
         self.usersState.second.v = 0;
      };
      
      this.winerDeterminate = function(){
         var winner =  xo_3d.model.whoWent();
         
         xo_3d.model.gameWinner = winner;
         
         return winner;
      };
      
      for (var i = 0; i < size; i++) {
         self.resetForHV();
         for (var h = 0; h < size; h++) {
            /*horizontal calc*/
            self.addTo(state[i][h], 'h');
            /*vertical calc*/
            self.addTo(state[h][i], 'v');
            /*diagonals*/
            if (h === i) {
               /*left diagonal*/
               self.addTo(state[h][i], 'ld');
               /*right diagonal*/
               self.addTo(state[h][size - (h + 1)], 'rd');
            }
            if (self.usersState.first['v'] === size || self.usersState.second['v'] === size) {
               var winner = this.winerDeterminate();
               console.warn('V, winner: ',winner);
            }
            if (self.usersState.first['h'] === size || self.usersState.second['h'] === size) {
               var winner = this.winerDeterminate();
               console.warn('h, winner: ',winner);
            }
            if (self.usersState.first['ld'] === size || self.usersState.second['ld'] === size) {
               var winner = this.winerDeterminate();
               console.warn('lD, winner: ',winner);
            }
            if (self.usersState.first['rd'] === size || self.usersState.second['rd'] === size) {
               var winner = this.winerDeterminate();
               console.warn('rD, winner: ',winner);
            }
         }
      }
      return this.usersState;
   }
   
   xo_3d.model = model;
})();

(function(){
   //View
   var view = {}
   
   view.addMarker = function(classObjAdd, whoHaveLessMoves){
      $(classObjAdd).html('<div class="lable">'+whoHaveLessMoves.marker+'</div><div class="lable-3d">'+whoHaveLessMoves.marker+'</div><div class="lable-shadow">'+whoHaveLessMoves.marker+'</div>');
      xo_3d.view.displayActiveUser();
      xo_3d.view.victory();
   };
   
   view.displayActiveUser = function(){
      if(xo_3d.model.gameWinner == "undifined"){
         var actUser = xo_3d.model.whoHaveLessMoves();
         if (actUser.marker == "X") {
            $(".board-left").addClass("active");
            $(".board-right").removeClass("active");
         }else{
            $(".board-left").removeClass("active");
            $(".board-right").addClass("active");
         }
      }
   };
   
   view.victory = function(){
      if (xo_3d.model.gameWinner != "undifined") {
         if( xo_3d.model.gameWinner.ind == 1 ){
            $(".board-right").addClass("loser");
         }else{
            $(".board-left").addClass("loser");
         }
         $(".message").html('Victory!');
      }
   };
   
   xo_3d.view = view;
})();

(function(){
   //Controller
   var controller = {};
   
   controller.makeAMove = (function(){
      
      var ClickCellField = (function(){
         
         var cell = $(".cell-map");
         var dataField = xo_3d.model.dateField;
         var coor = {};
         var haveLessMoves = xo_3d.model.users.user1;
         var winner = "undifined";
         
         $.each(cell, function(){
            $(this).click(function(e){
               
               if (xo_3d.model.gameWinner == "undifined") {
                  coor.x = $(this).attr("coorX");
                  coor.y= $(this).attr("coorY");
               
                  if( dataField[coor.y][coor.x] == 0){
                     var coorCell = ".cell.c"+coor.y+coor.x;
                     haveLessMoves = xo_3d.model.whoHaveLessMoves();
                     xo_3d.model.changeDateModel(haveLessMoves, coor);
                     xo_3d.model.getWinner();
                     xo_3d.view.addMarker(coorCell, haveLessMoves);
                  }else{
                     console.error("Inaccessible move !");
                  }
               };
            });
         });
      })();
   
   
   })();
   
   xo_3d.controller = controller;
})();