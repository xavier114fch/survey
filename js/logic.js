function getCounts(data) {
	var counts = {};
	var arr = [];

	$.each(data, function(i, d) {
		counts[d] = (counts[d] || 0) + 1;
	});

	$.each(Object.keys(counts), function(i, d) {
		arr.push({
			label: d,
			value: counts[d]
		});
	});

	return arr;
}

function createChart(options) {
	var pie = new d3pie("result", {
		"header": {
			"title": {
				"text": options.titleText,
				"fontSize": 22,
				"font": "open sans"
			},
			"subtitle": {
				"text": options.subtitleText,
				"color": "#999999",
				"fontSize": 10,
				"font": "open sans"
			},
			"titleSubtitlePadding": 10
		},
		"footer": {
			"color": "#999999",
			"fontSize": 11,
			"font": "open sans",
			"location": "bottom-center"
		},
		"size": {
			"canvasHeight": 400,
			"canvasWidth": 590,
			"pieOuterRadius": "88%"
		},
		"data": {
			"sortOrder": "label-asc",
			"smallSegmentGrouping": {
				"enabled": true,
				"label": "其他"
			},
			"content": options.data
		},
		"labels": {
			"outer": {
				"format": "label-percentage1",
				"pieDistance": 32
			},
			"inner": {
				"format": "value"
			},
			"mainLabel": {
				"font": "open sans",
				"fontSize": 12
			},
			"percentage": {
				"color": "#aaaaaa",
				"font": "open sans",
				"decimalPlaces": 2
			},
			"value": {
				"color": "#ffffff",
				"font": "open sans"
			},
			"lines": {
				"enabled": true
			},
			"truncation": {
				"enabled": true
			}
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "none"
			}
		},
		"misc": {
			"pieCenterOffset": {
				"y": 10
			}
		}
	});
}

$(document).ready(function() {
    $("#gender").val(localStorage.gender);
});

$("#gender").change(function() {
    localStorage.gender = $(this).val();
});

$.getJSON("js/raw.json", function(data) {
	var source = []

	$.each(data, function(i, d) {
		source.push(d);
	});

	$("#gender").change(function() {
		var g = $("#gender").val();
		var age = [];

		if (g != "") {
			$.each(source, function(i, d) {
				if (d.q1 == g)
					age.push(d.q2)
			})

			console.log(getCounts(age));

			$("#result").html("");
			createChart({
				titleText: "你現在幾多歲？（"　+ g + "）" ,
				subtitleText: "",
				data: getCounts(age)
			});
		}
	})
});