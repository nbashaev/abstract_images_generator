function setHandlersToCanvas(canvas, numOfImage) {

	canvas.addEventListener("click", function() {

		if (canvas.isVisible) {


			$(canvas).fadeTo(100, 0);
			canvas.isVisible = false;

			orderOfImages.push(numOfImage);


			if (orderOfImages.length >= NUM_OF_IMAGES) {

				createNewGeneration();
				orderOfImages = [];
				
			}


		}

	});





	canvas.addEventListener("contextmenu", function() {

		$("#fullscreen").get(0).onclick = function() {

			fullscreen(numOfImage);

		};

		$("#showformula").get(0).onclick = function() {

			showFormula( createFormula( images[numOfImage].tree ) );

		};

		$('#comand').modal("show");

	});

}



function createFormula(treeObj) {

	var str = (

		"r \\left ( x, y \\right ) = " + convertTreeToLaTeX( treeObj.r ) + "\\\\" +
		"g \\left ( x, y \\right ) = " + convertTreeToLaTeX( treeObj.g ) + "\\\\" +
		"b \\left ( x, y \\right ) = " + convertTreeToLaTeX( treeObj.b )
	
	);

	return str;
}

function showFormula(string) {

	var img = document.createElement("img");
	img.src = "http://latex.codecogs.com/gif.latex?" + encodeURI("\\\\" + string);

	var container = $("#content").get(0);
	container.innerHTML = "";
	$(container).append(img);

	$(img).css("width", "100%");
	$(img).on("click", function() {

		window.open(img.src, "Formula");

	});

	$('#formula').modal();

}







function fullscreen(numOfImage) {

	$("#modalWindow .progress").addClass("progress-striped active");
	$("#openButton").button("loading");

	$("#modalWindow").modal("show");


	var width = screen.width;
	var height = screen.height;



	var worker = workers[numOfImage];


	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	var canvObj = {
		canvas: canvas,
		context: context
	};

	canvas.width = width;
	canvas.height = height;



	var rTree = images[numOfImage].tree.r;
	var gTree = images[numOfImage].tree.g;
	var bTree = images[numOfImage].tree.b;



	createImage(worker, rTree, gTree, bTree, width, height, function callBack(image, isValid, rTree, gTree, bTree) {


		if (!isValid) {

			for (var x = 0; x < width; x++) {

				image[x] = [];

				for (var y = 0; y < height; y++) {

					image[x][y] = BAD_COLOR;

				}

			}

		}


		drawImageOnCanvas(canvObj, image);


		var url = canvas.toDataURL("image/png");

		var img = document.createElement("img");
		img.src = url;


		$("#openButton").get(0).onclick = function() {
			
			$("body").append(img);
			document.documentElement.scrollTop = $("body").height();

			$("html").get(0).onkeydown = function(event) {

				if (event.keyCode == 27) {
					
					$(img).remove();

				}

			};

		};

		$("#modalWindow .progress").removeClass("progress-striped active");
		$("#openButton").button("reset");

	});

}