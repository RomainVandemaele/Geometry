function vectorProduct(ax,ay, bx, by, cx, cy) {
  return (bx-ax)*(cy-by) - (by-ay)*(cx-bx);
}

function vectorProduct2(p1,p2) {
  return (p1.getX()*p2.getY()) - (p1.getY()*p2.getX());
}

//symetryof p along the line d between d1 and d2
function symetry(p,d1,d2) {
  var x = p.getX();
  var y = p.getY();
  //line d parameter
  var a= (d1.getY() - d2.getY())/(d1.getX() - d2.getX()) ;
  var b= d2.getY() - a*d2.getX();
  //line d' perpendicular to d passing by p
  var a2=(-1/a),b2= y + x/a;

  //p' = intersection btw d' and d
  var x2=(b2-b)/(a-a2);
  var y2= a2*x2 + b2;
  //p'' = result of symetry
  var x3= x + 2*(x2-x) ,y3=y+ 2*(y2-y);
  return new Point(x3,y3);
}

//Test is two segment p1-p2 and p3-p4 have an intersection
function isCrossing(p1,p2,p3,p4) {
    var r = new Point(p2.getX() - p1.getX(), p2.getY() - p1.getY());
    var s = new Point(p4.getX() - p3.getX(), p4.getY() - p3.getY());
    var vp = vectorProduct2(r,s);
    if(vp !=0) {
      var t = vectorProduct2(new Point(p3.getX() - p1.getX(), p3.getY() - p1.getY()) ,s);
      t = t/vp;

      var u = vectorProduct2(new Point(p3.getX() - p1.getX(), p3.getY() - p1.getY()) ,r);
      u = u/vp;
      return u >=0 && u <=1 && t>=0 && t<=1;
    }
    return false;
}

//Test is a polygon cross one poygon in the list polygons
function polygonsCrossing(selectedPolygon,polygons) {
  var res1 = false;
  var j=0;
  while(j< polygons.length && !res1) {
    if(polygons[j]!=selectedPolygon) {
      res1 = selectedPolygon.isOverlapping(polygons[j]);
    }
    j++;
  }
  return res1;
}

//Test if a point is in a triangle p1-p2-p3 :
function isInTriangle(p1,p2,p3,x,y) {
  return vectorProduct(p1.getX(),p1.getY(),p2.getX(),p2.getY(),x,y)*vectorProduct(p1.getX(),p1.getY(),p3.getX(),p3.getY(),x,y) < 0 && vectorProduct(p2.getX(),p2.getY(),p3.getX(),p3.getY(),x,y)*vectorProduct(p2.getX(),p2.getY(),p1.getX(),p1.getY(),x,y) < 0
}

//Find the bissectrix
function bissectrix(p1,p2,p) {
  var deltaX = p1.getX() - p2.getX();
  var deltaY = p1.getY() - p2.getY();
  return new Point(p1.getX() - 0.5*deltaX,p1.getY() - 0.5*deltaY );
}

function calculateDistance(p1,p2) {
   return Math.sqrt( Math.pow((p1.getX() - p2.getX()),2) + Math.pow((p1.getY() - p2.getY()),2) );
}

function calculateAngle(p1,p2,p3,poly) {
  var v1 = new Point(p1.getX() - p2.getX(), p1.getY() - p2.getY());
  var v2 = new Point(p3.getX() - p2.getX(), p3.getY() - p2.getY());
  //we use dot product of 2 vector A,B = ||A||.||B||.cos(angle)
  var d1 = Math.sqrt( Math.pow(v1.getX(),2) + Math.pow(v1.getY(),2) );
  var d2 = Math.sqrt( Math.pow(v2.getX(),2) + Math.pow(v2.getY(),2) );

  var r = (v1.getX()*v2.getX() + v1.getY()*v2.getY()) / (d1*d2);
  var angle =  Math.acos(r);
  //test if we must take the complement(360-angle) : if a point in the trianle is not in the polygon => take the complement
  var r1 = 0.5;
  var r2 = 0.5;
  var pointInterior = new Point( (1 - Math.sqrt(r1) ) * p1.getX() + Math.sqrt(r1)*(1-r2)*p2.getX() + r2*Math.sqrt(r1)*p3.getX()  , (1 - Math.sqrt(r1) ) * p1.getY() + Math.sqrt(r1)*(1-r2)*p2.getY() + r2*Math.sqrt(r1)*p3.getY()   );

  if( !poly.isInPolygon(pointInterior.getX(),pointInterior.getY()) ) {
    angle = Math.PI*2 - angle;
  }
  return angle;

}

//verif if exists a point where polygon form a 360°
function tilePlane(index,polygons,proc) {
  var p = polygons[index].getPoints();
  //for each point verif if it exist in all other polygons and then verif if they form a tessalation
  for(i=0;i<p.length;i++) {
    var angle = 0;
    var count = 0;
    for(j=0;j<polygons.length;j++) {
      var pPrime = polygons[j].getPoints();
      for(k=0;k<pPrime.length;k++) {
        if( Math.abs(pPrime[k].getX() - p[i].getX()) < 3 && Math.abs(pPrime[k].getY() - p[i].getY()) < 3  ) {
          var p1 = pPrime[(k-1)%pPrime.length];
          if((k-1) < 0) {
            p1 = pPrime[(k-1)+pPrime.length];
          }
          var p2 = pPrime[k];
          var p3 = pPrime[(k+1)%pPrime.length];
          angle += calculateAngle(p1, p2, p3 ,  polygons[j] );
        }
      }
    }
    if(Math.abs(angle - Math.PI*2) < 0.05 ) {
      selectedPoint = new Point(p[i].getX(),p[i].getY());
      return true;
    }else {
      selectedPoint= null;
    }
  }
  return false;
}
