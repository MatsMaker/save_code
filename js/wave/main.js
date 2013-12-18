$(function(){
	var Wave = function(){
		var size = {x: 50, y: 50};
		var speed = 10;
		var spase = $('#spase');
		
		var randColor = function(){
			var r = Math.floor(Math.random() * (256));
			var g = Math.floor(Math.random() * (256));
			var b = Math.floor(Math.random() * (256));
			var c = '#' + r.toString(16) + g.toString(16) + b.toString(16);
			if(c.length < 7){c = "blue"};

			return c;
		}

		var createSpase =  (function(){
			var color = randColor();
			for (var y = 0; y < size.y; y++) {
				var string = "<div class='row"+y+"''>";
				for (var x = 0; x < size.x; x++) {
					string = string + "<div class='pixsel x"+x+"y"+y+"' style='width:"+300/size.x+"px; height:"+300/size.y+"px; background-color:"+color+"'></div>";
				};
				string = string + "</div>";
				spase.append(string);
			};
		})();

		var paint = function(x,y,color){
			$(".x"+x+"y"+y).css('background-color', color);
		};

		var clicked = (function(){
			$("[class^='row']").bind('click', function(){
				var actNumRow = $(this).attr('class').split('row')[1];
				var color = randColor();
				var x = 0;
				setTimeout(function() {
					if(x<size.x){
						paint(x,actNumRow,color);
				    };
				    for (var i = 0; i < size.y; i++) {
				    	var xi = parseInt(x) - parseInt(i);
				    	if( xi >= 0){
				    		var yi=parseInt(actNumRow)-parseInt(i);
					    	if(i>= 0){
					    		paint(xi,yi,color);
							};
							yi = parseInt(actNumRow)+parseInt(i);
					    	if(yi<=size.y){ 
					    		paint(xi,yi,color);
					    	};
					    };
				    };
				    x++;
				    if ( x < size.x*2 ) setTimeout(arguments.callee, speed);
				}, 0);
				

			})
		})();

	};

	var newWave = new Wave;
})