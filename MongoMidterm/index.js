/**
 * @author Charlie Calvert
 */

var sprite = function(params) {	
	var $element = params.$drawTarget.append('<div/>').find(':last');
	var elemStyle = $element[0].style;	
	
	$element.css({
		position: 'absolute',
		width: params.width,
		height: params.height,
		backgroundImage: 'url(' + params.images + ')'	
	});
	
	var that = {
		draw: function(x, y) {
			elemStyle.left = x + 'px';
			elemStyle.top = y + 'px';			
		},
		changeImage: function(index) {
			index *= params.width;
			var verticalOffset = (-Math.floor(index/params.imagesWidth) * params.height)  + 'px';
			var horizontalOffset = (-index % params.imagesWidth) + 'px ';
			// console.log($element);
			elemStyle.backgroundPosition = horizontalOffset + verticalOffset;
		},
		show: function() {
			elemStyle.display = 'block';
		},
		hide: function() {
			elemStyle.display = 'none';
		},
		destroy: function() {
			$element.remove();
		}
	};
	return that;
};


var moveSprite = function(options) {
	
	var animSprite = sprite(options);
	var animIndex = 0;
	animSprite.moveAndDraw = function() {	
		animIndex += options.clockwise > 0 ? 1 : -1;
		animIndex %= 5;
		animIndex += animIndex < 0 ? 5: 0;
		animSprite.changeImage(animIndex);
		animSprite.draw(options.x, options.y);
	};
	return animSprite;
};



var sprites = [];

function animate($drawTarget, image, ready, imagesWidth, width, height, x, y) {	
	
	var animSprite = moveSprite({
			images: image,
			imagesWidth: imagesWidth,
			width: width,
			height: height,
			$drawTarget: $drawTarget,
			x: x,
			y: y,
			clockwise: true,
	});
		
	
	sprites.push(animSprite);
	
	function move() {	
		for (var i = 0; i < sprites.length; i++) {
			//console.log(i);	
			sprites[i].moveAndDraw();
		}		
		setTimeout(move, 350);
	}
	
	if (ready) {
		move();
	}
}

$(document).ready(function() {
	var target01 = $('#drawHere01');
	var target02 = $('#drawHere02');
	animate(target01, 'Shapes01.png', true, 380, 95, 95, 4, 4);
	animate(target02, 'Shapes02.png', true, 380, 95, 95, 4, 4);	
});
