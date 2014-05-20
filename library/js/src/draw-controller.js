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

		if(!color)
		{
			color = "#000";
		}

		var canvasCenter = offset(),
			vectorStart, 
			vectorEnd,
			arrowheadLength = 5, 
			arrowSkew,
			arrowLeft, 
			arrowRight;

		vectorStart = new Vector(canvasCenter.x + origin.x, canvasCenter.y + origin.y);
		vectorEnd = vectorStart.clone().add(vector);
		arrowLeft = vector.leftNormal().normalize().multiplyByScalar(arrowheadLength);
		arrowRight = vector.rightNormal().normalize().multiplyByScalar(arrowheadLength);
		arrowSkew = vector.clone().normalize().multiplyByScalar(-1 * arrowheadLength);

		arrowLeft = Vector.midpoint([arrowLeft, arrowSkew]).add(vectorEnd);
		arrowRight = Vector.midpoint([arrowRight, arrowSkew]).add(vectorEnd);

		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(vectorStart.x, vectorStart.y);
		ctx.lineTo(vectorEnd.x, vectorEnd.y);
		ctx.lineTo(arrowLeft.x, arrowLeft.y);
		ctx.moveTo(vectorEnd.x, vectorEnd.y);
		ctx.lineTo(arrowRight.x, arrowRight.y);
		ctx.stroke();
		ctx.closePath();
	}

	DrawController.drawAxis = drawAxis;
	DrawController.drawCircle = drawCircle;
	DrawController.drawPolygon = drawPolygon;
	DrawController.drawVector = drawVector;

	function onDocumentReady(){
		ctx = CanvasController.ctx;
	}

	$(onDocumentReady);

	return DrawController;
})(jQuery);