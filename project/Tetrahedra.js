function Edge(p1,p2) {
  this.p1 = p1;
  this.p2 = p2;
}

function Face(p1,p2,p3,proc) {
  this.point = [p1,p2,p3];
  this.edges  = [new Edge(p1,p2), new Edge(p2,p3), new Edge(p3,p1)];
  this.p =proc;
  this.setLeftFace = function(lf) {this.lf = lf;}  //face adjacent to p1-p2
  this.setRightFace = function(rf) {this.rf = rf;} //face adjacent to p2-p3
  this.setBottomFace = function(bf) {this.bf = bf;}  //face adjacent to p3-p1

  this.printCenter = function() {
    this.p.fill(255,0,0);
    var deltaX = this.point[2].getX() -  this.point[0].getX();
    var deltaY = this.point[1].getY() -  this.point[0].getY();
    this.p.ellipse(this.point[0].getX() + deltaX/2, this.point[0].getY() + deltaY/2 ,pointSize,pointSize);
    this.p.fill(0,0,0);
  }

  this.isIn = function(x,y) {
    return isInTriangle(this.point[0],this.point[1],this.point[2],x,y);
  }

  this.begin = function(x,y) {
    return math.abs(vectorProduct(this.point[0].getX(),this.point[0].getY(),this.point[1].getX(),this.point[1].getY(),x,y)) < 1500  && this.point[0].getY() >= y && this.point[1].getY() <= y ;
  }
}

function Tetrahedra(center,proc) { //flat equilateral trangle
  var WIDTH =  500;
  var HEIGHT = (math.sqrt(3.0)/2.0)*WIDTH;

  this.p1 = new Point(center.getX() - WIDTH/2 , center.getY() + HEIGHT/2 );
  this.p2 = new Point(center.getX() , center.getY() -  HEIGHT/2 );
  this.p3 = new Point(center.getX() + WIDTH/2 , center.getY() + HEIGHT/2 );


  this.p12 = bissectrice(this.p1,this.p2,proc);
  this.p23 = bissectrice(this.p2,this.p3,proc);
  this.p31 = bissectrice(this.p3,this.p1,proc);

  face1 = new Face(this.p12,this.p2,this.p23,proc); //above face
  face2 = new Face(this.p1,this.p12,this.p31,proc); //lower left
  face3 = new Face(this.p12,this.p31,this.p23,proc); //lower middle(bottom)
  face4 = new Face(this.p31,this.p23,this.p3,proc);  //lower right

  face1.setLeftFace(face2);
  face1.setRightFace(face4);
  face1.setBottomFace(face3);

  face2.setLeftFace(face1);
  face2.setRightFace(face4);
  face2.setBottomFace(face3);

  face3.setLeftFace(face2);
  face3.setRightFace(face4);
  face3.setBottomFace(face1);

  face4.setLeftFace(face3);
  face4.setRightFace(face1);
  face4.setBottomFace(face2);

  this.faces = [face1,face2,face3,face4];
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
      if(this.faces[i].begin(x,y)) {
        this.currentFace = this.faces[i];
        this.move.push(new Point(x,y));
        this.p.fill(255,0,0);
        this.p.ellipse(x,y,pointSize,pointSize);
        this.p.fill(100);
        i=this.faces.length;
      }
      i++;
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
        }else if(math.abs(vectorProduct(this.p2.getX(),this.p2.getY(),this.p3.getX(),this.p3.getY(),x,y)) < 1250 )  {
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
    this.p.ellipse(this.p12.getX(),this.p12.getY(),pointSize,pointSize);
    this.p.ellipse(this.p23.getX(),this.p23.getY(),pointSize,pointSize);
    this.p.ellipse(this.p31.getX(),this.p31.getY(),pointSize,pointSize);

    this.p.line(this.p1.getX(), this.p1.getY(), this.p2.getX(), this.p2.getY());
    this.p.line(this.p2.getX(), this.p2.getY(), this.p3.getX(), this.p3.getY());
    this.p.line(this.p3.getX(), this.p3.getY(), this.p1.getX(), this.p1.getY());
    this.p.line(this.p12.getX(), this.p12.getY(), this.p23.getX(), this.p23.getY());
    this.p.line(this.p12.getX(), this.p12.getY(), this.p31.getX(), this.p31.getY());
    this.p.line(this.p31.getX(), this.p31.getY(), this.p23.getX(), this.p23.getY());

    /*face1.printCenter();
    face2.printCenter();
    face3.printCenter();
    face4.printCenter();*/

    for(i=0;i< this.move.length -1; i++) {
      this.p.line(this.move[i].getX(), this.move[i].getY() , this.move[i+1].getX(), this.move[i+1].getY() );
    }
  }

   this.drawUnFolded = function() {}

  this.printAngle = function() {
    this.p.println((calculateAngle(this.p1,this.p2,this.p3)/Math.PI)*180 );
    this.p.println(calculateAngle(this.p2,this.p3,this.p1));
    this.p.println(calculateAngle(this.p3,this.p1,this.p2));
  }


}
