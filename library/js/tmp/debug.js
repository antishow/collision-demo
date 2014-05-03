Vector = (function(){

	function Vector(x, y)
	{
		this.x = x;
		this.y = y;
	}
	
	function normalize()
	{	
		var l;
		
		if(!this.is_zero())
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
	
	function multiply_by_scalar(N)
	{
		this.x *= N;
		this.y *= N;
		
		return this;
	}
	
	function left_normal()
	{
		return new Vector(this.y, this.x * -1);
	}
	
	function right_normal()
	{
		return new Vector(this.y * -1, this.x);
	}
	
	function dot_product(V)
	{
		return (this.x * V.x) + (this.y * V.y);
	}
	
	function cross_product(V)
	{
		// Not a TRUE cross product since this is only 
		// in 2d, but handy for a few other operations
		return (this.x * V.y) - (this.y * V.x);
	}
	
	function is_parallel_to(V)
	{
		return (this.cross_product(V) === 0);
	}
	
	function is_perpendicular_to(V)
	{
		return (this.dot_product(V) === 0);
	}
	
	function is_zero()
	{
		return (this.x === 0 && this.y === 0);
	}
	
	function clone()
	{
		return new Vector(this.x, this.y);
	}
	
	function projected_onto(V)
	{
		var axis = V.clone().normalize();
		var magnitude = this.dot_product(V);
		
		return axis.multiply_by_scalar(magnitude);
	}
	
	function to_array()
	{
		return [this.x, this.y];
	}
	
	function to_string()
	{
		return this.x + "," + this.y;
	}
	
	Vector.prototype = {
		get length(){
			return Math.sqrt(this.x*this.x + this.y*this.y);
		},
		set length(l){
			this.normalize().multiply_by_scalar(l);
		},
		x: 0,
		y: 0,
		is_zero: is_zero,
		normalize: normalize,
		add: add,
		subtract: subtract,
		multiply_by_scalar: multiply_by_scalar,
		left_normal: left_normal,
		right_normal: right_normal,
		dot_product: dot_product,
		cross_product: cross_product,
		clone: clone,
		is_parallel_to: is_parallel_to,
		is_perpendicular_to: is_perpendicular_to,
		projected_onto: projected_onto,
		to_array: to_array,
		to_string: to_string
	};
	
	Vector.x_axis = new Vector(1,0);
	Vector.y_axis = new Vector(0,1);

return Vector;
})();