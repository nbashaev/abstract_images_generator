function setHandlersToCanvas(canvas, numOfImage) {
    
	$(canvas).click(function() {
	    if ($(canvas).css('opacity') == 1){
			$(canvas).fadeTo(100, 0);
			$("#controls" + numOfImage.toString()).fadeTo(100, 0);
			$("#controls" + numOfImage.toString() + " button").prop("disabled", true);
			orderOfImages.push(numOfImage);

			if (orderOfImages.length >= NUM_OF_IMAGES) {
                $("#pleasewait").fadeTo(100, 1);
				createNewGeneration();
				orderOfImages = [];
			}
		}

	});

    $("#fullscreen" + numOfImage.toString()).click(function() {
        fullscreen(numOfImage);
    });

    $("#showformula" + numOfImage.toString()).click(function() {
        showFormula( createFormula( images[numOfImage].tree ) );
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

function requestFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
    return true;
  } else if(element.webkitRequestFullScreen ) {
    element.webkitRequestFullScreen();
    return true;
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
    return true;
  } else {
    return false;
  }
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

		$("#fullscreenImg").get(0).src = url;


		$("#openButton").click(function() {
			
			if (!requestFullScreen($("#fullscreenImg").get(0))){
			    alert("HTML5 FullScreen API is not supported, opening in new window.");
			    window.open(url);
		    }

		});

		$("#modalWindow .progress").removeClass("progress-striped active");
		$("#openButton").button("reset");

	});

}


function showCanvases() {
    $("#pleasewait").fadeTo(100, 0);
    $(".container-column canvas").fadeTo(100, 1);
    $(".control-buttons").fadeTo(100, 1);
    $(".control-buttons button").prop("disabled", false);
}
