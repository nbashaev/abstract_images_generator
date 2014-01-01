// ---------------------------------------------------------------------------
// ---------------- Создание начальных изображений ---------------------------
// ---------------------------------------------------------------------------

initFunc.push(function() {
    
    var countOfImages = 0;

	for (var i = 0; i < NUM_OF_IMAGES; i++) (function(index, count) {


		var worker = workers[index];

		var rTree = createRandomTree(); simplify(rTree);
		var gTree = createRandomTree(); simplify(gTree);
		var bTree = createRandomTree(); simplify(bTree);



		createImage(worker, rTree, gTree, bTree, WIDTH, HEIGHT, function callBack(image, isValid, rTree, gTree, bTree) {

			count++;


			var imageData = {};


			if (isValid) {

				imageData = new ImageData(image, isValid, rTree, gTree, bTree);
				addImage(images, imageData, index);
                countOfImages++;
                
			} else if (count >= MAX_NUM_OF_MUTATION) {

				for (var x = 0; x < WIDTH; x++) {

					image[x] = [];

					for (var y = 0; y < HEIGHT; y++) {

						image[x][y] = BAD_COLOR;

					}

				}


				imageData = new ImageData(image, isValid, rTree, gTree, bTree);
				addImage(images, imageData, index);
				countOfImages++;

			} else {

				rTree = createRandomTree(); simplify(rTree);
				gTree = createRandomTree(); simplify(gTree);
				bTree = createRandomTree(); simplify(bTree);


				createImage(worker, rTree, gTree, bTree, WIDTH, HEIGHT, callBack);

			}
			
            if (countOfImages == NUM_OF_IMAGES) {
				
				showCanvases();
			}

		});
	})(i, 0);

});
