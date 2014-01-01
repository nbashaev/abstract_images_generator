var orderOfImages = [];



function cross(headNode1, headNode2, prob) {

	var newHeadNode = new Node();
	var children = [];

	var mainNode, addNode;
	var newProb = 0;
	var types = "";


	if ( probability(prob) ) {

		mainNode = headNode1;
		addNode = headNode2;
		newProb = prob;

	} else {

		mainNode = headNode2;
		addNode = headNode1;
		newProb = 1 - prob;

	}

	types = mainNode.type + "; " + addNode.type;



	switch (types) {
		case "const; const":
		case "const; coord":
		case "coord; const":
		case "coord; coord":
		case "const; func1":
		case "coord; func1":
		case "func1; const":
		case "func1; coord":
		case "const; func2":
		case "coord; func2":
		case "func2; const":
		case "func2; coord":

			for (var i = 0; i < mainNode.getNumOfChildren(); i++) {

				children[i] = mainNode.getChildByNumber(i);

			}

			break;


		case "func1; func1":

			children = [
				cross(
					mainNode.getChildByNumber(0),
					addNode.getChildByNumber(0),
					newProb
				)
			];

			break;


		case "func1; func2":

			children = [
				cross(
					mainNode.getChildByNumber(0),
					addNode.getChildByNumber( randInt(0, 1) ),
					newProb
				)
			];

			break;


		case "func2; func1":

			children = [
				cross(
					mainNode.getChildByNumber(0),
					addNode.getChildByNumber(0),
					newProb
				),

				cross(
					mainNode.getChildByNumber(1),
					addNode.getChildByNumber(0),
					newProb
				)
			];
			
			break;


		case "func2; func2":

			children = [
				cross(
					mainNode.getChildByNumber(0),
					addNode.getChildByNumber(0),
					newProb
				),

				cross(
					mainNode.getChildByNumber(1),
					addNode.getChildByNumber(1),
					newProb
				)
			];

			break;


		default:

			children = [];
			break;
	}




	newHeadNode.setValue( mainNode.getValue() );
	newHeadNode.type = mainNode.type;


	for (var i = 0; i < children.length; i++) {

		newHeadNode.addNode(children[i]);

	}


	return newHeadNode;
}



function mutate(headNode) {
	var newValue = 0;
	var newType = "";

	switch (headNode.type) {
		case "const":
			if ( probability(PROB_OF_CONST_TO_COORD) ) {

				newValue = randBool() ? "x" : "y";
				newType = "coord";

			} else {

				newValue = headNode.getValue() * ( 1 + rand(-DEVIATION, DEVIATION) );
				newType = "const";

			}

			break;


		case "coord":
			if ( probability(PROB_OF_COORD_TO_CONST) ) {

				newValue = ( values.const.getRandVal() ).val;
				newType = "const";

			} else {

				newValue = headNode.getValue() == "x" ? "y" : "x";
				newType = "coord";

			}

			break;


		default:

			newValue = headNode.getValue();
			newType = headNode.type;

			break;
	}

	headNode.setValue(newValue);
	headNode.type = newType;


	for (var i = 0; i < headNode.getNumOfChildren(); i++) {

		mutate( headNode.getChildByNumber(i) );

	}


	return headNode;

}




function getRatingOfImages() {

	var rating = [];

	for (var k = 0; k < NUM_OF_IMAGES; k++) {

		rating[k] = NUM_OF_IMAGES - k;

	}

	return rating;

}

function getProb(rating, couple) {

	var rating1 = rating[ couple[0] ];
	var rating2 = rating[ couple[1] ];

	return rating1 / (rating1 + rating2);
}







function createNewGeneration() {

	var rating = getRatingOfImages();
	var generation = [];
	var countOfImages = 0;



	for (var i = 0; i < NUM_OF_ALIVE; i++) (function(index) {

		var imageData = images[ orderOfImages[index] ];
		addImage(generation, imageData, index);

		countOfImages++;

	})(i);






	for (var j = 0; j < (NUM_OF_IMAGES - NUM_OF_ALIVE); j++) (function(index, count) {
		
		var worker = workers[index];
		var couple = getRandCouple(rating);

		var index1 = orderOfImages[couple[0]];
		var index2 = orderOfImages[couple[1]];

		var rTrees = [ images[ index1 ].tree.r, images[ index2 ].tree.r ];
		var gTrees = [ images[ index1 ].tree.g, images[ index2 ].tree.g ];
		var bTrees = [ images[ index1 ].tree.b, images[ index2 ].tree.b ];

		var prob = getProb(rating, couple);



		var rTree = mutate( cross(rTrees[0], rTrees[1], prob) ); simplify(rTree);
		var gTree = mutate( cross(gTrees[0], gTrees[1], prob) ); simplify(gTree);
		var bTree = mutate( cross(bTrees[0], bTrees[1], prob) ); simplify(bTree);



		createImage(worker, rTree, gTree, bTree, WIDTH, HEIGHT, function callBack(image, isValid, rTree, gTree, bTree) {

			count++;


			var imageData = {};


			if (isValid) {

				imageData = new ImageData(image, isValid, rTree, gTree, bTree);
				addImage(generation, imageData, index);

				countOfImages++;

			} else if (count >= MAX_NUM_OF_MUTATION) {

				for (var x = 0; x < WIDTH; x++) {

					image[x] = [];

					for (var y = 0; y < HEIGHT; y++) {

						image[x][y] = BAD_COLOR;

					}

				}

				imageData = new ImageData(image, isValid, rTree, gTree, bTree);
				addImage(generation, imageData, index);

				countOfImages++;

			} else {

				rTree = mutate( cross(rTrees[0], rTrees[1], prob) ); simplify(rTree);
				gTree = mutate( cross(gTrees[0], gTrees[1], prob) ); simplify(gTree);
				bTree = mutate( cross(bTrees[0], bTrees[1], prob) ); simplify(bTree);


				createImage(worker, rTree, gTree, bTree, WIDTH, HEIGHT, callBack);

			}


			if (countOfImages == NUM_OF_IMAGES) {
				
				showCanvases();
			}

		});

	})(NUM_OF_ALIVE + j, 0);



	images = generation;

}
