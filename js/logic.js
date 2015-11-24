$.getJSON("js/raw.json", function(data) {
	var source = [];

	$.each(data, function(i, d) {
		source.push(d);
	});

	console.log(source.length + " entries collected.");

	$(function() {
		$("#questions").val("q1");
		parseQuestions("q1");
	});

	$("#questions").change(function() {
		$("#gender").val("全部");
		$("#age").val("全部");
		parseQuestions($("#questions").val());
	});

	$("#gender").change(function() {
		parseQuestions($("#questions").val());
	})

	$("#age").change(function() {
		parseQuestions($("#questions").val());
	})

	function parseQuestions(number) {
		var name = $("#questions option:selected").text();

		if (number != "")
			switch (number) {
				case "q1":
					$("#gender").prop("disabled", "disabled");
					$("#age").prop("disabled", false);
					createChart(number, name, false, true);
					break;
				case "q2":
					$("#gender").prop("disabled", false);
					$("#age").prop("disabled", "disabled");
					createChart(number, name, true, false);
					break;
				case "q3":
				case "q4":
				case "q5":
				case "q6":
				case "q7":
				case "q8":
				case "q9":
				case "q10":
				case "q11":
				case "q12":
				case "q13":
				case "q14":
				case "q15":
					$("#gender").prop("disabled", false);
					$("#age").prop("disabled", false);
					createChart(number, name, true, true);
					break;
			}
	}

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

	function createChart(question, name, isGender, isAge) {
		var data = [];
		var result = [];
		var qnum = question.match(/\d+/)[0];
		var attribute = "d." + question;
		var genderFilter = (isGender) ? $("#gender").val() : "全部";
		var ageFilter = (isAge)? $("#age").val() : "全部";

		if (question != "") {
			if (qnum >= 4 && qnum <= 12) {
				$.each(source, function(i, d) {
					if (d.q3 == "有")
						data.push(d);
				});
			} 
			else data = source;

			$.each(data, function(i, d) {
				if (d.q1 == genderFilter && d.q2 == ageFilter)
					result.push(eval(attribute));
				else if (d.q1 == genderFilter && ageFilter == "全部")
					result.push(eval(attribute));
				else if (genderFilter == "全部" && d.q2 == ageFilter)
					result.push(eval(attribute));
				else if (genderFilter == "全部" && ageFilter == "全部")
					result.push(eval(attribute));
			});
		}

		if (result.length > 0) {
			$("#result").html("");
			drawChart({
				titleText: name,
				subtitleText: "",
				data: getCounts(result)
			});
		}
		else $("#result").html("沒有數據。");
	}

	function drawChart(options) {
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

	function createAgeChart(source, value) {
		var age = [];

		if (value != "") {
			$.each(source, function(i, d) {
				if (value == "全部")
					age.push(d.q2);
				else if (d.q1 == value)
					age.push(d.q2);
			});
		}

		if (age.length > 0) {
			$("#result").html("");
			createChart({
				titleText: "你現在幾多歲？（"　+ value + "）" ,
				subtitleText: "",
				data: getCounts(age)
			});
		}
	}
});

