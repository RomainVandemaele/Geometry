function Point(x, y) {
  this.x = x;
  this.y = y;
  this.getX = function () {return this.x;}
  this.getY = function () {return this.y;}

  this.isEqual = function(e) {
    return this.x == e.getX() && this.y == e.getY();
  }
}
