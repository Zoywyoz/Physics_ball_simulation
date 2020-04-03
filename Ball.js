class Ball {
  constructor(position, initialF, mass, index) {
    this.m = mass;
    this.r = this.m * M / 2;
    this.acc = createVector(0, 0);
    this.acc.add(initialF.div(this.m));
    this.vel = createVector(0, 0).add(this.acc);
    this.pos = position.add(this.vel);
    this.i = index;
  }

  updatePos(force) {
    this.acc.add(force.div(this.m));
    this.acc.sub(this.vel.copy().mult(friction));
    this.vel.add(this.acc);
    this.vel.limit(40);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    stroke(0);
    strokeWeight(2);
    let direction = this.vel.copy().normalize().mult(this.r);
    line(this.pos.x, this.pos.y, direction.x+this.pos.x, direction.y+this.pos.y);
  }

  checkEdges() {
    let c = false;
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
      c = true;
    } else if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.vel.y *= -1;
      c = true;
    } else {
      c = false;
    }
    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
      c = true;
    } else if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x *= -1;
      c = true;
    }
    if (c) {
      return true;
    } else return false;
  }

  collidingEdge() {
    let c;
    if (this.pos.y + this.r > height) {
      c = true;
    } else if (this.pos.y - this.r < 0) {
      c = true;
    } else {
      c = false;
    }
    if (this.pos.x + this.r > width) {
      c = true;
    } else if (this.pos.x - this.r < 0) {
      c = true;
    }
    return c;
  }

  intersects(other) {
    if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < this.r + other.r) {
      return true;
    } else {
      return false;
    }
  }

  clicked() {
    if (dist(this.pos.x, this.pos.y, mouseX, mouseY) < this.r) {
      return true;
    } else {
      return false;
    }
  }
}
