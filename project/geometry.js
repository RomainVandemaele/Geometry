function vectorProduct(ax,ay, bx, by, cx, cy) {
  return (bx-ax)*(cy-by) - (by-ay)*(cx-bx);
}

function vectorProduct2(p1,p2) {
  return (p1.getX()*p2.getY()) - (p1.getY()*p2.getX());
}

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

function polygonsCrossing(selectedPolygon,polygons) {
  var res1 = false;
  //proc.println("res =  "+res1);
  var j=0;
  while(j< polygons.length && !res1) {
    if(polygons[j]!=selectedPolygon) {
      res1 = selectedPolygon.isOverlapping(polygons[j]);
    }
    j++;
  }
  return res1;
}

function isInTriangle(p1,p2,p3,x,y) {
  return vectorProduct(p1.getX(),p1.getY(),p2.getX(),p2.getY(),x,y)*vectorProduct(p1.getX(),p1.getY(),p3.getX(),p3.getY(),x,y) < 0 && vectorProduct(p2.getX(),p2.getY(),p3.getX(),p3.getY(),x,y)*vectorProduct(p2.getX(),p2.getY(),p1.getX(),p1.getY(),x,y) < 0
}

function bissectrice(p1,p2,p) {
  var deltaX = p1.getX() - p2.getX();
  var deltaY = p1.getY() - p2.getY();
  return new Point(p1.getX() - 0.5*deltaX,p1.getY() - 0.5*deltaY );
}

function calculateDistance(p1,p2) {
   return Math.sqrt( Math.pow((p1.getX() - p2.getX()),2) + Math.pow((p1.getY() - p2.getY()),2) );
}

function calculateAngle(p1,p2,p3,proc,poly) {
  /*var a = calculateDistance(p2,p1);
  var b = calculateDistance(p2,p3);
  var c = calculateDistance(p1,p3);
  var r = ( Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2) ) / (2*a*b);*/
  var v1 = new Point(p1.getX() - p2.getX(), p1.getY() - p2.getY());
  var v2 = new Point(p3.getX() - p2.getX(), p3.getY() - p2.getY());
  proc.println("v1 : " + v1.getX() +" , " + v1.getY());
  proc.println("v2 : " + v2.getX() +" , " + v2.getY());
  var d1 = Math.sqrt( Math.pow(v1.getX(),2) + Math.pow(v1.getY(),2) );
  var d2 = Math.sqrt( Math.pow(v2.getX(),2) + Math.pow(v2.getY(),2) );


  var r = (v1.getX()*v2.getX() + v1.getY()*v2.getY()) / (d1*d2);
  //proc.println("R : " + r);

  //TO DO change with dot roduct of vectors v1(p1) et v2(p3)
  //proc.println(r);
  var angle =  Math.acos(  r  );
  var angle2 = Math.atan2(v2.getY() , v2.getX() ) - Math.atan2(v1.getY() , v1.getX());
  //proc.println(angle);
  /*if( r < 0) {
    angle = Math.PI + ( Math.PI - angle) ;
  }*/
  //test if we ust take the complement(360-angle) : if a point in the trianle is not in the polygon => take the complement
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
  //proc.ellipse(100,100,10,10);
  var p = polygons[index].getPoints();
  //proc.println("OK 1");
  //for each point verif if it exist in all other polygons and then verif if they form a tessalation
  for(i=0;i<p.length;i++) {
    //proc.println("OK 2 "+i);
    var angle = 0;
    var count = 0;
    for(j=0;j<polygons.length;j++) {
      //proc.println("OK 3 "+j);
      var pPrime = polygons[j].getPoints();
      for(k=0;k<pPrime.length;k++) {
        //this.p.println(i);
        //var test = p[i].getX();
        //proc.println("OK 4 "+k);

        if( Math.abs(pPrime[k].getX() - p[i].getX()) < 3 && Math.abs(pPrime[k].getY() - p[i].getY()) < 3  ) {
          //proc.println("OK 4.1  ");
          count++;
          var p1 = pPrime[(k-1)%pPrime.length];
          if((k-1) < 0) {
            p1 = pPrime[(k-1)+pPrime.length];
          }
          var p2 = pPrime[k];
          var p3 = pPrime[(k+1)%pPrime.length];
          //proc.println("OK 4.1.1 ");
          angle += calculateAngle(p1, p2, p3 , proc, polygons[j] );
          //proc.println("Temp angle : "+ (angle/Math.PI)*180);
        }
        //proc.println("OK 4.2 "+k);
      }
    }
    proc.println("OK 5 "+i+ " counted "+count + " times w angle : "+ (angle/Math.PI)*180 );
    if(Math.abs(angle - Math.PI*2) < 0.05 ) {
      proc.stroke(255,0,0);
      //proc.println("OK 6 "+p[i].getX()+ " , "+p[i].getY());
      selectedPoint = new Point(p[i].getX(),p[i].getY());
      proc.println("DISPLAY ");
      return true;
    }
  }
  return false;
}
