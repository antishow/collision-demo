Circle = (function(){
	function Circle(c, r){
		this.center = new Vector(c);
		this.radius = r;
	}

	function collisionWithCircle(c, axis)
	{
		console.log(" Checking for collision between %s and %s", this.toString(), c.toString());
		var ret = false,
			d = c.center.subtract(this.center),
			distance = d.length,
			radiusTotal = this.radius + c.radius;

		console.log(" Distance between centers: %s", distance);
		console.log(" Sum of radii: %s", radiusTotal);

		if(distance === 0)
		{
			d = axis || Vector.xAxis;
		}

		if(radiusTotal > distance)
		{
			d.length = radiusTotal - distance;			
			console.log(" COLLISION! %s", d.toString());
			ret = d.clone();
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