function Polygon(proc,center) {
  this.points = [];
  this.p = proc;
  this.selected = false;
  this.c = center;

  this.addPoint = function(x,y) {
    this.points.push(new Point(x,y));
  }

  this.setCenter = function(c) {
    this.c = c;
  }

  this.copy = function() {
    var P = new Polygon(this.p,new Point(this.c.getX()+300,this.c.getY()+300));
    for(i=0;i<this.points.length;i++) {
      P.addPoint(this.points[i].getX()+300, this.points[i].getY()+300);
    }
    P.draw();
    return P;
  }



  this.isInPolygon =  function(x,y) {
	var p = new Point(x,y);
	var p2 = new Point(2000,y);
  //count nbr of crossing between p-p2 and every edge of the olygon
	var crossing = 0;
	for(f=0;f<this.points.length ;f++) {
		if(isCrossing(p,p2, this.points[f],this.points[(f+1)%this.points.length] )  ) {
	    	crossing+=1;
	    }
	}
  	return crossing%2==1;
  }

  //check if there is an overlapping with polygon P
  this.isOverlapping = function(P) {
    var a=0;
    var b=0;
    var res = false;
    while ( a<this.points.length && !res) {
      while ( b<P.points.length && !res) {
        res = isCrossing(this.points[a], this.points[(a+1)%this.points.length],P.points[b], P.points[(b+1)%P.points.length]    );
        b++;
      }
      a++;
      b=0;
    }
    return res;
  }

  //shrink  the size/area polygon by factor
  this.reduce = function(factor) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()/factor, this.points[i].getY()/factor);
  	}
    this.c = new Point(this.c.getX()/factor, this.c.getY()/factor);
  	this.draw();
  }

  this.draw = function() {
    if(this.isSelected()) { //draw in red if selected
      this.p.stroke(255,0,0);
    }
    for(i=0;i<this.points.length;i++) {
      this.p.ellipse(this.points[i].getX(), this.points[i].getY(), 5,5);
  		this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
  	}
    this.p.stroke(0);
  }

  this.select = function() {
    this.selected = !this.selected;
  }

  this.isSelected = function() {
    return this.selected;
  }

  this.move = function(deltaX,deltaY) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()+deltaX, this.points[i].getY()+deltaY);
  	}
    this.c = new Point(this.c.getX()+deltaX, this.c.getY()+deltaY);
  	this.draw();
  }

  this.rotate = function(angle) {
    angle = (angle/180)*Math.PI;
    for(i=0;i<this.points.length;i++) {
      //new coord with c as origin
      var transX =   (this.points[i].getX() - this.c.getX() ) ;
      var transY =   (this.points[i].getY() - this.c.getY() ) ;
      //applying rotation matrix
      var x = transX * Math.cos(angle) - transY * Math.sin(angle);
      var y = transX * Math.sin(angle) + transY * Math.cos(angle);
      this.points[i] = new Point(x + this.c.getX() ,y + this.c.getY() );
    }
    this.draw();
  }

  this.getPoints = function() {
    return this.points;
  }



}
