var World = function() {
	var spase = $("#spase");
	var size = {
		x: 30,
		y: 30
	};
	var directionOfTravel = ["up", "right", "down", "left"];
	var marckerActPix     = "active";
	var snake             = [];
	var stateGame         = 0;

	var id = 0;

	var addedSnake = function(id) {
		var id = (id) ? id : id;

		var defSnake = {
			id: id,
			state: [{
				x: 0,
				y: 0
			}, {
				x: 1,
				y: 0
			}, {
				x: 2,
				y: 0
			}, {
				x: 3,
				y: 0
			}, {
				x: 4,
				y: 0
			}, {
				x: 5,
				y: 0
			}, {
				x: 6,
				y: 0
			}, {
				x: 7,
				y: 0
			}],
			stomach: [{
				x: -1,
				y: -1
			}],
			trail: {
				x: -1,
				y: -1
			},
			speed: 100,
			directionOfTravel: directionOfTravel[2]
		};
		snake.push(defSnake);
	};
	addedSnake();

	var createWorld = (function() {
		var width = parseInt(spase.css('width')) / size.x;
		var height = parseInt(spase.css('height')) / size.y;
		for (var x = 0; x < size.x; x++) {
			var row = "<div class='row-" + x + "'>";
			for (var y = 0; y < size.y; y++) {
				row = row + "<div class='pixel x" + x + "y" + y + "' style='width: " + width + "px; height: " + height + "px'></div>";
			};
			row = row + "</div>";
			spase.append(row);
		};
	})();

	var trigerPixel = function(coor) {
		var actPix = $(".x" + coor.y + "y" + coor.x);
		if (actPix.hasClass(marckerActPix)) {
			actPix.removeClass(marckerActPix);
		} else {
			actPix.addClass(marckerActPix);
		}
	}

	var portrayASnake = function(id) {
		var id = (id) ? id : id;

		for (var i = 0; i < snake[id].state.length; i++) {
			trigerPixel(snake[id].state[i]);
		};
	};
	portrayASnake(0);

	var moveTheSnake = (function() {

		var theFollowingCell = function() {
			var nexStep = {};
			var x = y = "undefined";
			switch (snake[id].directionOfTravel) {
				case directionOfTravel[0]:
					{
						x = snake[id].state[snake[id].state.length - 1].x;
						y = snake[id].state[snake[id].state.length - 1].y - 1;
						nexStep = {
							x: x,
							y: y
						};
						break
					}
				case directionOfTravel[1]:
					{
						x = snake[id].state[snake[id].state.length - 1].x + 1;
						y = snake[id].state[snake[id].state.length - 1].y;
						nexStep = {
							x: x,
							y: y
						};
						break
					}
				case directionOfTravel[2]:
					{
						x = snake[id].state[snake[id].state.length - 1].x;
						y = snake[id].state[snake[id].state.length - 1].y + 1;
						nexStep = {
							x: x,
							y: y
						};
						break
					}
				case directionOfTravel[3]:
					{
						x = snake[id].state[snake[id].state.length - 1].x - 1;
						y = snake[id].state[snake[id].state.length - 1].y;
						nexStep = {
							x: x,
							y: y
						};
						break
					}
				default:
					{
						console.error('ERROR! No such direction. function: theFollowingCell for snake ' + [id]);
					}
			}

			return nexStep;
		};

		var checkWalls = function(coor, id) {
			var id = (id) ? id : id;

			var outputArea = function(adedText) {
				console.warn("Output area! function: checkWalls. (" + adedText + ")");
				stateGame = 0;
			}
			if (coor.y < 0 && snake[id].directionOfTravel === directionOfTravel[0])
				outputArea("direction: " + directionOfTravel[0]);
			if (coor.x > size.x - 1 && snake[id].directionOfTravel === directionOfTravel[1])
				outputArea("direction: " + directionOfTravel[1]);
			if (coor.y > size.y - 1 && snake[id].directionOfTravel === directionOfTravel[2])
				outputArea("direction: " + directionOfTravel[2]);
			if (coor.x < 0 && snake[id].directionOfTravel === directionOfTravel[3])
				outputArea("direction: " + directionOfTravel[3]);

		};

		var stepSnake = function(id) {
			var id = (id) ? id : id;

			var trail = snake[id].state.shift();
			var nexStep = theFollowingCell();

			checkWalls(nexStep);
			snake[id].state.push(nexStep);
			trigerPixel(trail);
			trigerPixel(nexStep);
		};

		var anim = function() {
			setTimeout(function() {
				stepSnake(0);

				if (stateGame != 0)
					setTimeout(arguments.callee, snake[id].speed);
			}, 0);
		};

		var listenerControl = function(idL) {
			var idL = (idL) ? idL : id;

			window.onkeydown = function(e) {
				var event = e || window.event;
				var code = event.which || event.keyCode;
				switch (event.keyCode) {
					case (19):
						{
							if (stateGame == 0) {
								anim();
								stateGame = 1;
							} else {
								stateGame = 0;
							}
							break
						}
					case (38):
						{

							snake[idL].directionOfTravel = directionOfTravel[0];
							break
						}
					case (39):
						{
							snake[idL].directionOfTravel = directionOfTravel[1];
							break
						}
					case (40):
						{
							snake[idL].directionOfTravel = directionOfTravel[2];
							break
						}
					case (37):
						{
							snake[idL].directionOfTravel = directionOfTravel[3];
							break
						}
				}
				//console.log(event.keyCode);
			}
		};
		listenerControl(id);

	})();
}

$(function() {
	var newWorld = new World;
})