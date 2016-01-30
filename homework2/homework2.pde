
int pointSize = 8;
int nbrPoint = 0;
int maxPoint = 100;
int minX = 0;
int[] points = new int[200];




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

void swap(i,j) {
	int tempX = points[2*j];
	int tempY = points[2*j+1];
	points[2*j] = points[2*i];
	points[2*j+1] = points[2*i+1];
	points[2*i] = tempX;
	points[2*i+1] = tempY;
}

int dist(int ax,int ay, int bx, int by) {
	return  (bx-ax) * (bx-ax) + (by-ay) * (by-ay);
}

void next(int last) {
	int next = 1;
	if(next == last) {
		next = 2;
	}
	for(int i=0;i<nbrPoint+1;i++) {
		if(i!=last) {
			int res = vectorProduct(points[2*last],points[2*last+1],points[2*next],points[2*next+1],points[2*i],points[2*i+1]);
			if( res > 0 || (res==0 && dist(points[2*last],points[2*last+1],points[2*next],points[2*next+1]) < dist(points[2*last],points[2*last+1],points[2*i],points[2*i+1])  )) {
				next = i;
			}
		}
	}
	return next;
}

void convexHole() {
	swap(0,minX);
	int nextElement = 1,last = 0;
	while(nextElement!=0 ) {
		nextElement = next(last);
		line(points[2*last],points[2*last+1],points[2*nextElement],points[2*nextElement+1]);
		last = nextElement;
	}
	line(points[2*last],points[2*last+1],points[2*0],points[2*0+1]);
}

void mouseClicked(){
	if(nbrPoint == 0) {
		background(155); //clean 
  	}
  	points[2*nbrPoint]   = ((int) (mouseX/10))*10;
  	points[2*nbrPoint+1] = ((int) (mouseY/10))*10;
  	if(points[2*nbrPoint] < points[2*minX] || (points[2*nbrPoint] == points[2*minX] && points[2*nbrPoint+1] < points[2*minX+1])) {
  		minX = nbrPoint;
  	}
  	ellipse(points[2*nbrPoint], points[2*nbrPoint+1], pointSize, pointSize);
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void keyPressed() {
	if (keyCode == ENTER) {
		nbrPoint-=1;
		convexHole();
		nbrPoint = 0;
	}
}
