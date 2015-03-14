var arr1 = [];
var arr2 = [];
var arr3 = [];

var limit = 100;

for (var i = 0; i < 30; i++) {
  arr1.push(Math.floor(Math.random()*limit));
  arr2.push(Math.floor(Math.random()*limit));
  arr3.push(Math.floor(Math.random()*limit));
}

function randomize(val) {
	var new_val = Math.floor(100*Math.random());
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	var result = val + new_val * plusOrMinus;

	if (parseInt(result) > 1000) {
		return [val - new_val];
	}

	if (parseInt(result) < 0) {
		return [val + new_val];
	}

	return [result];
}



function loop() {
	drawsparkline($('#sparkline-pulse'), arr1.map(randomize));
	drawsparkline($('#sparkline-body-temp'), arr2.map(randomize), '#7BC5D3'); //'#7BC5D3'
	drawsparkline($('#sparkline-amb-temp'), arr3.map(randomize), '#B25050'); //7BC5D3
}

function drawsparkline(elem, arr, color) {
	if (color) {
		var stacked_color = color;
	} else {
		stacked_color = '#6AA6D6'
	}
	elem.sparkline(arr, { type: 'bar', barWidth: 7, highlightColor: '#000', height: 50, barSpacing: 2, stackedBarColor: stacked_color});
}
