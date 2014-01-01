var canvases = [];



function drawImageOnCanvas(canvObj, matrix) {

	var canvas = canvObj.canvas;
	var context = canvObj.context;

	var imgWidth = canvas.width;
	var imgHeight = canvas.height;

	var leftBorder = leftBorder || 0;
	var rightBorder = rightBorder || imgHeight;



	var imageData = context.getImageData(0, 0, imgWidth, imgHeight);
	var pixels = imageData.data;


	var i = 4 * imgWidth * leftBorder;

	for (var y = leftBorder; y < rightBorder; y++) {

		for (var x = 0; x < imgWidth; x++) {

			pixels[  i  ] = matrix[x][y].r;
			pixels[i + 1] = matrix[x][y].g;
			pixels[i + 2] = matrix[x][y].b;
			pixels[i + 3] = 255;

			i += 4;

		}

	}


	context.putImageData(imageData, 0, 0);
}


function drawImage(matrix, numOfCanvas) {
	var canvObj = canvases[numOfCanvas];
	drawImageOnCanvas(canvObj, matrix);

}






initFunc.unshift( function() {

	var containers = [];
	var container;


	var elem = {};

	for (var i = 0; i < NUM_OF_IMAGES_IN_ROW; i++) {

		elem = document.createElement("div");



		$(elem).addClass("container-column");

		if (i == 0)								$(elem).addClass("first-column");
		if (i == (NUM_OF_IMAGES_IN_ROW - 1))	$(elem).addClass("last-column");



		containers.push(elem);
		$("body").append(elem);

	}



	var canvas, context;

	for (var i = 0; i < NUM_OF_IMAGES; i++) {

		container = containers[ (i % NUM_OF_IMAGES_IN_ROW) ];


		canvas = document.createElement("canvas");
		context = canvas.getContext("2d");
		

		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		canvases.push({
			canvas: canvas,
			context: context
		});


		$(container).append(canvas);
		$(container).append($(
            '<div class="control-buttons" id="controls' + i.toString() + '">' +
                '<button type="button" class="btn btn-default btn-xs" id="fullscreen' + i.toString() + '" disabled>' +
	                '<span class="glyphicon glyphicon-fullscreen"></span>' +
	                'Full screen' +
                '</button>' +

                '<button type="button" class="btn btn-default btn-xs" id="showformula' + i.toString() + '" disabled>' +
	                '<span class="glyphicon glyphicon-stats"></span>' +
	                'Show formula' +
                '</button>' +

            '</div>'
		));
		
		setHandlersToCanvas(canvas, i);
	}



	// Занимаемся вёрсткой
	
	$(".container-column").css("width", String(WIDTH_OF_COLUMN) + "%");
	$(".container-column canvas").css("border", String(WIDTH_OF_BORDER) + "px" + " " + TYPE_OF_BORDER + " " + COLOR_OF_BORDER);

	$(".container-column canvas").css("margin", String(WIDTH_OF_MARGIN) + "px" + " " + String(WIDTH_OF_MARGIN / 2) + "px");
	$(".first-column canvas").css("margin-left", String(WIDTH_OF_MARGIN) + "px");
	$(".last-column canvas").css("margin-right", String(WIDTH_OF_MARGIN) + "px");

});
