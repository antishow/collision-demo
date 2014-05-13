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