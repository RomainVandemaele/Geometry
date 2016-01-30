int pointSize = 5;
int nbrPoint = 0;
int maxPoint = 100;
ArrayList points = new ArrayList();
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

/**Return a boolean indicating 
if  Pp is in the triangle formed by Pa, Pb and Pc
**/
boolean isInTriangle(int a, int b, int c,int p) {
	int vector1 = vectorProduct(points[2*a],points[2*a+1],points[2*b],points[2*b+1],points[2*p],points[2*p+1]);
	int vector2 = vectorProduct(points[2*b],points[2*b+1],points[2*c],points[2*c+1],points[2*p],points[2*p+1]);
	int vector3 = vectorProduct(points[2*a],points[2*a+1],points[2*c],points[2*c+1],points[2*p],points[2*p+1]);
	return ((vector1>0 && vector2>0 && vector3<0) || (vector1<0 && vector2<0 && vector3>0));
}


boolean isAnEar(int index) {
	boolean isEar = true;
	int lastIndex = ((index-1)%nbrPoint), nextIndex = ((index+1)%nbrPoint);
	int i=0;
	while( i< nbrPoint && isEar) {
		if( i!=index &&  i!= lastIndex && i!= nextIndex) {
			isEar = ! isInTriangle(lastIndex,index,nextIndex,i);
		}
		i++;
	}
	return isEar;
}

boolean isConvex(int index) {
	boolean isEar = true;
	int lastIndex = ((index-1)%nbrPoint), nextIndex = ((index+1)%nbrPoint);
	int vector3 = vectorProduct(points.get(2*lastIndex),points.get(2*lastIndex+1),points.get(2*nextIndex)+10,points.get(2*nextIndex+1),points.get(2*index),points.get(2*index+1));
	//true if index is to the right of the vector lastIndex->rightIndex
	return vector3 > 0 ;
}

boolean findEar() {
	boolean found = false;
	int i =0;
	while(!found && i<nbrPoint) {
		if(isConvex(i)) {
			if(isAnEar(i)) {
				int lastIndex = ((i-1)%nbrPoint), nextIndex = ((i+1)%nbrPoint);
				line(points.get(2*(lastIndex)),points.get(2*(lastIndex)+1),points.get(2*nextIndex),points.get(2*nextIndex+1));
				found = true;
				points.remove(2*i);
				points.remove(2*i);
				nbrPoint--;
			}
		}
		i++;
	}
	fill(0,0,0);
	return found;
}

void triangulate() {
	boolean found = true;
	while(nbrPoint > 3 && found) { 
		found = findEar();
	}
}

void mouseClicked(){
    if(nbrPoint == 0) {
		background(155); //clean 
  	}
  	points.add(mouseX);
  	points.add(mouseY);
  	ellipse(mouseX, mouseY, pointSize, pointSize);
  	if(nbrPoint > 0 ) {
  		fill( 0, 0, 0 );
  		line(points.get(2*(nbrPoint-1)),points.get(2*(nbrPoint-1)+1),points.get(2*nbrPoint),points.get(2*nbrPoint+1));
  	}else if(nbrPoint == maxPoint-1) {
  		line(points.get(2*(nbrPoint-1)),points.get(2*(nbrPoint-1)+1),points.get(2*0),points.get(2*0+1))
		triangulate();
		nbrPoint = -1;
		points.clear();
  	}
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void keyPressed() {
	if (keyCode == ENTER) {
		line(points.get(2*(nbrPoint-1)),points.get(2*(nbrPoint-1)+1),points.get(2*0),points.get(2*0+1))
		triangulate();
		nbrPoint = 0;
		points.clear();
	}

}