var images = [];



function ImageData(matrix, isValid, redTree, greenTree, blueTree) {

	var obj = {
		matrix: matrix,

		tree: {
			r: redTree,
			g: greenTree,
			b: blueTree
		},

		isValid: isValid
	};


	return obj;
}



function createImage(worker, rTree, gTree, bTree, width, height, callBack) {


	worker.onmessage = function(event) {

		var answerObj = event.data;

		var image = answerObj.image;
		var isValid = answerObj.isValid;


		callBack(image, isValid, rTree, gTree, bTree, width, height);

	}


	worker.postMessage({
	
		"rFunc": "return " + convertTreeToString(rTree) + " | 0;",
		"gFunc": "return " + convertTreeToString(gTree) + " | 0;",
		"bFunc": "return " + convertTreeToString(bTree) + " | 0;",
		"width": width,
		"height": height

	});

}


function addImage(array, imageData, index) {

	var canvObj = canvases[index];
	var canvas = canvObj.canvas;

	array[index] = imageData;
	drawImageOnCanvas(canvObj, imageData.matrix);
}
