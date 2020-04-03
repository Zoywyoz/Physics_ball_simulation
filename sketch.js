let M = 0.3;
let G = 0.2;
let friction = 0.01;
let ballNum = 12;

let balls = [ballNum];

let colliding;
let selectedBall = 'null';

function setup() {
  createCanvas(700, 600);
  fill(255);

  sG = createSlider(0, 5.0, 0, 0);
  sF = createSlider(0, 1.0, 0, 0);
  sG.position(width/20, height + 33);
  sF.position(width/20, height + 66);
  sG.size(width*0.9);
  sF.size(width*0.9);

  for (let i = 0; i < ballNum; i++) {
    let angle = TWO_PI / ballNum * i;
    let position = p5.Vector.fromAngle(angle).mult(width / 3);
    balls[i] = new Ball(position.add(width / 2, height / 2), p5.Vector.random2D().mult(100), random(100, 200), i);
  }
}

function draw() {

  G = sG.value();
  friction = sF.value();

  background(20);

  for (let p of balls) {
    let netF = createVector(0, 0);
    if (p != selectedBall) {
      for (let o of balls) {
        if (o != p) {
          if (o != selectedBall) netF.add(gravity(o, p));
        }
      }
      if (p != selectedBall) p.updatePos(netF);
    }
  }

  for (let i = 0; i < 1; i += 5) {
    for (let a of balls) {
      colliding = false;
      if (a.checkEdges()) colliding = true;
      for (let b of balls) {
        if (b != a) {
          if (a.intersects(b)) {
            collide(a, b);
            colliding = true;
          }
        }
      }
    }
    if (colliding) {
      i -= 5;
    }
  }
  for (let b of balls) {
    b.show();
  }
}

function mousePressed() {
  for (let o of balls) {
    if (o.clicked()) {
      selectedBall = o;
      break;
    } else {
      selectedBall = 'null';
    }
  }
}

function mouseDragged() {
  if (selectedBall != 'null') {
    selectedBall.acc.mult(0);
    selectedBall.vel.mult(0);
    selectedBall.pos.x = mouseX;
    selectedBall.pos.y = mouseY;
  }
}

function mouseReleased() {
  if (selectedBall != 'null') selectedBall.vel = createVector(mouseX-pmouseX, mouseY-pmouseY);
  selectedBall = 'null';
}

function gravity(a, b) {
  let force = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
  let d = force.mag();
  force.normalize();
  force.mult(G * a.m * b.m / d / d);
  return force;
}

function collide(a, b) {
  let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
  let poff = p5.Vector.sub(b.pos, a.pos).normalize().mult((a.m * M / 2 + b.m * M / 2 - d) / 2 + 1);

  a.pos.sub(poff);
  b.pos.add(poff);


  let n = poff.copy().normalize();
  let t = createVector(-n.y, n.x);

  let dpTang1 = a.vel.x * t.x + a.vel.y * t.y;
  let dpTang2 = b.vel.x * t.x + b.vel.y * t.y;

  let dpNorm1 = a.vel.x * n.x + a.vel.y * n.y;
  let dpNorm2 = b.vel.x * n.x + b.vel.y * n.y;

  let m1 = (dpNorm1 * (a.m - b.m) + 2.0 * b.m * dpNorm2) / (a.m + b.m);
  let m2 = (dpNorm2 * (b.m - a.m) + 2.0 * a.m * dpNorm1) / (a.m + b.m);

  if (a != selectedBall && b != selectedBall) {

    a.vel.x = t.x * dpTang1 + n.x * m1;
    a.vel.y = t.y * dpTang1 + n.y * m1;

    b.vel.x = t.x * dpTang2 + n.x * m2;
    b.vel.y = t.y * dpTang2 + n.y * m2;

  } else if (b == selectedBall) {
    a.vel = poff.normalize().mult(-a.vel.mag());
    a.acc.add(createVector(mouseX-pmouseX, mouseY-pmouseY));
  } else {
    b.vel = poff.normalize().mult(b.vel.mag());
    b.acc.add(createVector(mouseX-pmouseX, mouseY-pmouseY));
  }
}
