let ball; // Declare object
let balls = [];
let numBalls; // arrary count;
let bounce, fire;
let cnv;
let isFire, isStart;
let dV;
let spring = 0.05;
let gravity = 9.8 / 60;
let friction = 0.01;
let cb1;
let mul=10;

function setup() {
  frameRate(60);
  cnv = createCanvas(460, 400);
  cnv.mousePressed(setBall); // attach

  numBalls = 0;


  cb1 = createCheckbox("Ball fill", false);
  cb1.position(10, height + 10);
  cb4 = createCheckbox("Ball stroke", true);
  cb4.position(cb1.x+100, cb1.y);
  
  cb2 = createCheckbox("Show Speed Vector", false);
  cb2.position(cb1.x, cb1.y + 20);
  cb3 = createCheckbox("Show Collision Vector", true);
  cb3.position(cb2.x, cb2.y + 20);
  cb5 = createCheckbox("Show Distance Line", false);
  cb5.position(cb3.x+200, cb3.y );

  sl1 = createSlider(20, 100, 100, 10);
  sl1.position(cb3.x, cb3.y + 20);
  dv1 = createDiv("Ball Diemeter: 20-70");
  dv1.style("font-size", "16px");
  dv1.position(sl1.x +150, sl1.y);
  sl1.changed(PrintDV1);
  
  sl2 = createSlider(0, 20, 10, 1);
  sl2.position(cb2.x +200, cb2.y );
  dv2 = createDiv("Ball's X Speed:0");
  dv2.style("font-size", "16px");
  dv2.position(sl2.x + 140, sl2.y);
  sl2.changed(PrintDV2);
  
  cb6 = createCheckbox("Console Logging", false);
  cb6.position(sl1.x, sl1.y +20 );
  
}

function PrintDV1() {
  let s1 = sl1.value();
  let s2 = s1 +50;
  dv1.html("Ball Diemeter: "+s1+"-"+s2, false);
}

function PrintDV2() {
  let s1 = sl2.value()-10;
  dv2.html("Ball's X speed:" + s1, false);
}

function draw() {
  background(0, 0, 0);

  for (let i = 0; i < numBalls; i++) {
    balls[i].collide();
    //balls[i].moveFloor();
    balls[i].freeFall();
    balls[i].display();
  }
}

function setBall() {
  // Create freeFall object
  let bsize = sl1.value();
  balls[numBalls] = new Ball(
    balls,
    numBalls,
    mouseX,
    mouseY,
    random(bsize, bsize + 50),
    sl2.value()-10,
    0,
    gravity,
    0
  );
  // Create moveFloor Object
  //balls[numBalls] = new Ball(balls, numBalls, mouseX, mouseY, random(20, 60), 5, 0, 0,friction);

  numBalls++;
}

// Ball class
class Ball {
  constructor(others, id, x, y, d, vx, vy, accel, fr) {
    this.others = others;
    this.id = id;
    
    this.x = x;
    this.y = y;
    this.cv = createVector(x,y);
    
    this.d = d;
    this.r = this.d / 2;

    this.xspeed = vx;
    this.yspeed = vy;
    this.sv = createVector(vx, vy);
    
    this.accel = accel; // gravity
    this.fr = fr; // initial floor friction

    this.rs = 0.95; // rebound speed reduction;
    this.mbs = 0.3; // minimum bounse speed;

    this.left = this.r;
    this.right = width - this.r;
    this.bottom = height - this.r;
    this.top = this.r;

    this.fc = color(random(256), random(256), random(256));
  }

