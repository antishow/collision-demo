MainController = (function($){
	function drawScene()
	{
		CanvasController.clear();

		var testAxes, 
			axis, 
			i, 
			pi, //NOT Math.PI, just another i
			polygons = [],
			polygon,
			input,
			polygonColor,
			projectionColor,
			collision,
			collisionAxis,
			collisionOrigin,
			projection;

		$(".polygon-input").each(function(){
			polygons.push(PolygonInputController.getPolygon(this));
		});
		testAxes = (polygons[0]).collisionAxesWithPolygon((polygons[1]));

		for(i in testAxes)
		{
			axis = testAxes[i];
			DrawController.drawAxis(axis);
		}

		for(i in polygons)
		{
			polygon = polygons[i];
			input = $(".polygon-input").get(i);
			polygonColor = PolygonInputController.getPolygonColor(input);
			projectionColor = PolygonInputController.getProjectionColor(input);

			DrawController.drawPolygon(polygon, polygonColor);

			for(pi in testAxes)
			{
				axis = testAxes[pi];
				projection = polygon.projectedOntoAxis(axis);

				DrawController.drawCircle(projection, projectionColor);
			}
		}

		collision = (polygons[0]).collisionWithPolygon(polygons[1]);
		if(collision)
		{
			collisionAxis = collision.clone().normalize();
			projection = (polygons[0]).projectedOntoAxis(collisionAxis);
			collisionOrigin = projection.center;
			collisionOrigin.length = collisionOrigin.length + projection.radius;
			collisionOrigin.subtract(collision);
			DrawController.drawVector(collision, "#000", collisionOrigin);
		}
	}

	function onDocumentReady()
	{
	    drawScene();
	    $(CanvasController).on("resize", drawScene);
	    $(PolygonInputController).on("change", drawScene);
	}

	$(onDocumentReady);
})(jQuery);