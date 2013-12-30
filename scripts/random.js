// ---------------------------------------------------------------------------
// ---------------- Генерация случайных чисел и булевых значений -------------
// ---------------------------------------------------------------------------

function rand(min, max) {
	return (
		min + (max - min) * Math.random()
	);
}

function randInt(min, max) {
	return Math.floor( min + (max - min + 1) * Math.random() );
}

function randBool() {
	return randInt(0, 1) ? true : false;
}

function probability(prob) {
	return rand(0, 1) < prob ? true : false;
}



function getRandIndex(arr) {

	arr = arr.slice();


	var index = 0;

	var randNum = rand(0, 1);
	var border = 0;

	var sum = 0;


	for (var i = 0; i < arr.length; i++)
		sum += arr[i];
	
	for (var j = 0; j < arr.length; j++)
		arr[j] /= sum;


	for (var k = 0; k < arr.length; k++) {

		border += arr[k];

		if (randNum < border) {
			index = k;
			break;
		}

	}


	return index;

}

// ---------------------------------------------------------------------------
// ---------------- Генерация случайного значения ----------------------------
// ---------------------------------------------------------------------------

function FuncObj(toStr, toLaTeX) { // Не спрашивайте, что эта функция здесь делает

	var obj = {

		toStr: function(arg1, arg2) {

			var str = toStr.replace("#arg1", arg1);
			str = str.replace("#arg2", arg2);

			return str;

		},

		toLaTeX: function(arg1, arg2) {

			var str = toLaTeX.replace("#arg1", arg1);
			str = str.replace("#arg2", arg2);

			return str;
			
		}

	};

	return obj;

}



var values = {

	getRandVal: function() {
		var keys = ["func1", "func2", "coord", "const"];
		var randIndex = randInt(0, keys.length - 1);

		return this[ keys[randIndex] ].getRandVal();
	},


	func1: {
		arr: [],

		getRandVal: function() {
			var value = this.arr[ randInt(0, this.arr.length - 1) ];

			return {
				val: value,
				numOfChildren: 1,
				type: "func1"
			};
		}
	},

	func2: {
		arr: [],

		getRandVal: function() {
			var value = this.arr[ randInt(0, this.arr.length - 1) ];

			return {
				val: value,
				numOfChildren: 2,
				type: "func2"
			};
		}
	},

	coord: {

		getRandVal: function() {
			var value = randBool() ? "x" : "y";

			return {
				val: value,
				numOfChildren: 0,
				type: "coord"
			};
		}
	},

	const: {
		min: 0,
		max: 0,

		getRandVal: function() {
			var value = rand(this.min, this.max);

			return {
				val: value,
				numOfChildren: 0,
				type: "const"
			};
		}
	}
}



// ---------------------------------------------------------------------------
// ---------------- Генерация случайного дерева ------------------------------
// ---------------------------------------------------------------------------

function createRandomTree(curDepth, curNode) {

	curNode = curNode || new Node();
	curDepth = curDepth || 1;

	var result;

	var prob = (curDepth - 1) / (MAX_DEPTH - 1);
	prob = Math.pow(prob, 2);


	if ( probability(prob) ) {
		
		result = randBool() ? values.coord.getRandVal() : values.const.getRandVal();

	} else {
		
		result = randBool() ? values.func1.getRandVal() : values.func2.getRandVal();

	}


	curNode.setValue(result.val);
	curNode.type = result.type;

	for (var i = 0; i < result.numOfChildren; i++) {

		curNode.setChildByNumber(i, 0);
		createRandomTree( curDepth + 1, curNode.getChildByNumber(i) );

	}


	return curNode;

}



// ---------------------------------------------------------------------------
// ---------------- Генерация случайной пары индексов по вероятности ---------
// ---------------------------------------------------------------------------

function getRandCouple(prob) {
	
	var index1, index2;
	var array = prob.slice();


	index1 = getRandIndex(array); array[index1] = 0;
	index2 = getRandIndex(array);


	return [index1, index2];
	
}