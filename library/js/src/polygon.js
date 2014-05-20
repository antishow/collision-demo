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
		var index, l = this.vertices.length, pVector, pLength, pMin, pMax, min = null, max = null;

		pVector = this.vertices[0].projectedOnto(a);
		min = max = pVector.dotProduct(a);
		pMin = pMax = pVector;

		for(index = 1; index<l; index++)
		{
			pVector = this.vertices[index].projectedOnto(a);
			pLength = pVector.dotProduct(a);

			if(pLength <= min){
				min = pLength;
				pMin = pVector;
			}
			if(pLength >= max){
				max = pLength;
				pMax = pVector;
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