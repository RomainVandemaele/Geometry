function HETD(center,proc) { //flat equilateral trangle
  var WIDTH =  300;
  var HEIGHT = (math.sqrt(3.0)/2.0)*WIDTH;

  this.p1 = new Point(center.getX() , center.getY() - HEIGHT/2 );
  this.p2 = new Point(center.getX() + WIDTH/2 , center.getY() + HEIGHT/2 );
  this.p3 = new Point(center.getX()  , center.getY() + HEIGHT/2 );
  this.c = center;

  this.move = [];
  this.endMove = false;
  this.p = proc;


  this.hasStarted = function() {
    return this.move.length!=0;
  }

  this.hasEnded = function() {
    return this.endMove;
  }

  this.begin = function(x,y) {
    //test if point on P1-P3
    /*if(isInTriangle(this.p1,this.p3,this.p2,x,y)) {
      this.p.println("Is in");
    }else {
      this.p.println("Is out");
    }*/
    if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p3.getX(),this.p3.getY(),x,y)) < 1500  && this.p1.getY() <= y && this.p3.getY() >= y  ) {
      this.move.push(new Point(x,y));
      this.p.fill(255,0,0);
      this.p.ellipse(x,y,pointSize,pointSize);
      this.p.fill(100);
    }

  }

  this.addPoint =function(x,y) {
    //test if point is ntérior
    this.p.println("ADD POINT");
    if(isInTriangle(this.p1,this.p2,this.p3,x,y)) {
      this.p.println("INTERIOR POINT");
      if(!this.crossed(x,y)) {
        if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p2.getX(),this.p2.getY(),x,y)) < 1250  ) { //other "face"
          //x = this.p2.getX();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }else if(math.abs(vectorProduct(this.p2.getX(),this.p2.getY(),this.p3.getX(),this.p3.getY(),x,y)) < 1000 )  {
          y = this.p2.getY();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }
        this.move.push(new Point(x,y));
        this.p.line(x,y,this.move[this.move.length-2].getX() ,this.move[this.move.length-2].getY());
        this.p.stroke(0,0,0);
      }else {
        for(i = 0;i<3;i++) {
          this.move.pop();
        }
        this.draw();
      }
    }
  }

  //Check is last added segement intersects another segment
  this.crossed = function(x,y) {
    var p = new Point(x,y);
    var res = false;
    for(i=0;i< this.move.length -3; i++) {
      res = isCrossing( this.move[i], this.move[i+1] ,this.move[this.move.length - 1],p) || res ;
    }
    return res;
  }

  this.resetMove = function() {
    this.move = [];
    this.endMove = false;
    this.draw();
  }

  this.draw = function() {
    this.p.background(155);
    this.p.ellipse(this.p1.getX(),this.p1.getY(),pointSize,pointSize);
    this.p.ellipse(this.p2.getX(),this.p2.getY(),pointSize,pointSize);
    this.p.ellipse(this.p3.getX(),this.p3.getY(),pointSize,pointSize);
    this.p.line(this.p1.getX(), this.p1.getY(), this.p2.getX(), this.p2.getY());
    this.p.line(this.p2.getX(), this.p2.getY(), this.p3.getX(), this.p3.getY());
    this.p.line(this.p3.getX(), this.p3.getY(), this.p1.getX(), this.p1.getY());
    for(i=0;i< this.move.length -1; i++) {
      this.p.line(this.move[i].getX(), this.move[i].getY() , this.move[i+1].getX(), this.move[i+1].getY() );
    }
  }

   this.drawUnFolded = function() {
    this.p.background(155);
    var polygons = [];
    var polygon = new Polygon(this.p,this.c);
    var polygon2 = new Polygon(this.p,this.c);

    polygon2.addPoint(this.p1.getX(),this.p1.getY());
    for(i = 0 ; i < this.move.length; i++) {
      polygon2.addPoint(  this.move[i].getX(), this.p1.getY() - (this.move[i].getY() - this.p1.getY() )    );
    }


    if(this.move[this.move.length-1].getY() == this.p2.getY()) {
      var x1 = this.move[this.move.length-1].getX();
      var x2 = this.p2.getX();
      polygon2.addPoint( x1 , this.p1.getY() - (this.p2.getY() - this.p1.getY())   );
      polygon2.addPoint( x2 , this.p1.getY() - (this.p2.getY() - this.p1.getY()) );

    }


    //polygon2.addPoint(this.p1.getX(),this.p1.getY());
    polygon2.reduce(2);
    polygons.push(polygon2);
    polygon.addPoint(this.p1.getX(),this.p1.getY());
    polygon.addPoint(this.p2.getX(),this.p2.getY());

    for(i = this.move.length -1 ; i >= 0; i--) {
      polygon.addPoint(  this.move[i].getX(), this.p2.getY() + ( this.p2.getY() - this.move[i].getY() )    );
    }

    polygon.addPoint(this.p3.getX(),this.p3.getY());
    polygon.reduce(2);
    polygon.setLinkedPolygon(polygon2);
    polygon.move(0,2);
    polygon2.setLinkedPolygon(polygon);
    polygons.push(polygon);
    return polygons;

  }

  this.printAngle = function() {
    this.p.println((calculateAngle(this.p1,this.p2,this.p3)/Math.PI)*180 );
    this.p.println(calculateAngle(this.p2,this.p3,this.p1));
    this.p.println(calculateAngle(this.p3,this.p1,this.p2));
  }


}
