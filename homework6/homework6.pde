
int pointSize = 8;
int redNbrPoints = 0;
int blueNbrPoints = 0;
int nbrPoint = 0;
int maxPoint = 100;
int minRedX = 0;
int minBlueX = 0;
int[] redPoints = new int[2*maxPoint];
int[] bluePoints = new int[2*maxPoint];
int[] redLines = new int[maxPoint*2];
int[] blueLines = new int[maxPoint*2];

final int PRIME = 0;
final int DUAL = 1;

final int RED = 0;
final int BLUE = 1;

int color = RED;
int mode = PRIME;

int canvasSize = 500;



void setup() {
	size(canvasSize, canvasSize); 
  	smooth();
  	noLoop();
	background(155);
	fill( 255, 0, 0 );
	stroke(0);
}


int vectorProduct(int ax,int ay,int bx,int by,int cx,int cy) {
	return (bx-ax)*(cy-by) - (by-ay)*(cx-bx);
}

void swap(int i,int j, int[] points) {
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

void next(int last,int[] points,nbrPoint) {
	int next = 1;
	if(next == last) {
		next = 2;
	}
	for(int i=0;i<nbrPoint;i++) {
		if(i!=last) {
			int res = vectorProduct(points[2*last],points[2*last+1],points[2*next],points[2*next+1],points[2*i],points[2*i+1]);
			if( res > 0 || (res==0 && dist(points[2*last],points[2*last+1],points[2*next],points[2*next+1]) < dist(points[2*last],points[2*last+1],points[2*i],points[2*i+1])  )) {
				next = i;
			}
		}
	}
	return next;
}

void convexHull(int[] points) {
	println("CONVEX HULL");
	int minX = 0, nbrPoint = 0;
	if(color==RED) {minX = minRedX;nbrPoint = redNbrPoints;}
  	else {minX = minBlueX;nbrPoint = blueNbrPoints;}
  	println(minX + " " + nbrPoint );
  	//println("CONVEX HULL");
	swap(0,minX,points);
	//println("CONVEX HULL");
	int nextElement = 1,last = 0;
	//println("CONVEX HULL");
	int i = 0;
	while(nextElement!=0 && i< 30) {
		//println("LINE");
		nextElement = next(last,points,nbrPoint);
		line(points[2*last],points[2*last+1],points[2*nextElement],points[2*nextElement+1]);
		last = nextElement;
		i++;
	}
	line(points[2*last],points[2*last+1],points[2*0],points[2*0+1]);
}

void mouseClicked(){
	
	if(mode == PRIME) {
		if(nbrPoint == 0 && blueNbrPoints > 0) {
			background(155); //clean 
	  	}

	  	if(color == RED) {
	  		drawPoint(redPoints);
	  	}else {
	  		drawPoint(bluePoints);
	  	}
	  	
	}
}

void drawPoint(int[] points) {
	//println("ok 2");
	points[2*nbrPoint]   = ((int) (mouseX/10))*10;
  	points[2*nbrPoint+1] = ((int) (mouseY/10))*10;
  	println(points[2*nbrPoint]+"  "+points[2*nbrPoint + 1]);
  	//println("ok 3");
  	if(color==RED) {minX = minRedX;}
  	else {minX = minBlueX;}

  	if(points[2*nbrPoint] < points[2*minX] || (points[2*nbrPoint] == points[2*minX] && points[2*nbrPoint+1] < points[2*minX+1])) {
  		//println("ok 2.5");
  		if(color==RED) {minRedX = nbrPoint;}
  		else {minBlueX = nbrPoint;}
  	}
  	//println("ok 4");
  	ellipse(points[2*nbrPoint], points[2*nbrPoint+1], pointSize, pointSize);
  	//println("ok 5");
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void keyPressed() {
	if (keyCode == ENTER ) {
		swapColor();
		swapColor();
		if(mode==PRIME) {
			nbrPoint-=1;
			convexHull(redPoints);
			convexHull(bluePoints);
			nbrPoint = 0;
		}else {
			//intersection();
		}

	}else if(keyCode == ' ' ) { //SWITCH MODE
		background(155);
		swapColor(); //udate nbr of points
		swicthMode();
		swapColor(); //return in the correct color
	}else if(key == 'c' && mode==PRIME) { //SWAP COLOR
		//println("CHANGE COLOR");
		swapColor();
	}else if(key == 'r')  { //RESET
		background(155);
		nbrPoint = 0;
		redNbrPoints = 0;
		blueNbrPoints = 0;
	}
}

void swapColor() {
	if(color == RED) {
		redNbrPoints = nbrPoint;
		color = BLUE;
		fill(0,0,255);
		nbrPoint = blueNbrPoints ;
	}else {
		blueNbrPoints = nbrPoint;
		color = RED;
		fill(255,0,0);
		nbrPoint = redNbrPoints;
	}
}

void swicthMode() {
	if(mode==PRIME) {
		displayLines();
		mode = DUAL;
	}else {
		displayPoints();
		mode = PRIME;
	}
}

void displayLines() {
	println(redNbrPoints+ "  " + blueNbrPoints);
	fill(255,0,0);
	for(int i=0;i<redNbrPoints;i++) {
		//println("DISPAY RED LINES");
		int a = redPoints[2*i]/100;
		int b = redPoints[2*i+1]/100;
		//println("LINE : "+a+"  "+b);
		line((0-b)/a,0,(canvasSize-b)/a,canvasSize);
		//println("("+(0-b)/a+ ",0)"+ "  (" + (canvasSize-b)/a +",500)");
		//ellipse(redPoints[2*i], redPoints[2*i+1], pointSize, pointSize);
	}

	fill(0,0,255);
	for(int i=0;i<blueNbrPoints;i++) {
		//println("DISPAY BLUE LINES");
		int a = bluePoints[2*i];
		int b = bluePoints[2*i+1];
		line(0,a*0+b,canvasSize,canvasSize*a+b);
		//ellipse(, , pointSize, pointSize);
	}
	if(color==RED) {fill(255,0,0);}
}

void displayPoints() {
	println(redNbrPoints+ "  " + blueNbrPoints);
	fill(255,0,0);
	for(int i=0;i<redNbrPoints;i++) {
		println("DISPAY RED POINT");
		ellipse(redPoints[2*i], redPoints[2*i+1], pointSize, pointSize);
	}

	fill(0,0,255);
	for(int i=0;i<blueNbrPoints;i++) {
		println("DISPAY BLUE POINT");
		ellipse(bluePoints[2*i], bluePoints[2*i+1], pointSize, pointSize);
	}
	if(color==RED) {fill(255,0,0);}
}