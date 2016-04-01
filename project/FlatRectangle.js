
function FlatRectangle(center,proc) {
  var WIDTH =  500;
  var HEIGHT = 225;
  this.p1 = new Point(center.getX() - WIDTH/2 , center.getY() - HEIGHT/2 );
  this.p2 = new Point(center.getX() + WIDTH/2 , center.getY() - HEIGHT/2 );
  this.p3 = new Point(center.getX() + WIDTH/2 , center.getY() + HEIGHT/2 );
  this.p4 = new Point(center.getX() - WIDTH/2 , center.getY() + HEIGHT/2 );


  this.move = [];
  this.endMove = false;
  this.p = proc;
  this.c = center;

  //indicate if the cut has begun
  this.hasStarted = function() {
    return this.move.length!=0;
  }

  //indicate if the cut is over
  this.hasEnded = function() {
    return this.endMove;
  }

  this.begin = function(x,y) {
    //test if point on P1-14 : the edge to begin the cut
    if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p4.getX(),this.p4.getY(),x,y)) < LIMIT  && this.p1.getY() <= y && this.p4.getY() >= y  ) {
      this.move.push(new Point(this.p1.getX(),y));
      this.p.fill(255,0,0);
      this.p.ellipse(this.p1.getX(),y,pointSize,pointSize);
      this.p.fill(100);
    }

  }

  //add a point of the cut
  this.addPoint =function(x,y) {
    //test if point is intérior
    if(this.p1.getY() <= y && this.p4.getY() >= y && this.p1.getX() <= x && this.p2.getX() >= x) {
      if(!this.crossed(x,y)) {   //Check is last added segment intersects another segment
        if( math.abs(vectorProduct(this.p2.getX(),this.p2.getY(),this.p3.getX(),this.p3.getY(),x,y)) < LIMIT  ) { //other "face"
          x = this.p2.getX();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }else if( math.abs(vectorProduct(this.p1.getX(),this.p1.getY(),this.p2.getX(),this.p2.getY(),x,y)) < LIMIT && ( math.abs(this.p1.getY() - y) <=20 && x>=this.p1.getX() && x<=this.p2.getX() ) ) {
          y = this.p2.getY();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }else if( math.abs(vectorProduct(this.p4.getX(),this.p4.getY(),this.p3.getX(),this.p3.getY(),x,y)) < LIMIT && (math.abs(this.p3.getY() - y) <=20 && x<=this.p3.getX() && x>=this.p4.getX() )     ) {
          y = this.p4.getY();
          this.p.stroke(255,0,0);
          this.endMove = true;
        }
        this.move.push(new Point(x,y));
        this.p.line(x,y,this.move[this.move.length-2].getX() ,this.move[this.move.length-2].getY());
        this.p.stroke(0,0,0);
      }else { //if there is a crossing inthe cu the last 3 moves are removed
          this.move.pop();
        this.draw();
      }
    }
  }

  //Check is last added segment intersects another segment of the cut
  this.crossed = function(x,y) {
    var p = new Point(x,y);
    var res = false;
    for(i=0;i<= this.move.length -3; i++) {
      res = isCrossing( this.move[i], this.move[i+1] ,this.move[this.move.length - 1],p) || res ;
    }
    return res;
  }
  //reset the cut by removing all existing recording of it
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
    this.p.ellipse(this.p4.getX(),this.p4.getY(),pointSize,pointSize);
    this.p.line(this.p1.getX(), this.p1.getY(), this.p2.getX(), this.p2.getY());
    this.p.line(this.p2.getX(), this.p2.getY(), this.p3.getX(), this.p3.getY());
    this.p.line(this.p3.getX(), this.p3.getY(), this.p4.getX(), this.p4.getY());
    this.p.line(this.p4.getX(), this.p4.getY(), this.p1.getX(), this.p1.getY());
    for(i=0;i< this.move.length -1; i++) {
      this.p.line(this.move[i].getX(), this.move[i].getY() , this.move[i+1].getX(), this.move[i+1].getY() );
    }
  }

   this.drawUnFolded = function() {
     this.p.background(155);
     //cut by bottom line
     var factor1 = -HEIGHT;
     var factor2 = 0;
     if(this.move[this.move.length-1].getY() == this.p1.getY()) { //cut by the above line
       factor1 = 0;
       factor2 = HEIGHT;
     }

     var polygon = new Polygon(this.p,this.c);
     polygon.addPoint(this.p1.getX(),this.p1.getY());
     //add unfoding from above
     for(i = 0 ; i < this.move.length; i++) {
       polygon.addPoint(  this.move[i].getX(), this.p1.getY() - (this.move[i].getY() - this.p1.getY() )    );
     }
     var x1 = this.move[this.move.length-1].getX();
     var x2 = this.p2.getX();
     if(x1 < x2) { //cut by above or bottom face
       polygon.addPoint( x1 , this.p2.getY() + factor1 );
       polygon.addPoint( x2 , this.p2.getY() + factor1 );
     }

     polygon.addPoint(this.p2.getX(),this.p2.getY());
     polygon.addPoint(this.p3.getX(),this.p3.getY());
     x1 = this.move[this.move.length-1].getX();
     x2 = this.p3.getX();
     if(x1 < x2) {
       polygon.addPoint( x2 , this.p3.getY() + factor2  );
       polygon.addPoint( x1 , this.p3.getY() + factor2  );
     }
     //add unfoding from bottom
     for(i = this.move.length -1 ; i >= 0; i--) {
       polygon.addPoint(  this.move[i].getX(),   this.p4.getY() + ( this.p4.getY() - this.move[i].getY() )    );
     }

     polygon.addPoint(this.p4.getX(),this.p4.getY());
     polygon.reduce(2.5);
     var polygons = [];
     polygons.push(polygon);
     return polygons;
  }

}
