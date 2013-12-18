function rand(min, max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var World = function() {
    var spase = $("#spase");
    var size = {x: 30, y: 30};
    var marckerActPix = "active";
    var directionOfTravel = ["up", "right", "down", "left"];
    var stateGame = 0;
    var factorSpeed = 300;
    var snake = {
        state: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]
                , stomach: []
                , speed: 300
                , directionOfTravel: directionOfTravel[1]
    };
    var potinFood = {x: 4, y: 0};

    var trigerPixel = function(coor) {
        var actPix = $(".x" + coor.y + "y" + coor.x);
        if (actPix.hasClass(marckerActPix)) {
            actPix.removeClass(marckerActPix);
        } else {
            actPix.addClass(marckerActPix);
        }
        ;
    };

    var portrayASnake = function() {
        for (var i = 0; i < snake.state.length; i++) {
            trigerPixel(snake.state[i]);
        }
        ;
    };

    var displayFood = function() {
        trigerPixel(potinFood);
    };

    var trail = function(coor) {
        var availability = false;
        if (snake.stomach.length > 0) {
            if (snake.stomach[0].x == coor.x && snake.stomach[0].y == coor.y) {
                snake.stomach.shift();
                availability = true;
            }
        }
        return availability;
    }

    var newPoint = function() {
        var coor = {};
        coor.x = rand(0, size.x);
        coor.y = rand(0, size.y);

        return coor;
    }

    var createFood = function() {
        /* not testing  бівает не появляется еда или появляется в теле змеи*/
        potinFood = newPoint();
        trigerPixel(potinFood);
        console.log(potinFood, snake.state);
    }

    var eatAMeal = function(coorFood) {
        var eaten = false;
        if (potinFood.x === coorFood.x && potinFood.y === coorFood.y) {
            snake.state.push(potinFood);
            snake.stomach.push(potinFood);
            potinFood = {};
            eaten = true;
        }
        ;
        return eaten;
    };

    var speedBoost = function() {
        /* //зависимость скорости от размера змейки
         var lvl = snake.state.length;
         var factor = (parseInt(lvl/10) > 0)?parseInt(lvl/10):1;
         snake.speed = snake.speed * factorSpeed;
         console.log(lvl, factor, snake.speed);
         */
    }

    var createWorld = (function() {
        var width = parseInt(spase.css('width')) / size.x;
        var height = parseInt(spase.css('height')) / size.y;
        for (var x = 0; x < size.x; x++) {
            var row = "<div class='row-" + x + "'>";
            for (var y = 0; y < size.y; y++) {
                row = row + "<div class='pixel x" + x + "y" + y + "' style='width: " + width + "px; height: " + height + "px'></div>";
            }
            ;
            row = row + "</div>";
            spase.append(row);
        }
        ;
    })();

    this.launchAtStartup = function() {
        portrayASnake();
        displayFood();
        listenerControl();
    };

    var moveTheSnake = (function() {

        var theFollowingCell = function() {
            var nexStep = {};
            var x = y = "undefined";
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

            return nexStep;
        };

        var checkWalls = function(coor) {
            var outputArea = function(adedText) {
                console.warn("Output area! function: checkWalls. (" + adedText + ")");
                stateGame = 0;
            };
            if (coor.y < 0 && snake.directionOfTravel === directionOfTravel[0])
                outputArea("direction: " + directionOfTravel[0]);
            if (coor.x > size.x - 1 && snake.directionOfTravel === directionOfTravel[1])
                outputArea("direction: " + directionOfTravel[1]);
            if (coor.y > size.y - 1 && snake.directionOfTravel === directionOfTravel[2])
                outputArea("direction: " + directionOfTravel[2]);
            if (coor.x < 0 && snake.directionOfTravel === directionOfTravel[3])
                outputArea("direction: " + directionOfTravel[3]);

        };


        var stepSnake = function() {
            var passedStep = snake.state.shift();
            var nexStep = theFollowingCell();
            snake.state.push(nexStep);
            speedBoost();
            checkWalls(nexStep);
            if (!eatAMeal(snake.state[snake.state.length - 1])) {
                trigerPixel(nexStep);
            } else {
                createFood();
            }
            if (!trail(passedStep)) {
                trigerPixel(passedStep);
            }
            ;
        };

        var anim = function() {
            setTimeout(function() {
                stepSnake();
                if (stateGame !== 0)
                    setTimeout(arguments.callee, snake.speed);
            }, 0);
        };

        this.listenerControl = function() {
            window.onkeydown = function(e) {
                var event = e || window.event;
                var code = event.which || event.keyCode;
                switch (event.keyCode) {
                    case(19):
                        {
                            if (stateGame === 0) {
                                anim();
                                stateGame = 1;
                            } else {
                                stateGame = 0;
                            }
                            break
                        }
                    case(38):
                        {
                            snake.directionOfTravel = directionOfTravel[0];
                            break
                        }
                    case(39):
                        {
                            snake.directionOfTravel = directionOfTravel[1];
                            break
                        }
                    case(40):
                        {
                            snake.directionOfTravel = directionOfTravel[2];
                            break
                        }
                    case(37):
                        {
                            snake.directionOfTravel = directionOfTravel[3];
                            break
                        }
                }
                //console.log(event.keyCode);
            };
        };
    })();
};

$(function() {
    var newWorld = new World;
    newWorld.launchAtStartup();
});