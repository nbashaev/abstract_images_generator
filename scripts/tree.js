// ---------------------------------------------------------------------------
// ---------------- Конструктор узла -----------------------------------------
// ---------------------------------------------------------------------------

function Node(val) {
	var value = val || -1;
	var children = [];

	var obj = {
		value: value,
		type: "",

		setValue: function(val) {
			this.value = val;
		},

		getValue: function() {
			return this.value;
		},

		getNumOfChildren: function() {
			return children.length;
		},

		setChildByNumber: function(num, value) {
			children[num] = new Node(value);
		},

		getChildByNumber: function(num) {
			return children[num];
		},

		addNode: function(node) {
			children.push(node);
		},

		deleteClildren: function() {
			children = [];
		}
	};

	return obj;
}



// ---------------------------------------------------------------------------
// ---------------- Конвертер дерева в LaTeX ---------------------------------
// ---------------------------------------------------------------------------

function convertTreeToLaTeX(headNode) {
	var str = "";
	var arg1, arg2;


	switch (headNode.type) {
		case "coord":
			str = headNode.getValue();
			break;

		case "const":
			str = String( headNode.getValue().toFixed(2) );
			break;

		case "func1":
			arg1 = convertTreeToLaTeX( headNode.getChildByNumber(0) );

			str = (headNode.getValue()).toLaTeX(arg1);
			break;

		case "func2":
			arg1 = convertTreeToLaTeX( headNode.getChildByNumber(0) );
			arg2 = convertTreeToLaTeX( headNode.getChildByNumber(1) );

			str = (headNode.getValue()).toLaTeX(arg1, arg2);
			break;

		default:
			str= "";
			break;
	}


	return str;
}



// ---------------------------------------------------------------------------
// ---------------- Конвертер дерева в строку --------------------------------
// ---------------------------------------------------------------------------

function convertTreeToString(headNode) {
	var str = "";
	var arg1, arg2;


	switch (headNode.type) {
		case "coord":
			str = headNode.getValue();
			break;

		case "const":
			str = String( headNode.getValue() );
			break;

		case "func1":
			arg1 = convertTreeToString( headNode.getChildByNumber(0) );

			str = (headNode.getValue()).toStr(arg1);
			break;

		case "func2":
			arg1 = convertTreeToString( headNode.getChildByNumber(0) );
			arg2 = convertTreeToString( headNode.getChildByNumber(1) );

			str = (headNode.getValue()).toStr(arg1, arg2);
			break;

		default:
			str= "";
			break;
	}


	return str;
}



// ---------------------------------------------------------------------------
// ---------------- Упрощение дерева -----------------------------------------
// ---------------------------------------------------------------------------

function simplify(headNode) {

	if (headNode.getNumOfChildren() != 0) {

		var children = [];
		var isConst = true;

		for (var i = 0; i < headNode.getNumOfChildren(); i++) {

			children[i] = simplify( headNode.getChildByNumber(i) );

			if (children[i] == false) {
				isConst = false;
			}

		}


		if (isConst) {

			var func = new Function("x, y", "return " + convertTreeToString(headNode) + ";");

			
			headNode.setValue( func(0, 0) );
			headNode.type = "const";
			headNode.deleteClildren();

		}


		return isConst;


	} else {

		if (headNode.type == "const") {

			return true;

		} else {

			return false;

		}
	
	}

}