src="processing.js"
src="math.js"

var pointSize = 10;
  var pointMarked = false;
  var dcel;

  function Point(x, y) {
      this.x = x;
      this.y = y;
      this.getX = function () {return this.x;}
      this.getY = function () {return this.y;}
    function re
  }

  function vectorProduct(a,b,c) {
    return (b.getX() - a.getX() )*(c.getY() - b.getY()) - (b.getY() - a.getY() )*(c.getX() - b.getX());
  }

  function Vertex(x, y) {
      this.x = x;
      this.y = y;
      this.getX = function () {return this.x;}
      this.getY = function () {return this.y;}
      this.setX = function (x) {this.x = x;}
      this.setY = function (y) {this.y = y;}
      this.setHalfEdge = function (he) {this.halfEdge = he;}
      this.getHalfEdge = function () {return this.halfEdge;}

      this.distanceTo = function(b) {
        var dx = this.x - b.x;
        var dy = this.y - b.y;
        return Math.sqrt(dx*dx + dy*dy);
      }

      this.isPoint = function(a) { return this.distanceTo(a) < pointSize; }

      this.getAdjacent = function() {
        var adjacent = [];
        var h = this.getHalfEdge();
        var firstNeghbour = h.getTarget();
        adjacent.push(h.getTarget());
        var stop = false;
        while( !stop ) {
          h = h.getTwin();
          h = h.getNext();
          if(h.getTarget()!= firstNeghbour) {
            adjacent.push(h.getTarget());
          }else {stop = true;}
        }

        return adjacent;
      }

      this.getFace = function(q) {
        //var adjacent = [];
        //console.log("NULL");
        var h = this.getHalfEdge();
        var firstNeghbour = h.getTarget();
        var prevPoint = h.getPrevious().getPrevious().getTarget();
        if (vectorProduct(h.getPrevious().getTarget(),prevPoint, q) * vectorProduct(h.getPrevious().getTarget(),firstNeghbour,q) <0 ) {
            return h.getFace();
        }
        //adjacent.push(h.getTarget());
        var stop = false;
        while( !stop ) {
          h = h.getTwin();
          var prevPoint = h.getPrevious().getTarget();
          var nextPoint = h.getNext().getTarget();
          if( vectorProduct(h.getTarget(),prevPoint, q) * vectorProduct(h.getTarget(),nextPoint,q) <0   )  {
            return h.getFace();
          }else if(h.getNext().getTarget()== firstNeghbour) {
            stop = true;
          }
          h = h.getNext();
        }
        console.log("NULL");
        return h.getFace();
      }
  }

  function Face() {
      this.setHalfEdge = function (he) {this.halfEdge = he;}
      this.getHalfEdge = function () {return this.halfEdge;}

      this.colour = function(processing) {
        var initialH = this.getHalfEdge();
        var h = initialH;
        var stop = false;
        
        while(!stop) {
          //processing.println("LOOP");
          processing.fill(0,255,0);
          //processing.println(h.getPrevious().getTarget().getX() + " " + h.getPrevious().getTarget().getY()+ " " + h.getTarget().getX() + " " + h.getTarget().getY());
          processing.ellipse(h.getTarget().getX(),h.getTarget().getY(),pointSize,pointSize);
          //processing.line(h.getPrevious().getTarget().getX(),h.getPrevious().getTarget().getY(),h.getTarget().getX(),h.getTarget().getY());
          h = h.getNext();
          if(h==initialH) {
            stop = true;
          }
        }
        processing.fill(0,0,0);
        //processing.println("END");
      }
  }

  function HalfEdge() {
      this.getPrevious = function () {return this.previous;} //halfEdge
      this.getNext = function () {return this.next;} //halfEdge
      this.getTwin = function () {return this.twin;} //halfEdge
      this.getFace = function () {return this.face;} //face
      this.getTarget = function () {return this.target;} //a point

      this.setPrevious = function (previous) {this.previous = previous;}
      this.setNext = function (next) {this.next = next;}
      this.setTwin = function (twin) {this.twin = twin;}
      this.setFace = function (face) {this.face = face;}
      this.setTarget = function (target) {this.target = target;}
  }

  function DCEL(processing) {
    this.faces = [];
    this.halfEdges = [];
    this.vertices = [];
    this.processing = processing;
    this.markedIndex1 = -1;
    this.markedIndex2 = -1;

    this.addFace = function (face) {this.faces.push(face);}
    this.addVertex = function (vertex) {
      this.vertices.push(vertex);
    }
    this.addHalfEdge = function (halfEdge) {this.halfEdges.push(halfEdge);}

    this.initialize = function () {
      this.processing.fill(0,0,0);
      this.addFace(new Face()); //face interieur
      this.addFace(new Face()); //face exterieur
      var centerX = 900 / 2, centerY = 500 / 2, delta = 50;
      this.addVertex(new Vertex(centerX-delta,centerY-delta));
      this.addVertex(new Vertex(centerX-delta,centerY+delta));
      this.addVertex(new Vertex(centerX+delta,centerY+delta));
      this.addVertex(new Vertex(centerX+delta,centerY-delta));
      
      for (i = 0; i < 8; i++) {
        this.addHalfEdge(new HalfEdge());
      }

      for (i = 0; i < this.vertices.length; i++) {
        this.vertices[i].setHalfEdge(this.halfEdges[ i%(this.halfEdges.length) ]);
        this.processing.ellipse(this.vertices[i].getX(),this.vertices[i].getY(),pointSize,pointSize);
        this.processing.line(this.vertices[i].getX(),this.vertices[i].getY(),this.vertices[(i+1)%this.vertices.length].getX(),this.vertices[(i+1)%this.vertices.length].getY())
      }

      this.faces[0].setHalfEdge(this.halfEdges[0]);
      this.faces[1].setHalfEdge(this.halfEdges[4]);

      for (i = 0; i < 4; i++) {
        this.halfEdges[i].setTwin(this.halfEdges[i+4]);
        this.halfEdges[i].setPrevious(this.halfEdges[(((i-1)%4)+4)%4]);
        this.halfEdges[i].setNext(this.halfEdges[(i+1)%4]);
        this.halfEdges[i].setFace(this.faces[0]);
        this.halfEdges[i].setTarget(this.vertices[(i+1)%4]);
        this.processing.println("edge "+i+" :  twin = "+(i+4) + " previous = "+ ((((i-1)%4)+4)%4) + " next = " + ((i+1)%4) + " target = " + ((i+1)%4) );
      }

       for (i = 4; i < 8; i++) {
        this.halfEdges[i].setTwin(this.halfEdges[i-4]);
        this.halfEdges[i].setPrevious(this.halfEdges[((i-4+1)%4)+4]);
        this.halfEdges[i].setNext(this.halfEdges[((((i-4-1)%4)+4)%4)+4]);
        this.halfEdges[i].setFace(this.faces[1]);
        this.halfEdges[i].setTarget(this.vertices[i-4]);
        this.processing.println("edge "+i+" :  twin = "+(i-4) + " previous = " + (((i-4+1)%4)+4) + " next = "+ (((((i-4-1)%4)+4)%4)+4) + " target = " + (i-4) );
      }

    }

    this.findVertex = function (p) {
      var i=0;
      var found = false;
      while( i< this.vertices.length && !found) {
        if(this.vertices[i].isPoint(p)==true) {
          found = true;
          if(this.markedIndex1 == -1) {
            this.markedIndex1 = i;
          }else {
            this.markedIndex2 = i;
          }
          this.processing.fill(255,0,0);
          this.processing.ellipse(this.vertices[i].getX(),this.vertices[i].getY(),pointSize,pointSize);
          this.processing.fill(0,0,0);
        }
        i++;
      }
      return found;
    }

    this.addVertexAt = function (v) {
      var f = this.vertices[this.markedIndex1].getFace(v);
      f.colour(this.processing);

      //var f = f2; //TO Do : find good face, left from v 
      var h = f.getHalfEdge(); 
      while(h.getTarget() != this.vertices[this.markedIndex1]) {
        h = h.getNext();
      }
      
      var h1 = new HalfEdge(), h2 = new HalfEdge();
      v.setHalfEdge(h2);
      h1.setTwin(h2);
      h2.setTwin(h1);
      h1.setTarget(v);
      h2.setTarget(this.vertices[this.markedIndex1]);
      h1.setFace(f);
      h2.setFace(f);
      h1.setNext(h2);
      h2.setNext(h.getNext());
      h1.setPrevious(h);
      h2.setPrevious(h1);
      h.setNext(h1);
      h2.getNext().setPrevious(h2);
      this.addHalfEdge(h1);
      this.addHalfEdge(h2);
      this.addVertex(v);
      //recoloring in black + reinit markedVertex
      this.processing.ellipse(this.vertices[this.markedIndex1].getX(),this.vertices[this.markedIndex1].getY(),pointSize,pointSize);
      this.processing.line(this.vertices[this.markedIndex1].getX(),this.vertices[this.markedIndex1].getY(),v.getX(),v.getY());
      this.markedIndex1 = -1;
    }

    this.splitFace = function (v) {
      var f = this.faces[1]; //TO Do : find good face, left from v 
      var h = this.vertices[this.markedIndex1].getHalfEdge();
     
      if(h.getFace()!=f) {
        h = h.getTwin();
      }
      while(h.getTarget() != this.vertices[this.markedIndex1]) {
        h = h.getNext();
      }
      //Les 2 vertexs ne peuvent pas êtres adjacent
      if(h.getNext().getTarget!=this.vertices[this.markedIndex2] && h.getPrevious().getTarget!=this.vertices[this.markedIndex2]) { 
        processing.println("OK2");
        var f1 = new Face();
        var f2 = new Face();
        processing.println("OK2");
        var h1 = new HalfEdge();
        var h2 = new HalfEdge();
        f1.setHalfEdge(h1);
        f2.setHalfEdge(h2);
        h1.setTwin(h2);
        h2.setTwin(h1);
        processing.println("OK2.5");
        h1.setTarget(this.vertices[this.markedIndex2]);
        h2.setTarget(this.vertices[this.markedIndex1]);
        h2.setNext(h.getNext());
        h2.getNext().setPrevious(h2);
        processing.println("OK2.75");
        h1.setPrevious(h);
        h.setNext(h1);
        processing.println("OK3");
        var stop = true;
        var i = h2;
        while(!stop) {
          i.setFace(f2);
          if(i.getTarget()==this.vertices[this.markedIndex2]) {
            stop = true;
          }
          i = i.getNext();
        }
        processing.println("OK4");
        h1.setNext(i.getNext());
        h1.getNext().setPrevious(h1);
        i.setNext(h2);
        h2.setPrevious(i);
        i = h1;
        while(i.getTarget()!=this.vertices[this.markedIndex1]) {
          i.setFace(f1);
          i = i.getNext();

        }
        processing.println("OK5");
        this.addFace(f1);
        this.addFace(f2);
        this.addHalfEdge(h1);
        this.addHalfEdge(h2);
        
        for(var j=0;j< this.faces.length;j++) {
          if(this.faces[j]==f) {
            this.faces.splice(j,1);
          }
        }

        this.processing.line(this.vertices[this.markedIndex1].getX(),this.vertices[this.markedIndex1].getY(),this.vertices[this.markedIndex2].getX(),this.vertices[this.markedIndex2].getY());
        processing.println("OK7");
      }
        //recoloring in black + reinit markedVertex
        this.processing.ellipse(this.vertices[this.markedIndex1].getX(),this.vertices[this.markedIndex1].getY(),pointSize,pointSize);
        this.processing.ellipse(this.vertices[this.markedIndex2].getX(),this.vertices[this.markedIndex2].getY(),pointSize,pointSize);
        this.markedIndex1 = -1;
        this.markedIndex2 = -1;
      
    }
    //this.splitEdge = function (e) {}



  }






// Simple way to attach js code to the canvas is by using a function
function sketchProc(processing) {
  
  processing.setup = function () {
    processing.size(900,500);
    processing.fill( 0, 0, 0 );
    dcel = new DCEL(processing);
    dcel.initialize();
  };

  processing.mouseClicked = function () {
    if(!pointMarked) {
      pointMarked = dcel.findVertex(new Point(processing.mouseX,processing.mouseY));
    }else {
      var found = dcel.findVertex(new Point(processing.mouseX,processing.mouseY));
      if(found) {
        dcel.splitFace(new Vertex(processing.mouseX,processing.mouseY));
      }else {
        dcel.addVertexAt(new Vertex(processing.mouseX,processing.mouseY));
        processing.ellipse(processing.mouseX, processing.mouseY , pointSize, pointSize);
      }
      pointMarked = false;

    }

  };
  // Override draw function, by default it will be called 60 times per second
  processing.draw = function() {
  };
  
}

var canvas = document.getElementById("canvas1");
// attaching the sketchProc function to the canvas
var p = new Processing(canvas, sketchProc);

 
