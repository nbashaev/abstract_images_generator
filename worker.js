var BAD_COLOR = new Color(200, 200, 200);



function Color(red, green, blue) {
	
	var obj = {
		
		r: red,
		g: green,
		b: blue
		
	};

	return obj;

}



self.onmessage = function(event) {

	var argObj = event.data;

	var rFunc = new Function("x, y", argObj.rFunc);
	var gFunc = new Function("x, y", argObj.gFunc);
	var bFunc = new Function("x, y", argObj.bFunc);

	var width = argObj.width;
	var height = argObj.height;

	var leftBorder = argObj.leftBorder || 0;
	var rightBorder = argObj.rightBorder || height;



	var image = [];
	var isValid = true;


	var rMin = rFunc(0, 0);
	var gMin = gFunc(0, 0);
	var bMin = bFunc(0, 0);

	var rMax = rFunc(0, 0);
	var gMax = gFunc(0, 0);
	var bMax = bFunc(0, 0);


	var r, g, b;

	for (var x = 0; x < width; x++) {
		image[x] = [];

		for (var y = leftBorder; y < rightBorder; y++) {

			r = rFunc(x, y);
			g = gFunc(x, y);
			b = bFunc(x, y);


			if (r < rMin)	rMin = r;
			if (g < gMin)	gMin = g;
			if (b < bMin)	bMin = b;
			
			if (r > rMax)	rMax = r;
			if (g > gMax)	gMax = g;
			if (b > bMax)	bMax = b;
			

			image[x][y] = new Color(r, g, b);

		}
	}



	if ((rMin == rMax) && (gMin == gMax) && (bMin == bMax)) {

		isValid = false;

	}





	if (isValid) {

		var rKoef, gKoef, bKoef;


		if ((rMax - rMin) == Infinity)	rKoef = 255 / Number.MAX_VALUE;
		else if ((rMax - rMin) == 0)	rKoef = 0;
		else							rKoef = 255 / (rMax - rMin);


		if ((gMax - gMin) == Infinity)	gKoef = 255 / Number.MAX_VALUE;
		else if ((gMax - gMin) == 0)	gKoef = 0;
		else							gKoef = 255 / (gMax - gMin);


		if ((bMax - bMin) == Infinity)	bKoef = 255 / Number.MAX_VALUE;
		else if ((bMax - bMin) == 0)	bKoef = 0;
		else							bKoef = 255 / (bMax - bMin);



		var colorObj;

		for (var x = 0; x < width; x++) {
		
			for (var y = leftBorder; y < rightBorder; y++) {
			
				colorObj = image[x][y];


				colorObj.r -= rMin; colorObj.r |= 0;
				colorObj.g -= gMin; colorObj.g |= 0;
				colorObj.b -= bMin; colorObj.b |= 0;

				colorObj.r *= rKoef;
				colorObj.g *= gKoef;
				colorObj.b *= bKoef;

			}
		}

	}



	self.postMessage({
		"image": (isValid ? image : []),
		"isValid": isValid
	});
}