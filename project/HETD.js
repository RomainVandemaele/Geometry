function HETD(center,proc) { //flat half equilateral triangle
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

  //Test if the point is an the beginning edge of a cut
  this.begin = function(x,y) {
    if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p3.getX(),this.p3.getY(),x,y)) < LIMIT  && this.p1.getY() <= y && this.p3.getY() >= y  ) {
      this.move.push(new Point(x,y));
      this.p.fill(255,0,0);
      this.p.ellipse(x,y,pointSize,pointSize);
      this.p.fill(100);
    }

  }
  //advance in the cut with a point
  this.addPoint =function(x,y) {
    //test if point is interior
    if(isInTriangle(this.p1,this.p2,this.p3,x,y)) {
      if(!this.crossed(x,y)) {
        //end cut if arrive at an edge
        if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p2.getX(),this.p2.getY(),x,y)) < LIMIT  ) { //other "face"
          this.p.stroke(255,0,0);
          this.endMove = true;
        }else if(math.abs(vectorProduct(this.p2.getX(),this.p2.getY(),this.p3.getX(),this.p3.getY(),x,y)) < LIMIT )  {
          y = this.p2.getY();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }
        this.move.push(new Point(x,y));
        this.p.line(x,y,this.move[this.move.length-2].getX() ,this.move[this.move.length-2].getY());
        this.p.stroke(0,0,0);
      }else {
        //if intersections detected, the 3 last moves are removed
          this.move.pop();
        this.draw();
      }
    }
  }

  //Check is last added segemnt intersects another segment
  this.crossed = function(x,y) {
    var p = new Point(x,y);
    var res = false;
    for(i=0;i<= this.move.length -3; i++) {
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

  //Create unfolded polygon which is a development
  //By unfolding with P2-P3 and P1-P2
   this.drawUnFolded = function() {
    var polygons = [];
    var polygon = new Polygon(this.p,this.c);
    polygon.addPoint(this.p3.getX(),this.p3.getY());
    //P2-P3(Bottom) part
    for(var i=0;i<this.move.length;i++) {
      polygon.addPoint(this.move[i].getX(), this.move[i].getY() + 2*(this.p3.getY() - this.move[i].getY()) );
    }
    polygon.addPoint(this.p2.getX(),this.p2.getY());
    //P2-P1(right) part by symettry of move on it
    for(j=this.move.length-1;j>=0;j--) {
      var p = symetry(new Point(this.move[j].getX(),this.move[j].getY()),this.p1,this.p2);
      polygon.addPoint(p.getX(), p.getY() );
    }
    polygon.addPoint(this.p1.getX(),this.p1.getY());
    polygons.push(polygon);
    return polygons;

  }

}
