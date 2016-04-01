function Edge(p1,p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.getP1 = function() {return p1;}
  this.getP2 = function() {return p2;}

}

function Face(p1,p2,p3,proc) {
  this.point = [p1,p2,p3];
  this.edges  = [new Edge(p1,p2), new Edge(p2,p3), new Edge(p3,p1)];
  this.p =proc;


  this.folded = false; //indicate if the cut is over
  this.beginEdge = -1;
  this.endEdge = -1;
  this.moves = [];

  this.lf = null;
  this.bf = null;
  this.rf = null;
  this.neighbours = [this.lf,this.rf,this.bf];

  this.getNeighbours = function() {
    return this.neighbours;
  }

  this.setLeftFace = function(lf) {this.lf = lf;}  //face adjacent to p1-p2
  this.setRightFace = function(rf) {this.rf = rf;} //face adjacent to p2-p3
  this.setBottomFace = function(bf) {this.bf = bf;}  //face adjacent to p3-p1

  this.getLeftFace = function() {return this.lf;}
  this.getRightFace = function() {return this.rf;}
  this.getBottomFace = function() {return this.bf;}


  this.getMove = function() {
    return this.moves;
  }

  this.getPoints = function() {
    return this.point;
  }

  this.getEdges = function() {
    return this.edges;
  }

  this.getEndPoint = function(order) {
    var e1 = this.edges[this.endEdge];
    var nf = this.nextFace();
    var e2 = nf.edges[nf.beginEdge];
    if(e1.getP1().isEqual(e2.getP1()) || e1.getP1().isEqual(e2.getP2())) {
      if( order ){
        return e1.getP1();
      }else {
        return e1.getP2();
      }
    }else if( e1.getP2().isEqual(e2.getP1()) || e1.getP2().isEqual(e2.getP2()) ) {
      if( order ){
        return e1.getP2();
      }else {
        return e1.getP1();
      }
    }
  }

  this.getEquivalentEdge = function(edge) { //get an edge P1-P2 which is the same that P3-P4 on the tedrahedra but not on the development such that  P1=P3
    var edgeNumber = -1;
    for(var j=0;j<this.edges.length;j++) {
      if(edge == this.edges[j]) {
        edgeNumber = j;
      }
    }
    var face = this.lf;
    if(edgeNumber == 1) {
      face = this.rf;
    }else if(edgeNumber == 2){
      face = this.bf;
    }

    var e = face.getEdges();
    e = e[edgeNumber];
    if(edgeNumber != 2) { //not bottom face
      e = new Edge(e.getP2(),e.getP1());
    }
    return e;
  }

  this.getEquivalentFace = function(edge) { //get an edge P1-P2 which is the same that P3-P4 on the tedrahedra but not on the development such that  P1=P3
    var edgeNumber = -1;
    for(var j=0;j<this.edges.length;j++) {
      if(edge == this.edges[j]) {
        edgeNumber = j;
      }
    }
    var face = this.lf;
    if(edgeNumber == 1) {
      face = this.rf;
    }else if(edgeNumber == 2){
      face = this.bf;
    }
    return face;
  }



  this.getEndingEdge = function() {return this.edges[this.endEdge];}
  this.getBegingEdge = function() {return this.edges[this.beginEdge];}
  this.getNonUsedEdge = function() {
    for(var i=0;i<this.edges.length;i++) {
      if(i!=this.beginEdge && i!=this.endEdge) {
          return this.edges[i];
      }
    }
  }

  this.addPoint = function(x,y) {
    this.moves.push(new Point(x,y));
  }

  this.isIn = function(x,y) {
    return isInTriangle(this.point[0],this.point[1],this.point[2],x,y);
  }

  this.begin = function(x,y) {
    for(var i=0;i<this.edges.length;i++) {
      var p1 = this.edges[i].getP1();
      var p2 = this.edges[i].getP2();
      if(math.abs(vectorProduct(p1.getX(),p1.getY(),p2.getX(),p2.getY(),x,y)) < LIMIT && (( y >= p1.getY() && y <= p2.getY() ) || ( y <= p1.getY() && y >= p2.getY() ) || (p1.getY()== p2.getY() && math.abs(p1.getY() - y) <=20 && ((x>=p1.getX() && x<=p2.getX()) || (x<=p1.getX() && x>=p2.getX()) )   )  )  ) {
        this.beginEdge = i;
        return true;
      }
    }
    return false;
  }

  this.end = function(x,y) {
    for(var j=0;j<this.edges.length;j++) {
      var p1 = this.edges[j].getP1();
      var p2 = this.edges[j].getP2();
      if(j!=this.beginEdge && math.abs(vectorProduct(p1.getX(),p1.getY(),p2.getX(),p2.getY(),x,y)) < LIMIT && (( y >= p1.getY() && y <= p2.getY() ) || ( y <= p1.getY() && y >= p2.getY() ) || (p1.getY()== p2.getY() && math.abs(p1.getY() - y) <=20 )  )  ) {
        this.p.fill(0,255,0);
        this.p.ellipse(x,y,pointSize,pointSize);
        this.endEdge = j;
        this.folded = true;
        return true;
      }
    }
    return false;
  }

  this.nextFace = function() {
    if(this.endEdge!=-1) {
      if(this.endEdge==0) {
        return this.lf;
      }else if(this.endEdge==1) {
        return this.rf;
      }else if(this.endEdge==2) {
        return this.bf;
      }
    }else {
      return null;
    }
  }

  //get the point to the last point of the cut  on the adjacent face in the development serving as support for the cut
  this.nextPoint = function(x,y) {
    var nextFace = this.nextFace();
    if(nextFace!=null) {
      var oldP1 = this.edges[this.endEdge].getP1();
      var oldP2 = this.edges[this.endEdge].getP2();
      var newP1 = nextFace.edges[this.endEdge].getP1();
      var newP2 = nextFace.edges[this.endEdge].getP2();
      nextFace.beginEdge = this.endEdge;
      if(!((oldP1 == newP1 && oldP2 == newP2) || (oldP1 == newP2 && oldP2 == newP1) )) {
        var deltaX = math.ceil(oldP1.getX() - x);
        var deltaY = math.ceil(oldP1.getY() - y);
        this.p.ellipse(newP2.getX() + deltaX, newP2.getY() +deltaY ,pointSize,pointSize);
        return new Point(newP2.getX() + deltaX,newP2.getY() + deltaY );
      }else { //same edge graphically because edge to the bottom face is adjacent in the development
        return new Point(x,y);
      }

    }
  }

  this.setFolded =function(){this.folded=true;}

  this.isFolded = function() {
    return this.folded;
  }

  //reset the cut as it was before beginning
  this.reset = function() {
    this.folded = false;
    this.beginEdge = -1;
    this.endEdge = -1;
    this.moves = [];
  }
}
