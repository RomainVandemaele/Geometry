int pointSize = 8;
int nbrPoint = 0;
int maxPoint = 100;
int[] points = new int[200];
int separationIndex = 0; //separation between points of polygons and points
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

void mouseClicked(){
	if(nbrPoint==0) { //finished cycle
		background(155);
	}
	points[2*nbrPoint]   = ((int) (mouseX/10))*10;
	points[2*nbrPoint+1] = ((int) (mouseY/10))*10;
	ellipse(points[2*nbrPoint], points[2*nbrPoint+1],pointSize,pointSize);
  	if(mode==0 && nbrPoint > 0) {
  		line(points[2*(nbrPoint-1)],points[2*(nbrPoint-1)+1],points[2*nbrPoint],points[2*nbrPoint+1]);
	}
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void sweepingLine() {
	return (points.get(2*lastIndex+1) > points.get(2*index+1) && points.get(2*nextIndex+1) > points.get(2*index+1)) || (points.get(2*lastIndex+1) < points.get(2*index+1) && points.get(2*nextIndex+1) < points.get(2*index+1));
}

void keyPressed() {
	if (keyCode == ENTER) {
		if(mode==1) {
			sweepingLine();
			nbrPoint=0;
		}else { //mode==0
			line(points[2*(nbrPoint-1)],points[2*(nbrPoint-1)+1],points[2*0],points[2*0+1]);
			separationIndex = nbrPoint;
		}
		mode = (mode+1)%2
	}
}