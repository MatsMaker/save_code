var Spase = function(spase, size, marckerActPix) {
   var thisSpase = this;
   var defaultOptions = {
      spase: "#spase",
      size: {
         x: 30,
         y: 30
      },
      directionOfTravel: ["up", "right", "down", "left"],
      marckerActPix: "active"
   };
   this.options = {
      spase: (spase) ? $(spase) : $(defaultOptions.spase),
      size: (size) ? {
         x: (size.x) ? size.x : defaultOptions.size.x,
         y: (size.y) ? size.y : defaultOptions.size.y
      } : defaultOptions.size,
      directionOfTravel: defaultOptions.directionOfTravel,
      marckerActPix: (marckerActPix) ? marckerActPix : defaultOptions.marckerActPix,
      baseSpeed: 1000,
      factorSpeed: 10
   };
   this.world = {
      potinFood: {x: 4, y: 0},
      stateGame: 0, // 0 - pause, 1 - game, 2 - end game;
      snake: {
         state: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
         stomach: [],
         speed: 1000,
         directionOfTravel: thisSpase.options.directionOfTravel[1]
      },
      spase: {
         state: [{}],
         marker: {
            nothing: 0,
            snake: 1,
            food: 2
         }
      },
      rand: function(min, max) {
         min = parseInt(min);
         max = parseInt(max);
         return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      createWorld: function() {
         var spase = thisSpase.options.spase;
         var size = thisSpase.options.size;

         var width = parseInt(spase.css('width')) / size.x;
         var height = parseInt(spase.css('height')) / size.y;
         for (var x = 0; x < size.x; x++) {
            var row = "<div class='row-" + x + "'>";
            for (var y = 0; y < size.y; y++) {
               row = row + "<div class='pixel x" + x + "y" + y + "' style='width: " + width + "px; height: " + height + "px'></div>";
            }
            row = row + "</div>";
            spase.append(row);
         }
      },
      trigerPixel: function(coor) {
         var actPix = $(".x" + coor.y + "y" + coor.x);
         var marckerActPix = thisSpase.options.marckerActPix;

         if (actPix.hasClass(marckerActPix)) {
            actPix.removeClass(marckerActPix);
         } else {
            actPix.addClass(marckerActPix);
         }
      },
      portrayASnake: function() {
         var snake = thisSpase.world.snake;
         for (var i = 0; i < snake.state.length; i++) {
            thisSpase.world.trigerPixel(snake.state[i]);
         }
      },
      displayFood: function() {
         var potinFood = thisSpase.world.potinFood;

         thisSpase.world.trigerPixel(potinFood);
      },
      trail: function(coor) {
         var snake = thisSpase.world.snake;
         var availability = false;
         if (snake.stomach.length > 0) {
            if (snake.stomach[0].x === coor.x && snake.stomach[0].y === coor.y) {
               snake.stomach.shift();
               availability = true;
            }
         }
         return availability;
      },
      newPoint: function() {
         var rand = thisSpase.world.rand;
         var size = thisSpase.options.size;
         var coor = {};
         var size = thisSpase.options.size;
         coor.x = rand(0, size.x - 1);
         coor.y = rand(0, size.y - 1);
         return coor;
      },
      createFood: function() {
         var potinFood = {};
         var craateNewFood = function() {
            potinFood = thisSpase.world.newPoint();
            for (var i = 0; i < thisSpase.world.snake.state.length; i++) {
               if (potinFood.x === thisSpase.world.snake.state[i].x && potinFood.y === thisSpase.world.snake.state[i].y) {
                  craateNewFood();
               }
            }
         };
         craateNewFood();
         thisSpase.world.potinFood = potinFood;
         thisSpase.world.trigerPixel(thisSpase.world.potinFood);
      },
      eatAMeal: function(coorFood) {
         var eaten = false;
         var potinFood = thisSpase.world.potinFood;
         var snake = thisSpase.world.snake;
         if (potinFood.x === coorFood.x && potinFood.y === coorFood.y) {
            snake.state.push(potinFood);
            snake.stomach.push(potinFood);
            potinFood = {};
            eaten = true;
         }
         return eaten;
      }
   };
   this.newGame = {
      createSpase: function() {
         var arr = [];
         for (var ix = 0; ix < thisSpase.options.size.x; ix++) {
            arr.push([]);
            for (var iy = 0; iy < thisSpase.options.size.y; iy++) {
               arr[ix].push([]);
               var marcDef = thisSpase.world.spase.marker.nothing;
               var obj = {};
               obj.coor = {};
               obj.coor.x = ix;
               obj.coor.y = iy;
               obj.it = marcDef;
               arr[ix][iy] = obj;
            }
         }
         thisSpase.world.spase.state = arr;
      },
      moveTheSnake: {
         theFollowingCell: function() {
            var nexStep = {};
            var x = y = "undefined";
            var snake = thisSpase.world.snake;
            var directionOfTravel = thisSpase.options.directionOfTravel;
            switch (snake.directionOfTravel) {
               case directionOfTravel[0]:
                  {
                     x = snake.state[snake.state.length - 1].x;
                     y = snake.state[snake.state.length - 1].y - 1;
                     nexStep = {x: x, y: y};
                     break
                  }
               case directionOfTravel[1]:
                  {
                     x = snake.state[snake.state.length - 1].x + 1;
                     y = snake.state[snake.state.length - 1].y;
                     nexStep = {x: x, y: y};
                     break
                  }
               case directionOfTravel[2]:
                  {
                     x = snake.state[snake.state.length - 1].x;
                     y = snake.state[snake.state.length - 1].y + 1;
                     nexStep = {x: x, y: y};
                     break
                  }
               case directionOfTravel[3]:
                  {
                     x = snake.state[snake.state.length - 1].x - 1;
                     y = snake.state[snake.state.length - 1].y;
                     nexStep = {x: x, y: y};
                     break
                  }
               default:
                  {
                     console.error('ERROR! No such direction. function: theFollowingCell');
                  }
            }
            thisSpase.newGame.moveTheSnake.crashedIntoA(nexStep);

            return nexStep;
         },
         checkWalls: function(coor) {
            var outputArea = function(adedText) {
               console.warn("Output area! function: checkWalls. (" + adedText + ")");
               if (confirm("Output area! function: checkWalls. (" + adedText + "). New game?")) {
                  location.reload();
               } else {

               }
               thisSpase.world.stateGame = 2;
            };
            var size = thisSpase.options.size;
            var snake = thisSpase.world.snake;
            var directionOfTravel = thisSpase.options.directionOfTravel;

            if (coor.y < 0 && snake.directionOfTravel === directionOfTravel[0]) {
               outputArea("direction: " + directionOfTravel[0]);
            }

            if (coor.x > size.x - 1 && snake.directionOfTravel === directionOfTravel[1]) {
               outputArea("direction: " + directionOfTravel[1]);
            }

            if (coor.y > size.y - 1 && snake.directionOfTravel === directionOfTravel[2]) {
               outputArea("direction: " + directionOfTravel[2]);
            }

            if (coor.x < 0 && snake.directionOfTravel === directionOfTravel[3]) {
               outputArea("direction: " + directionOfTravel[3]);
            }
         },
         crashedIntoA: function(coor) {
            for (var i = 0; i < thisSpase.world.snake.state.length; i++) {
               if (thisSpase.world.snake.state[i].x === coor.x && thisSpase.world.snake.state[i].y === coor.y) {
                  console.warn("You bumped into a themselves! :'(");
                  if (confirm("You bumped into a themselves! New game?")) {
                     location.reload();
                  } else {

                  }
                  thisSpase.world.stateGame = 2;
               }
            }
         },
         speedBoost: function() {
            var lvl = thisSpase.world.snake.state.length;
            var factorSpeed = thisSpase.options.factorSpeed;
            thisSpase.world.snake.speed = thisSpase.options.baseSpeed -  (lvl * factorSpeed);
         },
         stepSnake: function() {
            var passedStep = thisSpase.world.snake.state.shift();
            var nexStep = thisSpase.newGame.moveTheSnake.theFollowingCell();
            var trail = thisSpase.world.trail;

            thisSpase.world.snake.state.push(nexStep);
            thisSpase.newGame.moveTheSnake.checkWalls(nexStep);
            if (!thisSpase.world.eatAMeal(thisSpase.world.snake.state[thisSpase.world.snake.state.length - 1])) {
               thisSpase.world.trigerPixel(nexStep);
            } else {
               thisSpase.world.createFood();
               thisSpase.newGame.moveTheSnake.speedBoost();
            }
            if (!trail(passedStep)) {
               thisSpase.world.trigerPixel(passedStep);
            }
         },
         anim: function() {
            var stateGame = thisSpase.world.stateGame;
            var snake = thisSpase.world.snake;
            var stepSnake = thisSpase.newGame.moveTheSnake.stepSnake;
            setTimeout(function() {
               stepSnake();
               if (thisSpase.world.stateGame === 1)
                  setTimeout(arguments.callee, snake.speed);
            }, 0);
         }
      },
      listenerControl: function() {

         window.onkeydown = function(e) {
            var event = e || window.event;
            var code = event.which || event.keyCode;
            var directionOfTravel = thisSpase.options.directionOfTravel;
            var snake = thisSpase.world.snake;

            switch (event.keyCode) {
               case(19):
                  {
                     if (thisSpase.world.stateGame === 0) {
                        thisSpase.newGame.moveTheSnake.anim();
                        thisSpase.world.stateGame = 1;
                     } else {
                        thisSpase.world.stateGame = 0;
                     }
                     break
                  }
               case(38):
                  {
                     if (snake.directionOfTravel !== directionOfTravel[2]) {
                        snake.directionOfTravel = directionOfTravel[0];
                     }
                     break
                  }
               case(39):
                  {
                     if (snake.directionOfTravel !== directionOfTravel[3]) {
                        snake.directionOfTravel = directionOfTravel[1];
                     }
                     break
                  }
               case(40):
                  {
                     if (snake.directionOfTravel !== directionOfTravel[0]) {
                        snake.directionOfTravel = directionOfTravel[2];
                     }
                     break
                  }
               case(37):
                  {
                     if (snake.directionOfTravel !== directionOfTravel[1]) {
                        snake.directionOfTravel = directionOfTravel[3];
                     }
                     break
                  }
            }
         };
      },
      createGame: function() {
         thisSpase.newGame.createSpase();
         thisSpase.world.createWorld();
         thisSpase.world.portrayASnake();
         thisSpase.world.displayFood();
         thisSpase.newGame.listenerControl();
      }
   };
};

$(function() {
   window.spase0 = new Spase;
   spase0.newGame.createGame();
});