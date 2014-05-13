CanvasController = (function($){
	var CanvasController, win, $canvas, canvas, ctx;

	function onDocumentReady()
	{
		win = $(window);
		$canvas = $("CANVAS");
		canvas = $canvas.get(0);
		ctx = canvas.getContext("2d");

		win.on("resize", onResize).trigger("resize");
	}

	function onResize()
	{
		var w = win.width(),
			h = win.height();

		$canvas.attr("width", w);
		$canvas.attr("height", h);

		$(CanvasController).trigger("resize");
	}

	function clear()
	{
		canvas.width = canvas.width;
	}

	CanvasController = {
		get ctx(){
			return ctx;
		}
	};
	CanvasController.clear = clear;

	$(onDocumentReady);

	return CanvasController;
})(jQuery);
Circle = (function(){
	function Circle(c, r){
		this.center = new Vector(c);
		this.radius = r;
	}

	function collisionWithCircle(c)
	{
		var ret = false,
			d = c.center.subtract(this.center),
			distance = d.length,
			radiusTotal = this.radius + c.radius;

		if(radiusTotal > distance)
		{
			d.length = radiusTotal - distance;
			ret = d;
		}

		return ret;
	}

	function toString()
	{
		return "c: " + this.center.toString() + ", r: " + this.radius;
	}

	Circle.prototype = {
		get diameter(){
			return this.radius * 2;
		},
		get circumference(){
			return Math.PI * this.radius * 2;
		},
		collisionWithCircle: collisionWithCircle,
		toString: toString
	};

	return Circle;
})();
DrawController = (function($){
	var ctx;
	DrawController = {};

	function offset(){
		return new Vector(ctx.canvas.width / 2, ctx.canvas.height / 2);
	}

	function drawCircle(circle, color){
		var O = offset();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(O.x + circle.center.x, O.y + circle.center.y, circle.radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	function drawPolygon(polygon, color){
		var O = offset();
		ctx.fillStyle = color;
		ctx.beginPath();

		ctx.moveTo(O.x + polygon.vertices[0].x, O.y + polygon.vertices[0].y);
		for(var i = 1; i<=polygon.vertices.length; i++)
		{
			var vertex = polygon.vertices[i % polygon.vertices.length];
			ctx.lineTo(O.x + vertex.x, O.y + vertex.y);
		}

		ctx.closePath();
		ctx.fill();
	}

	function drawAxis(axis){
		var a = axis.clone(), maxLength, canvasCenter, forward, reverse;

		canvasCenter = offset();
		maxLength = canvasCenter.length;
		a.length = maxLength;
		forward = a.clone();
		reverse = a.clone().multiplyByScalar(-1);

		ctx.strokeStyle = "#ccc";
		ctx.beginPath();
		ctx.moveTo(canvasCenter.x, canvasCenter.y);
		ctx.lineTo(canvasCenter.x + forward.x, canvasCenter.y + forward.y);
		ctx.moveTo(canvasCenter.x, canvasCenter.y);
		ctx.lineTo(canvasCenter.x + reverse.x, canvasCenter.y + reverse.y);
		ctx.stroke();
		ctx.closePath();
	}

	function drawVector(vector, color, origin){
		if(!origin)
		{
			origin = new Vector(0,0);
		}
	}

	DrawController.drawAxis = drawAxis;
	DrawController.drawCircle = drawCircle;
	DrawController.drawPolygon = drawPolygon;

	function onDocumentReady(){
		ctx = CanvasController.ctx;
	}

	$(onDocumentReady);

	return DrawController;
})(jQuery);
MainController = (function($){
	function drawScene()
	{
		CanvasController.clear();

		var axis, polygons = [];

		$(".polygon-input").each(function(){
			polygons.push(PolygonInputController.getPolygon(this));
		});
		var testAxes = (polygons[0]).collisionAxesWithPolygon((polygons[1]));

		for(var i in testAxes)
		{
			axis = testAxes[i];
			DrawController.drawAxis(axis);
		}

		for(i in polygons)
		{
			var polygon = polygons[i];
			var input = $(".polygon-input").get(i);
			var polygonColor = PolygonInputController.getPolygonColor(input);
			var projectionColor = PolygonInputController.getProjectionColor(input);

			DrawController.drawPolygon(polygon, polygonColor);

			for(var pi in testAxes)
			{
				axis = testAxes[pi];
				var projection = polygon.projectedOntoAxis(axis);

				DrawController.drawCircle(projection, projectionColor);
			}
		}

		/*
    $(".polygon-input").each(function(){
        var s = PolygonInputController.getPolygon(this);
        DrawController.drawPolygon(s, PolygonInputController.getPolygonColor(this));

        var testAxes = s.collisionTestAxes();
        for(var i in testAxes)
        {
            var axis = testAxes[i],
                projection = s.projectedOntoAxis(axis);

            DrawController.drawAxis(axis);
            DrawController.drawCircle(projection, PolygonInputController.getProjectionColor(this));
        }
    });
		*/


	}

	function onDocumentReady()
	{
	    drawScene();
	    $(CanvasController).on("resize", drawScene);
	    $(PolygonInputController).on("change", drawScene);
	}

	$(onDocumentReady);
})(jQuery);
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
Polygon = (function(){
	function Polygon(vertices)
	{
		var i;
		this.vertices = [];
		for(i in vertices)
		{
			this.vertices.push(new Vector(vertices[i]));
		}
	}

	function collisionTestAxes()
	{
		var index, testIndex, testAxis, sides, includeAxis, axis, ret = [];

		sides = this.sides;
		for(index = 0; index < sides.length; index++)
		{
			axis = sides[index].rightNormal().normalize();
			includeAxis = true;

			for(testIndex = 0; testIndex < ret.length; testIndex++)
			{
				testAxis = ret[testIndex];
				if(testAxis.isParallelTo(axis))
				{
					includeAxis = false;
					break;
				}
			}

			if(includeAxis)
			{
				ret.push(axis);
			}
		}

		return ret;
	}

	function collisionAxesWithPolygon(p)
	{
		var ret = [],
			myAxes = this.collisionTestAxes(),
			pAxes = p.collisionTestAxes(),
			i,
			pi,
			axis,
			pAxis,
			includeAxis;

		for(i=0; i < myAxes.length; i++)
		{
			ret.push(myAxes[i]);
		}

		for(pi = 0; pi < pAxes.length; pi++)
		{
			pAxis = pAxes[pi];
			include = true;
			for(i=0; i < myAxes.length; i++)
			{
				axis = myAxes[i];
				if(axis.isParallelTo(pAxis))
				{
					include = false;
					break;
				}
				else
				{
					continue;
				}
			}

			if(include)
			{
				ret.push(pAxis);
			}
		}

		return ret;
	}

	function projectedOntoAxis(a)
	{
		var index, pVertices = [], pVector, pLength, pMin, pMax,min = null, max = null;

		for(index in this.vertices)
		{
			pVector = this.vertices[index].projectedOnto(a);
			pVertices.push(pVector);
			pLength = pVector.length;
			if(min === null && max === null)
			{
				min = pLength;
				pMin = pVector.clone();
				max = pLength;
				pMax = pVector.clone();
			}
			else
			{
				if(pLength <= min){
					min = pLength;
					pMin = pVector.clone();
				}
				if(pLength >= max){
					max = pLength;
					pMax = pVector.clone();
				}
			}
		}

		return new Circle(Vector.midpoint([pMin, pMax]), (max - min)/2);
	}

	Polygon.prototype = {
		get center(){
			return Vector.midpoint(this.vertices);
		},
		get sides(){
			var index, vertex, endVertex, side, sides = [];

			for(index = 0; index<this.vertices.length; index++)
			{
				vertex = this.vertices[index];
				endVertex = this.vertices[(index + 1) % this.vertices.length];
				side = endVertex.clone().subtract(vertex);

				sides.push(side);
			}

			return sides;
		},
		projectedOntoAxis: projectedOntoAxis,
		collisionTestAxes: collisionTestAxes,
		collisionAxesWithPolygon: collisionAxesWithPolygon
	};

	return Polygon;
})();
Vector = (function(){

	function Vector(x, y)
	{
		if(x instanceof Vector)
		{
			this.x = x.x;
			this.y = x.y;
		}
		else if(Object.prototype.toString.call(x) === '[object Array]')
		{
			this.x = x[0];
			this.y = x[1];
		}
		else
		{
			this.x = x;
			this.y = y;
		}
	}
	
	function normalize()
	{	
		var l;
		
		if(!this.isZero())
		{
			l = this.length;
			this.x /= l;
			this.y /= l;
		}
		
		return this;
	}
	
	function add(V)
	{
		this.x += V.x;
		this.y += V.y;
		
		return this;
	}
	
	function subtract(V)
	{
		this.x -= V.x;
		this.y -= V.y;
		
		return this;
	}
	
	function multiplyByScalar(N)
	{
		this.x *= N;
		this.y *= N;
		
		return this;
	}
	
	function leftNormal()
	{
		return new Vector(this.y, this.x * -1);
	}
	
	function rightNormal()
	{
		return new Vector(this.y * -1, this.x);
	}
	
	function dotProduct(V)
	{
		return (this.x * V.x) + (this.y * V.y);
	}
	
	function crossProduct(V)
	{
		// Not a TRUE cross product since this is only 
		// in 2d, but handy for a few other operations
		return (this.x * V.y) - (this.y * V.x);
	}
	
	function isParallelTo(V)
	{
		return (this.crossProduct(V) === 0);
	}
	
	function isPerpendicularTo(V)
	{
		return (this.dotProduct(V) === 0);
	}
	
	function isZero()
	{
		return (this.x === 0 && this.y === 0);
	}
	
	function clone()
	{
		return new Vector(this.x, this.y);
	}
	
	function projectedOnto(V)
	{
		var axis = V.clone().normalize();
		var magnitude = this.dotProduct(V);
		
		return axis.multiplyByScalar(magnitude);
	}
	
	function toArray()
	{
		return [this.x, this.y];
	}
	
	function toString()
	{
		return this.x + "," + this.y;
	}
	
	Vector.prototype = {
		get length(){
			return Math.sqrt(this.x*this.x + this.y*this.y);
		},
		set length(l){
			this.normalize().multiplyByScalar(l);
		},
		x: 0,
		y: 0,
		isZero: isZero,
		normalize: normalize,
		add: add,
		subtract: subtract,
		multiplyByScalar: multiplyByScalar,
		leftNormal: leftNormal,
		rightNormal: rightNormal,
		dotProduct: dotProduct,
		crossProduct: crossProduct,
		clone: clone,
		isParallelTo: isParallelTo,
		isPerpendicularTo: isPerpendicularTo,
		projectedOnto: projectedOnto,
		toArray: toArray,
		toString: toString
	};
	
	Vector.xAxis = new Vector(1,0);
	Vector.yAxis = new Vector(0,1);
	Vector.midpoint = function(vectors){
		var index, midpoint = new Vector(0,0);
		for(index in vectors)
		{
			midpoint.add(vectors[index]);
		}

		return midpoint.multiplyByScalar(1 / vectors.length);
	};

return Vector;
})();