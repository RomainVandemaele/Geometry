
function Tetrahedra(center,proc) { //flat equilateral trangle
  var WIDTH =  500;
  var HEIGHT = (math.sqrt(3.0)/2.0)*WIDTH;

  this.p1 = new Point(center.getX() - WIDTH/2 , center.getY() + HEIGHT/2 );
  this.p2 = new Point(center.getX() , center.getY() -  HEIGHT/2 );
  this.p3 = new Point(center.getX() + WIDTH/2 , center.getY() + HEIGHT/2 );


  this.p12 = bissectrix(this.p1,this.p2,proc);
  this.p23 = bissectrix(this.p2,this.p3,proc);
  this.p31 = bissectrix(this.p3,this.p1,proc);

  face1 = new Face(this.p12,this.p2,this.p23,proc); //above face
  face2 = new Face(this.p1,this.p12,this.p31,proc); //lower left
  face3 = new Face(this.p23,this.p31,this.p12,proc); //lower middle(bottom)
  face4 = new Face(this.p31,this.p23,this.p3,proc);  //lower right

  face1.setLeftFace(face2);
  face1.setRightFace(face4);
  face1.setBottomFace(face3);

  face2.setLeftFace(face1);
  face2.setRightFace(face3);
  face2.setBottomFace(face4);

  face3.setLeftFace(face4);
  face3.setRightFace(face2);
  face3.setBottomFace(face1);

  face4.setLeftFace(face3);
  face4.setRightFace(face1);
  face4.setBottomFace(face2);

  this.faces = [face1,face2,face3,face4];
  this.orderFace = [];
  this.currentFace = null;
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
    var i=0;
    while(i<this.faces.length) {
      //if(i!=2) //bottom face
      if(this.faces[i].begin(x,y) && i!=2) {
        this.currentFace = this.faces[i];
        this.orderFace.push(this.faces[i]);
        this.move.push(new Point(x,y));
        this.currentFace.addPoint(x,y);
        this.p.fill(255,0,0);
        this.p.ellipse(x,y,pointSize,pointSize);
        this.p.fill(100);
        i=this.faces.length;
      }
      i++;
    }
  }

  this.addPoint =function(x,y) {
    //test if point is interior
    if(this.currentFace.isIn(x,y)) {
      if(!this.crossed(x,y)) {
        var np=null;
        this.currentFace.addPoint(x,y);
        if( this.currentFace.end(x,y) ) {
          var nextFace = this.currentFace.nextFace();
          if(!nextFace.isFolded()) {
            np = this.currentFace.nextPoint(x,y);
            this.currentFace = nextFace;
            this.orderFace.push(nextFace);
            this.endMove = true;
            this.p.println("END");
          }else {
            this.endMove = true;
          }
        }
        this.move.push(new Point(x,y));

        this.p.line(x,y,this.move[this.move.length-2].getX() ,this.move[this.move.length-2].getY());
        if(np!=null) {
          this.move.push(new Point(np.getX(),np.getY()));
          this.currentFace.addPoint(np.getX(),np.getY());
          //this.p.line(x,y,np.getX() ,np.getY());
        }
        //this.p.line(x,y,this.move[this.move.length-2].getX() ,this.move[this.move.length-2].getY());
        this.p.stroke(0,0,0);
      }else {
          this.move.pop();
        this.draw();
      }
    }
  }

  //Check is last added segement intersects another segment
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
    this.orderFace = [];
    this.currentFace = null;
    for(var i=0;i<this.faces.length;i++) {
      this.faces[i].reset();
    }
    this.draw();
  }

  this.draw = function() {
    this.p.background(155);
    this.p.ellipse(this.p1.getX(),this.p1.getY(),pointSize,pointSize);
    this.p.ellipse(this.p2.getX(),this.p2.getY(),pointSize,pointSize);
    this.p.ellipse(this.p3.getX(),this.p3.getY(),pointSize,pointSize);
    this.p.ellipse(this.p12.getX(),this.p12.getY(),pointSize,pointSize);
    this.p.ellipse(this.p23.getX(),this.p23.getY(),pointSize,pointSize);
    this.p.ellipse(this.p31.getX(),this.p31.getY(),pointSize,pointSize);

    this.p.line(this.p1.getX(), this.p1.getY(), this.p2.getX(), this.p2.getY());
    this.p.line(this.p2.getX(), this.p2.getY(), this.p3.getX(), this.p3.getY());
    this.p.line(this.p3.getX(), this.p3.getY(), this.p1.getX(), this.p1.getY());
    this.p.line(this.p12.getX(), this.p12.getY(), this.p23.getX(), this.p23.getY());
    this.p.line(this.p12.getX(), this.p12.getY(), this.p31.getX(), this.p31.getY());
    this.p.line(this.p31.getX(), this.p31.getY(), this.p23.getX(), this.p23.getY());


    for(i=0;i< this.move.length -1; i++) {
      this.p.line(this.move[i].getX(), this.move[i].getY() , this.move[i+1].getX(), this.move[i+1].getY() );
    }
  }

   this.drawUnFolded = function() {

     this.p.fill(100);
     var polygons = [];
     if(this.orderFace.length == 2 && this.orderFace[1] == this.faces[2] ) { //add verif endFace = bottom
       var polygon = new Polygon(this.p,this.c);

       //this.p.println("OK");
       var move = this.orderFace[0].getMove();
       //this.p.println("OK");
       var be = this.orderFace[0].getBegingEdge();
       //this.p.println("OK");
       var eqe = this.orderFace[0].getEquivalentEdge(be);
       var face = this.orderFace[0].getEquivalentFace(be);
       var points = face.getPoints();
       var medianPoint = this.p31;
       if(be.getP2().isEqual(this.p12) || eqe.getP2().isEqual(this.p12) || be.getP1().isEqual(this.p12) || eqe.getP1().isEqual(this.p12) ) {
         medianPoint = this.p12;
       }else if(be.getP2().isEqual(this.p23) || eqe.getP2().isEqual(this.p23) || be.getP1().isEqual(this.p23) || eqe.getP1().isEqual(this.p23) ) {
         medianPoint = this.p23;
       }
       var extremePoint = this.p3;
       if(medianPoint.isEqual(this.p23)) {
         extremePoint = this.p1;
       }else if(medianPoint.isEqual(this.p31)) {
         extremePoint = this.p2;
       }
       polygon.addPoint(medianPoint.getX(), medianPoint.getY() ); //top point
       for(var i=move.length-1;i>=0;i--) {
         //get symetric point
         var p = symetry(move[i],be.getP1(),be.getP2());
         //applying second symetry with the perpendicar line passing by bisectrix as axis
         var p2 = symetry(p,medianPoint,extremePoint);
         polygon.addPoint(p2.getX(),p2.getY());
       }
       var nextP = eqe.getP1();
       if(nextP.isEqual(medianPoint)) {
         nextP = eqe.getP2();
       }
       polygon.addPoint(nextP.getX(), nextP.getY() ); //top point
       for(var k=0;k<points.length;k++) {
         if(!points[k].isEqual(eqe.getP1()) && !points[k].isEqual(eqe.getP2())) {
           polygon.addPoint(points[k].getX(),points[k].getY());
         }
       }
       //polygon.addPoint(points[2].getX(), points[2].getY() ); //top point

       //this.p.println("OK");
       polygons.push(polygon);
       this.p.println("OK");
       return polygons;
     }
     return polygons;

   }
}
