function Polygon(proc,center) {
  this.points = [];
  this.p = proc;
  this.selected = false;
  this.c = center;
  this.linkedPolygon =null;

  this.setLinkedPolygon  = function(poly) {
    this.linkedPolygon = poly;
  }

  this.addPoint = function(x,y) {
    this.points.push(new Point(x,y));
  }

  this.setCenter = function(c) {
    this.c = c;
  }

  this.copy = function(link) {
    var P = new Polygon(this.p,new Point(this.c.getX()+300,this.c.getY()+300));
    //this.p.println("OK2");
    for(i=0;i<this.points.length;i++) {
      //this.p.println("OK2.5");
      P.addPoint(this.points[i].getX()+300, this.points[i].getY()+300);
    }
    //this.p.println("OK3");
    P.draw();
    var P2 = null;
    if(this.linkedPolygon!=null && link ) {var P2 = this.linkedPolygon.copy(false);}
    //this.p.println("OK4 : "+P.points.length);
    var polys = [P];
    if(P2!=null) {
      polys.push(P2[0]);
      polys[0].setLinkedPolygon(polys[1]);
      polys[1].setLinkedPolygon(polys[0]);
      //P2[0].setLinkedPolygon(P1);
    }
    return polys;
  }

  this.getLenght = function() {
    return this.points.length;
  }

  this.isInPolygon =  function(x,y) {
  this.p.println("OK3.1 "+this.points.length);
  //this.p.println("OK");
	var p = new Point(x,y);
	var p2 = new Point(2000,y);
	var crossing = 0;
	for(f=0;f<this.points.length ;f++) {
    //this.p.println("OKK");
		if(isCrossing(p,p2, this.points[f],this.points[(f+1)%this.points.length] )  ) {
	    	crossing+=1;
	    }
    //this.p.println("OKKK "+i);
	}
    //this.p.println("END");
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
    //this.p.println("Res : "+res);
    /*while ( i<this.points.length && !res) {
      res = P.isInPolygon(this.points[i].getX(),this.points[i].getY() );
      i++;
    }*/
    return res;
  }

  this.displayCenter = function() {
    this.p.fill(255,0,0);
    this.p.ellipse(this.c.getX(),this.c.getY(),pointSize,pointSize);
    this.p.fill(100);
  }

  this.displayPoint = function() {
  	this.p.println(this.points[0].getX());
  	this.p.println(this.points[0].getY());
  }

  this.reduce = function(factor) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()/factor, this.points[i].getY()/factor);
  	}
    this.c = new Point(this.c.getX()/factor, this.c.getY()/factor);
  	this.draw();
  }

  this.draw = function() {
  	//this.p.background(155);
    //this.erase();
    if(this.isSelected()) {
      this.p.stroke(255,0,0);
    }


  	for(i=0;i<this.points.length;i++) {
      //this.p.println("OK3.2");
      this.p.ellipse(this.points[i].getX(), this.points[i].getY(), 5,5);
  		this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
  	}
    this.p.stroke(0);
  }

  this.erase =function(link) {
    this.p.stroke(155);
    this.p.fill(155);
    for(i=0;i<this.points.length;i++) {
      this.p.line(this.points[i].getX(), this.points[i].getY() ,this.points[(i+1)%this.points.length].getX(), this.points[(i+1)%this.points.length].getY());
    }
    this.p.stroke(0);
    if(this.linkedPolygon!=null && link ) {this.linkedPolygon.erase(false);}
  }

  this.select = function(link) {
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
    if(this.linkedPolygon!=null && link ) {this.linkedPolygon.select(false);}
  }

  this.isSelected = function() {
    return this.selected;
  }

  this.move = function(deltaX,deltaY,link) {
  	for(i=0;i<this.points.length;i++) {
  		this.points[i] = new Point(this.points[i].getX()+deltaX, this.points[i].getY()+deltaY);
  	}
    this.c = new Point(this.c.getX()+deltaX, this.c.getY()+deltaY);
    if(this.linkedPolygon!=null && link ) {this.linkedPolygon.move(deltaX,deltaY,false);}
  	this.draw();
  }

  this.rotate = function(angle,link) {
    angle = (angle/180)*Math.PI;
    for(i=0;i<this.points.length;i++) {
      var transX =   (this.points[i].getX() - this.c.getX() ) ;
      var transY =   (this.points[i].getY() - this.c.getY() ) ;
      var x = transX * Math.cos(angle) - transY * Math.sin(angle);
      var y = transX * Math.sin(angle) + transY * Math.cos(angle);
      this.points[i] = new Point(x + this.c.getX() ,y + this.c.getY() );
    }
    if(this.linkedPolygon!=null && link ) {this.linkedPolygon.rotate(angle,true);}
    this.draw();
  }

  this.getPoints = function() {
    return this.points;
  }



}
