//import java.awt.Point;

int pointSize = 8;
int nbrPoint = 0;
int maxPoint = 3;
int[] points = new int[60];
//Point[] points2 = new Point[3];
//MODE : 0 = ORIENTATION DETERMINANT
//		 1 = POINT IN/OUT TRIANGLE
//		 2 = CYCLIC ORDERING
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

void sort() {
	int minIndex = 1,lastIndex=0,firstIndex = 0;
	//interPoint is a point to fix the order, here we use clockwise order
	//Its use with the center as a "landmark segment"
	int interPointX = points[0], centerX = points[0];
	int interPointY = points[1]-100, centerY = points[1];
	for(int step = 0;step<nbrPoint;step++) { //for each point we find the first point after the last found
		for(int i = 1;i<(nbrPoint+1);i++) {
			boolean isFirst = true;
			int isRight = vectorProduct(centerX,centerY,interPointX,interPointY,points[2*i],points[2*i+1]);
			for(int j = 1;j<(nbrPoint+1);j++) {
				if(i!=j) {
					int vector1 = vectorProduct(centerX,centerY,interPointX,interPointY,points[2*j],points[2*j+1]);
					int vector2 = vectorProduct(centerX,centerY,points[2*i],points[2*i+1],points[2*j],points[2*j+1]);
					if(vector2 <0 && vector1 >0) { //there is a point j at its left which is at the right of the landmark segment
						isFirst = false; 
					}
				}
			}
			if(isFirst && isRight>0) {
				minIndex = i;
				if(lastIndex>0) {
					line(points[2*lastIndex], points[2*lastIndex+1],points[2*minIndex], points[2*minIndex+1])
				}else {
					firstIndex = minIndex;
					fill( 255, 0, 0 );
					ellipse(points[2*firstIndex], points[2*firstIndex+1],pointSize,pointSize);
					fill( 0, 0, 0 );
				}
			}
		}
		interPointX = points[2*minIndex];
		interPointY = points[2*minIndex+1];
		lastIndex = minIndex;
	}
	line(points[2*lastIndex], points[2*lastIndex+1],points[2*firstIndex], points[2*firstIndex+1])

}

void mouseClicked(){
    if(nbrPoint == 0) {
		background(155); //clean 
  	}
  	points[2*nbrPoint] = mouseX;
  	points[2*nbrPoint+1] = mouseY;
  	ellipse(mouseX, mouseY, pointSize, pointSize);
  	if(nbrPoint==maxPoint-1) {
  		if(mode==1) {
			fill( 255, 255, 255 );
			triangle(points[0],points[1],points[2],points[3],points[4],points[5]);
			fill( 0, 0, 0 );
			ellipse(mouseX, mouseY, pointSize, pointSize);
			int vector1 = vectorProduct(points[6],points[7],points[4],points[5],points[2],points[3]);
			int vector2 = vectorProduct(points[6],points[7],points[2],points[3],points[0],points[1]);
			int vector3 = vectorProduct(points[6],points[7],points[0],points[1],points[4],points[5]);
  			//check if the point is always to the left or to the right of each segment
  			if((vector1>=0 && vector2>=0 && vector3>=0) || (vector1<0 && vector2<0 && vector3<0)  ) {
  				println("IN");
  			}else {
  				println("OUT");
  			}
  		}else if(mode==0) {
  			line(points[0],points[1],points[2],points[3]);
  			line(points[2],points[3],points[4],points[5]);
  			int direction  = vectorProduct(points[0],points[1],points[2],points[3],points[4],points[5]);
  			direction >=0?println("RIGHT"):println("LEFT");
  		}else {
  			sort();
  			maxPoint = 50;
  			nbrPoint = -1;
  		}
  	}
  	nbrPoint = (nbrPoint+1)%maxPoint;
}

void keyPressed() {
	if (keyCode == ENTER) {
		if(mode==2 && nbrPoint>=3) {
			background(155);
			nbrPoint = 0;
		}
		mode = (mode + 1) % 3
		println("MODE CHANGED IN " + mode);
		if(mode == 1) {
			maxPoint = 4;
		}else if (mode==0) {
			maxPoint = 3;
		}else {
			maxPoint = 50;
		}
	}else if (key== ' ' && mode==2) {
		maxPoint = nbrPoint+1; //stop at next point
	}

}