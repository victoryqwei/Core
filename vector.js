module.exports = class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}	
	getMag() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	setMag(magnitude) {
		var direction = this.getDir();
		this.x = Math.cos(direction) * magnitude;
		this.y = Math.sin(direction) * magnitude;
	}
	getDir() {
	  return Math.atan2(this.y, this.x);
	}
	add(a, b) {
		if (b) {
	    return new Vector(a.x + b.x, a.y + b.y);
	  } else {
	    this.x = this.x + a.x;
		this.y = this.y + a.y
	  }
	}
	sub(a, b) {
	  if (b) {
	    return new Vector(a.x - b.x, a.y - b.y);
	  } else {
	    this.x = this.x - a.x;
		 this.y = this.y - a.y
	  }
	}
	mult(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
	}
	div(scalar) {
		this.x = this.x / scalar;
		this.y = this.y / scalar;
	}
	getDot(b) {
		return this.x * b.x + this.y * b.y;
	}
	dist(a, b) {
	  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
	}
	normalize() {
		if (this.getMag() != 0) {
			this.div(this.getMag());
		}
	}
	limit(max) {
		if (this.getMag() > max) {
			this.normalize();
			this.mult(max);
		}
	}
	copy() {
		return new Vector(this.x, this.y);
	}
}