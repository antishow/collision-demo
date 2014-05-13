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