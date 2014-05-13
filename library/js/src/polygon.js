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

	function collisionWithPolygon(polygon)
	{
		var ret = false,
			testAxes = collisionAxesWithPolygon.call(this, polygon),
			axis,
			axisIndex,
			axisCollision,
			shortestCollision = null,
			shortestCollisionLength = null;

		for(axisIndex in testAxes)
		{
			axis = testAxes[axisIndex];
			axisCollision = collisionWithPolygonOnAxis.call(this, polygon, axis);

			if(!axisCollision)
			{
				// As long as one axis doesn't have a collision,
				// there's NO collision, so let's just stop here
				// instead of checking the rest
				ret = false;
				break;
			}
			else
			{
				if(shortestCollision === null)
				{
					shortestCollision = axisCollision;
					shortestCollisionLength = axisCollision.length;
				}
				else
				{
					if(axisCollision.length < shortestCollisionLength)
					{
						shortestCollision = axisCollision;
						shortestCollisionLength = axisCollision.length;
					}
				}
			}
			ret = shortestCollision;
		}

		return ret;
	}

	function collisionWithPolygonOnAxis(polygon, axis)
	{
		var projection = this.projectedOntoAxis(axis),
			pProjection = polygon.projectedOntoAxis(axis),
			ret;

		console.log("Checking %s for a collision", axis.toString());
		ret = projection.collisionWithCircle(pProjection, axis);
		console.log(ret);

		return ret;
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
		collisionAxesWithPolygon: collisionAxesWithPolygon,
		collisionWithPolygon: collisionWithPolygon,
		collisionWithPolygonOnAxis: collisionWithPolygonOnAxis
	};

	return Polygon;
})();