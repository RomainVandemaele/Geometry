function Polygon(proc) {
  this.points = [];
  this.p = proc;
  this.selected = false;

  this.addPoint = function(x,y) {
    this.points.push(new Point(x,y));
  }

  this.copy = function() {
    var P = new Polygon(this.p);
    //this.p.println("OK2");
    for(i=0;i<this.points.length;i++) {
      //this.p.println("OK2.5");
      P.addPoint(this.points[i].getX()+100, this.points[i].getY()+100);
    }
    //this.p.println("OK3");
    P.draw();
    this.p.println("OK4 : "+P.points.length);
    return P;
  }

  this.getLenght = function() {
    return this.points.length;
  }

  this.isInPolygon =  function(x,y) {
	var p = new Point(x,y);
	var p2 = new Point(2000,y);
	var crossing = 0;
	for(i=0;i<this.points.length ;i++) {
		if(isCrossing(p,p2, this.points[i],this.points[(i+1)%this.points.length] )  ) {
	    	crossing+=1;
	    }
	}
  	return crossing%2==1;
  }

  this.displayPoint = function() {
  	this.p.println(this.points[0].getX());
  	this.p.println(this.points[0].getY());
  }

  this.reduce = function(factor) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()/factor, this.points[i].getY()/factor);
  	}
  	this.draw();
  }

  this.draw = function() {
  	//this.p.background(155);
    //this.erase();
    if(this.isSelected()) {
      this.p.stroke(255,0,0);
    }
    //this.p.println("OK3.1 "+this.points.length);
  	for(i=0;i<this.points.length;i++) {
      //this.p.println("OK3.2");
  		this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
  	}
    this.p.stroke(0);
  }

  this.erase =function() {
    this.p.stroke(155);
    this.p.fill(155);
    for(i=0;i<this.points.length;i++) {
      this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
    }
    this.p.stroke(0);
  } 

  this.select = function() {
    var color = 255;
    if(this.selected) {
      color = 0;
    }
    this.selected = !this.selected;
    this.p.stroke(color,0,0);
    for(i=0;i<this.points.length;i++) {
      this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
    }
    this.p.stroke(0);

  }

  this.isSelected = function() {
    return this.selected;
  } 

  this.move = function(deltaX,deltaY) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()+deltaX, this.points[i].getY()+deltaY);
  	}
  	this.draw();
  }


}