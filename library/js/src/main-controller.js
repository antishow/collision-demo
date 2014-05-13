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