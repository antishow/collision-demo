PolygonInputController = (function($){
	var ret = {},
		polygonOpacity = 0.5,
		projectionOpacity = 0.33,
		vertexInputTemplate = "<div class=\"vertex\"><input name=\"x\" placeholder=\"X\"><input name=\"y\" placeholder=\"Y\"><button class=\"remove-vertex\">Remove</button></div>";

	function onClickRemoveVertex(e)
	{
		var clicked = $(e.currentTarget),
			vertex = clicked.closest(".vertex");

		vertex.remove();
		return false;
	}

	function onClickAddVertex(e)
	{
		var clicked = $(e.currentTarget),
			vertices = clicked.closest(".vertices"),
			newVertex = $(vertexInputTemplate);

			vertices.append(newVertex);
	}

	function onInputChange()
	{
		$(PolygonInputController).trigger("change");
	}

	function getPolygon(selector)
	{
		var input = $(selector), vertex, x, y, vertices = [];

		$(".vertex", input).each(function(){
			x = parseFloat($("[name=x]", this).val());
			y = parseFloat($("[name=y]", this).val());
			vertices.push(new Vector(x, y));
		});

		return new Polygon(vertices);
	}

	function getColor(selector)
	{
		var input = $(selector), 
			i, 
			channel, 
			channels = ['r', 'g', 'b'],
			value,
			values = {};

		for(i in channels)
		{
			channel = channels[i];
			value = parseInt($("[name="+channel+"]", input).val(), 10);
			values[channel] = value;
		}

		return values;
	}

	function getPolygonColor(selector)
	{
		var values = getColor(selector);
		return "rgba("+values.r+", "+values.g+", "+values.b+", "+polygonOpacity+")";
	}

	function getProjectionColor(selector)
	{
		var values = getColor(selector);
		return "rgba("+values.r+", "+values.g+", "+values.b+", "+projectionOpacity+")";
	}

	function onDocumentReady()
	{
		$(document).on("click", ".remove-vertex", onClickRemoveVertex);
		$(document).on("click", ".add-vertex", onClickAddVertex);
		$(document).on("change, keyup", ".polygon-input INPUT", onInputChange);
	}

	ret.getPolygon = getPolygon;
	ret.getPolygonColor = getPolygonColor;
	ret.getProjectionColor = getProjectionColor;

	$(onDocumentReady);

	return ret;
})(jQuery);