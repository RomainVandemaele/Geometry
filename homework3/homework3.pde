int pointSize = 8;
int nbrPoint = 0;
int maxPoint = 100;
int[] points = new int[200];
//Point[] points2 = new Point[3];
//MODE : 0 = POINT IN A PLOLYGON IN N
//		 1 = POINT IN A CONVEX PLOLYGON IN LOG(N)
int mode = 0;


void setup() {
	size(500, 500); 
  	smooth();
  	noLoop();
	background(155);
	fill( 0, 0, 0 );
	stroke(0);
}

void draw() {}

int vectorProduct(int ax,int ay,int bx,int by,int cx,int cy) {
	return (bx-ax)*(cy-by) - (by-ay)*(cx-bx);
}

int vectorProduct2(ax,ay,bx,by) {
    return ax*by - ay*bx;
}

boolean isCrossing(ax,ay,bx,by,cx,cy,dx,dy) {
    int rx = bx - ax;
    int ry = by - ay;
    int sx = dx - cx;
    int sy = dy - cy;
    int vp = vectorProduct2(rx,ry,sx,sy);
    if(vp !=0) {
      int t = vectorProduct2(cx - ax, cy-ay ,sx, sy);
      t = t/vp;

      int u = vectorProduct2(cx - ax, cy-ay ,rx, ry);
      u = u/vp;
      return u >=0 && u <=1 && t>=0 && t<=1;
    }
    return false;
}

/** Return a boolean indicating 
if the last point traced is in the polygon formed by the others point
in O(n).**/
boolean isInPolygon() {
	int crossing = 0;
	for(int i=0;i<nbrPoint;i++) {
		if(isCrossed(i,nbrPoint)) {
			crossing+=1;
		}
	}
	return crossing%2==1;

}

/**Return a boolean indicating 
if  Pp is in the triangle formed by Pa, Pb and Pc
**/
boolean isInTriangle(int a, int b, int c,int p) {
	int vector1 = vectorProduct(points[2*a],points[2*a+1],points[2*b],points[2*b+1],points[2*p],points[2*p+1]);
	int vector2 = vectorProduct(points[2*b],points[2*b+1],points[2*c],points[2*c+1],points[2*p],points[2*p+1]);
	int vector3 = vectorProduct(points[2*a],points[2*a+1],points[2*c],points[2*c+1],points[2*p],points[2*p+1]);
	return ((vector1>0 && vector2>0 && vector3<0) || (vector1<0 && vector2<0 && vector3>0));
}

/** Return a boolean indicating 
if the last point traced is in the CONVEX polygon given in CCK order 
formed by the others point in O(log(n)) with binary search.**/
boolean isInPolygonV2() {
	int max = nbrPoint-1,min =1;
	int t = min + (int) ((max - min)/2); //middle point
	boolean found = false,res = false;
	int step = 0;
	while(!found && step < nbrPoint) {
		int vector1 = vectorProduct(points[0],points[1],points[2*t],points[2*t+1],points[2*nbrPoint],points[2*nbrPoint+1]);
		int vector2 = vectorProduct(points[0],points[1],points[2*(t+1)],points[2*(t+1)+1],points[2*nbrPoint],points[2*nbrPoint+1]);
		boolean above = points[2*t+1] > points[2*(t+1)+1];
		if( vector1*vector2 < 0   ) { //triangle found
			res = isInTriangle(0,t,t+1,nbrPoint);
			line(points[0],points[1],points[2*t],points[2*t+1]);
			line(points[0],points[1],points[2*(t+1)],points[2*(t+1)+1]);
			found = true;
		}else if(vector1< 0 ) {
			min = t+1;
		}else {
			max = t-1;
		}
		t = min + (int) ((max - min)/2);
		step++;
	}
	return res;
}

void mouseClicked(){
    if(nbrPoint == 0) {
		background(155); //clean 
  	}
  	points[2*nbrPoint] = mouseX;
  	points[2*nbrPoint+1] = mouseY;
  	if(nbrPoint >=1 && nbrPoint < maxPoint ) {
  		fill( 0, 0, 0 );
  		line(points[2*(nbrPoint-1)],points[2*(nbrPoint-1)+1],points[2*nbrPoint],points[2*nbrPoint+1])
  	}else if(nbrPoint == maxPoint) {
  		if(mode==0) {
  			boolean res = isInPolygon();
  		}else {
  			boolean res =  isInPolygonV2();
  		}
  		res==true?println("IN"):println("OUT"); 
  		maxPoint = 100;
  		nbrPoint = -1;
  	}
  	ellipse(mouseX, mouseY, pointSize, pointSize);
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void keyPressed() {
	if (keyCode == ENTER) {
		maxPoint = nbrPoint ;
		line(points[2*(nbrPoint-1)],points[2*(nbrPoint-1)+1],points[2*0],points[2*0+1]);
	}else if (key== ' ') {
		mode = (mode + 1) % 2
		println("MODE CHANGED IN " + mode);
	}

}