  moveFloor() {
    if (this.xspeed > 0.01) {
      this.xspeed -= this.fr;
    } else if (this.xspeed < -0.01) {
      this.xspeed += this.fr;
    } else {
      this.xspeed = 0;
    }
    if (this.yspeed > 0.01) {
      this.yspeed -= this.fr;
    } else if (this.yspeed < -0.01) {
      this.yspeed += this.fr;
    } else {
      this.yspeed = 0;
    }

    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.x > this.right) {
      this.x = this.right;
      this.xspeed *= -this.rs;
    } else if (this.x < this.left) {
      this.x = this.left;
      this.xspeed *= -this.rs;
    }
    if (this.y > this.bottom) {
      this.y = this.bottom;
      this.yspeed *= -this.rs;
    } else if (this.y < this.top) {
      this.y = this.top;
      this.yspeed *= -this.rs;
    }
  }

  freeFall() {
    this.yspeed += this.accel;
    this.sv.y += this.accel;

    if (this.fr > 0) {
      if (this.xspeed > 0.01) {
        this.xspeed -= this.fr;
        this.sv.x -= this.fr;
      } else if (this.xspeed < -0.01) {
        this.xspeed += this.fr;
        this.sv.x += this.fr;
      } else {
        this.xspeed = 0;
        this.sv.x = 0;
      }
    }

    this.x += this.xspeed;
    this.y += this.yspeed;
    this.cv.add(this.sv);
    

    if (this.x > this.right) {
      this.x = this.right;
      this.xspeed *= -this.rs;
      
    } else if (this.x < this.left) {
      this.x = this.left;
      this.xspeed *= -this.rs;
      
    }
    if (this.y > this.bottom) {
      this.y = this.bottom;
      if (this.yspeed > this.mbs) {
        // minimum bounce speed
        this.yspeed *= -this.rs;
      } else {
        // if yspeed set to 0, set friction to 0.01;
        this.yspeed = 0;
        this.fr = friction;
      }
    } else if (this.y < this.top) {
      this.y = this.top;
      this.yspeed *= -this.rs;
      //bounce.play();
    }
  }

  display() {
    if (cb1.checked() == true) {
      fill(this.fc);
    } else {
      noFill();
    }

    if (cb4.checked() == true) {
      stroke(this.fc);
    } else {
      noStroke();
    }
    ellipse(this.x, this.y, this.d, this.d);

    if (cb2.checked() == true) {
      push();
      translate(this.x, this.y);
      stroke(255, 0, 0);
      line(0, 0, this.xspeed * mul, this.yspeed * mul);
      pop();
    }
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let minDist = this.others[i].r + this.r;
      let distance = dist(this.x, this.y, this.others[i].x, this.others[i].y);

      if (distance < minDist) {
       
        
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
       
        /*
        let angle = atan2(dy, dx);
        let minX = cos(angle) * minDist;
        let minY = sin(angle) * minDist;
        let targetX = this.x + minX;
        let targetY = this.y + minY;  
        let vx = targetX - this.others[i].x;
        let vy = targetY - this.others[i].y;
        */
        
        let dv = createVector(dx, dy);
        dv.normalize();
        dv.mult(minDist);
        let targetX = this.x + dv.x;
        let targetY = this.y + dv.y;
        let vx = targetX - this.others[i].x;
        let vy = targetY - this.others[i].y;
    
        
        let ax = vx * 0.05;
        let ay = vy * 0.05;
        let pxs1 = this.xspeed;
        let pys1 = this.yspeed;
        let pxs2 = this.others[i].xspeed;
        let pys2 = this.others[i].yspeed;
        
        this.xspeed -= ax;
        this.yspeed -= ay;
        this.others[i].xspeed += ax;
        this.others[i].yspeed += ay;

        // distance line
        if (cb5.checked() == true) {
          stroke(random(255),random(255), random(255));
          line(this.x, this.y, this.others[i].x, this.others[i].y);
        }
        
        if (cb3.checked() == true) {
          
          push();
          translate(this.x, this.y);
          stroke(0,255,0);
          strokeWeight(4);
          line(0, 0, -ax*mul, -ay*mul);
          stroke(255,0,0);
          strokeWeight(3);
          line(0,0, pxs1*mul, pys1*mul);
          stroke(255,0,255);
          strokeWeight(2);
          line(0,0, this.xspeed*mul, this.yspeed*mul);
  
          pop();
          push();
          translate(this.others[i].x, this.others[i].y);
          
          stroke(0,0,255);
          strokeWeight(3);
          line(0, 0, ax*mul, ay*mul);
          
          stroke(255,0,0);
          line(0,0, pxs2*mul, pys2*mul);
          stroke(255,0,255);
          strokeWeight(2);
          line(0,0, this.others[i].xspeed*mul, this.others[i].yspeed*mul);
          pop();
          
        }
      }
    }
  }

  setStart(x, y, xs, ys) {
    this.x = x;
    this.y = y;
    this.xspeed = xs;
    this.yspeed = ys;
    this.fr = 0.0;
  }

  setSpeed(xs, ys) {
    this.xspeed = xs;
    this.yspeed = ys;
    this.fr = 0.0;
  }
}


let bLoop = true;
function keyPressed() {
  if (key == " ") {
    if(bLoop == true) {
      noLoop(); 
      bLoop = false;
    } else {
     loop();
      bLoop = true;
      
    }
    
  }
  if (key == "o") {
  }
  if (key == "r") {
    redraw();
  }
}
