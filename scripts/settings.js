// ---------------------------------------------------------------------------
// ---------------- Параметры ихображения ------------------------------------
// ---------------------------------------------------------------------------

var WIDTH, HEIGHT; // Ширина и высота

window.addEventListener("load", function() {

	WIDTH = (

		$(window).width() -
		(NUM_OF_IMAGES_IN_ROW + 1) * WIDTH_OF_MARGIN -
		2 * WIDTH_OF_BORDER * NUM_OF_IMAGES_IN_ROW

	) / NUM_OF_IMAGES_IN_ROW;


	HEIGHT = (

		$(window).height() -
		3 * NUM_OF_ROWS * WIDTH_OF_MARGIN -
		2 * WIDTH_OF_BORDER * NUM_OF_ROWS

	) / NUM_OF_ROWS;

});



// ---------------------------------------------------------------------------
// ---------------- Генетика -------------------------------------------------
// ---------------------------------------------------------------------------

var NUM_OF_IMAGES = 12;
var NUM_OF_ALIVE = Math.floor(NUM_OF_IMAGES * 0.3);

var MAX_NUM_OF_MUTATION = 30;

var DEVIATION = 0.5;
var PROB_OF_CONST_TO_COORD = 0.7;
var PROB_OF_COORD_TO_CONST = 0.35;



// ---------------------------------------------------------------------------
// ---------------- Вёрстка --------------------------------------------------
// ---------------------------------------------------------------------------

var NUM_OF_IMAGES_IN_ROW = 4;
var NUM_OF_ROWS = Math.ceil(NUM_OF_IMAGES / NUM_OF_IMAGES_IN_ROW);

var WIDTH_OF_COLUMN = (100 / NUM_OF_IMAGES_IN_ROW).toFixed(14);

var WIDTH_OF_BORDER = 1;
var TYPE_OF_BORDER = "solid";
var COLOR_OF_BORDER = "#000000";

var WIDTH_OF_MARGIN = 5;



// ---------------------------------------------------------------------------
// ---------------- Параметры генерации изображений --------------------------
// ---------------------------------------------------------------------------

var MAX_DEPTH = 6; // Максимальная глубина дерева



window.addEventListener("load", function() {

	// Границы для генерации констант

	values.const.max = +1000;
	values.const.min = -1000;


	// Функции от 1 переменной

	values.func1.arr = [
		
		new FuncObj("Math.abs(#arg1)", "\\left | #arg1 \\right |"),
		new FuncObj("Math.cos(#arg1)", "\\cos \\left ( #arg1 \\right )"),
		new FuncObj("Math.sin(#arg1)", "\\sin \\left ( #arg1 \\right )"),
		new FuncObj("Math.log(Math.abs(#arg1))", "\\ln \\left | #arg1 \\right |"),
		new FuncObj("Math.acos((#arg1) % 1)", "\\arccos \\left ( \\left { #arg1 \\right } \\right )"),
		new FuncObj("Math.asin((#arg1) % 1)", "\\arcsin \\left ( \\left { #arg1 \\right } \\right )")

	];


	// Функции от 2 переменных

	values.func2.arr = [

		new FuncObj("#arg1+#arg2", "#arg1 + #arg2"),
		new FuncObj("#arg1-(#arg2)", "#arg1 - \\left (#arg2\\right )"),
		new FuncObj("(#arg1)*(#arg2)", "\\left (#arg1\\right ) \\times \\left (#arg2\\right )"),
		new FuncObj("(#arg1)/(#arg2)", "\\frac{#arg1}{#arg2}"),
		new FuncObj("(#arg1)%(#arg2)", "\\left (#arg1\\right ) \\mod \\left (#arg2\\right )")

	];

});



// ---------------------------------------------------------------------------
// ---------------- Загружаем worker'ы ---------------------------------------
// ---------------------------------------------------------------------------

var workers = [];

for (var i = 0; i < NUM_OF_IMAGES; i++) {
	
	workers.push( new Worker("worker.js") );

}



// ---------------------------------------------------------------------------
// ---------------- Определяем "плохой цвет" ---------------------------------
// ---------------------------------------------------------------------------

var BAD_COLOR = {
	r: 200,
	g: 200,
	b: 200
};



// ---------------------------------------------------------------------------
// ---------------- Убираем контекстное меню ---------------------------------
// ---------------------------------------------------------------------------

window.addEventListener("load", function() {

	$("body").on("contextmenu", function(event) {

		var thisType = event.target.toString();
		var goodType = ( document.createElement("img") ).toString();
		
		if (thisType == goodType) {
			
			return true;

		} else {

			return false;

		}

	});

});



// ---------------------------------------------------------------------------
// ---------------- Инициализация --------------------------------------------
// ---------------------------------------------------------------------------

var initFunc = [];

window.addEventListener("load", function() {

	for (var i = 0; i < initFunc.length; i++) {

		( initFunc[i] )(); // Последовательно проводим инициализацию

	}

});