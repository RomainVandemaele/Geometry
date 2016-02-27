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

function isInTriangle(p1,p2,p3,x,y) { 
  return vectorProduct(p1.getX(),p1.getY(),p2.getX(),p2.getY(),x,y)*vectorProduct(p1.getX(),p1.getY(),p3.getX(),p3.getY(),x,y) < 0 && vectorProduct(p2.getX(),p2.getY(),p3.getX(),p3.getY(),x,y) > 0
}