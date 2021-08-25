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
let mul = 10;

function setup() {
  frameRate(60);
  cnv = createCanvas(460, 400);
  cnv.mousePressed(setBall); // attach

  numBalls = 0;

  cb1 = createCheckbox("Ball fill", false);
  cb1.position(10, height + 10);
  cb4 = createCheckbox("Ball stroke", true);
  cb4.position(cb1.x + 100, cb1.y);

  cb2 = createCheckbox("Show Speed Vector", false);
  cb2.position(cb1.x, cb1.y + 20);
  cb3 = createCheckbox("Show Collision Vector", true);
  cb3.position(cb2.x, cb2.y + 20);
  cb5 = createCheckbox("Show Distance Line", false);
  cb5.position(cb3.x + 200, cb3.y);

  sl1 = createSlider(20, 100, 100, 10);
  sl1.position(cb3.x, cb3.y + 20);
  dv1 = createDiv("Ball Diemeter: 20-70");
  dv1.style("font-size", "16px");
  dv1.position(sl1.x + 150, sl1.y);
  sl1.changed(PrintDV1);

  sl2 = createSlider(0, 20, 10, 1);
  sl2.position(cb2.x + 200, cb2.y);
  dv2 = createDiv("Ball's X Speed:0");
  dv2.style("font-size", "16px");
  dv2.position(sl2.x + 140, sl2.y);
  sl2.changed(PrintDV2);

  cb6 = createCheckbox("Collision Friction", true);
  cb6.position(sl1.x, sl1.y + 20);
  
  sl3 = createSlider(1, 20, 10, 1);
  sl3.position(cb6.x + 200, cb6.y);
  dv3 = createDiv("Friction:0.01");
  dv3.style("font-size", "16px");
  dv3.position(sl3.x + 140, sl3.y);
  sl3.changed(PrintDV3);
  
}

function PrintDV1() {
  let s1 = sl1.value();
  let s2 = s1 + 50;
  dv1.html("Ball Diemeter: " + s1 + "-" + s2, false);
}

function PrintDV2() {
  let s1 = sl2.value() - 10;
  dv2.html("Ball's X speed:" + s1, false);
}

function PrintDV3() {
  friction = sl3.value()*0.001;
  dv3.html("Friction:" + friction, false);

}
function draw() {
  background(0, 0, 0);

  for (let i = 0; i < numBalls; i++) {
    balls[i].collideVector();
    balls[i].freeFallVector();
    balls[i].displayVector();
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
    sl2.value() - 10,
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
    this.cv = createVector(x, y);

    this.d = d;
    this.r = this.d / 2;

    this.xspeed = vx;
    this.yspeed = vy;
    
    this.sv = createVector(vx, vy);
    this.psv = this.sv.copy();

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
    // accel is  9.8/60fr for gravity
    this.yspeed += this.accel;
  
    if (this.fr > 0) { // ground friction(fr)
      if (this.xspeed > 0.01) {
        this.xspeed -= this.fr;
      } else if (this.xspeed < -0.01) {
        this.xspeed += this.fr;
      } else {
        this.xspeed = 0;
      }
    }

    // cv = cv + sv;
    this.x += this.xspeed;
    this.y += this.yspeed;
    
    // Boundary check 
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
    }
    
  }

  freeFallVector() {
    // accel is  9.8/60fr for gravity
    this.sv.y += this.accel;

    if (this.fr > 0) { // ground friction(fr)
      if (this.sv.x > 0.01) {
        this.sv.x -= this.fr;
      } else if (this.sv.x < -0.01) {
        this.sv.x += this.fr;
      } else {
        this.sv.x = 0;
      }
    }

    // cv = cv + sv;
    this.cv.add(this.sv);
    
    // Boundary check 
    if (this.cv.x > this.right) {
      this.cv.x = this.right;
      this.sv.x *= -this.rs;
      
    } else if (this.cv.x < this.left) {
      this.cv.x = this.left;
      this.sv.x *= -this.rs;
    }
    if (this.cv.y > this.bottom) {
      this.cv.y = this.bottom;
      
      if (this.sv.y > this.mbs) {
        // minimum bounce speed
        this.sv.y *= -this.rs;
      } else {
        // if yspeed set to 0, set friction to 0.01;
        this.sv.y = 0;
        this.fr = friction;
      }
    } else if (this.cv.y < this.top) {
      this.cv.y = this.top;
      this.sv.y *= -this.rs;
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
  
   displayVector() {
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
    
    circle(this.cv.x, this.cv.y, this.d);

    if (cb2.checked() == true) {
      push();
      translate(this.cv.x, this.cv.y);
      
      stroke(255, 0, 0);
      line(0, 0, this.sv.x * mul, this.sv.y * mul);
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

        let angle = atan2(dy, dx);
        let minX = cos(angle) * minDist;
        let minY = sin(angle) * minDist;
        let targetX = this.x + minX;
        let targetY = this.y + minY;  
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
        
        if (cb6.checked() == true) { // Collision Friction
          if (this.xspeed > 0.01) {
            this.xspeed -= friction;
          } else if (this.xspeed < -0.01) {
            this.xspeed += friction;
          } else {
            this.xspeed = (random(2) - 1) * friction;
          }
          if (this.others[i].xspeed > 0.01) {
            this.others[i].xspeed -= friction;
          } else if (this.others[i].xspeed < -0.01) {
            this.others[i].xspeed += friction;
          } else {
            this.others[i].xspeed = (random(2) - 1) * friction;
          }

          if (this.yspeed > 0.01) {
            this.yspeed -= friction;
          } else if (this.yspeed < -0.01) {
            this.yspeed += friction;
          }

          if (this.others[i].yspeed > 0.01) {
            this.others[i].yspeed -= friction;
          } else if (this.others[i].yspeed < -0.01) {
            this.others[i].yspeed += friction;
          }
        }

        // Show distance line
        if (cb5.checked() == true) {
          stroke(random(255), random(255), random(255));
          line(this.x, this.y, this.others[i].x, this.others[i].y);
        }

        // Show Collision Vector: scale(mul)
        if (cb3.checked() == true) {
          push();
          translate(this.x, this.y);
          stroke(0, 255, 0);
          strokeWeight(4);
          line(0, 0, -ax * mul, -ay * mul);
          stroke(255, 0, 0);
          strokeWeight(3);
          line(0, 0, pxs1 * mul, pys1 * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, this.xspeed * mul, this.yspeed * mul);

          pop();
          push();
          translate(this.others[i].x, this.others[i].y);

          stroke(0, 0, 255);
          strokeWeight(3);
          line(0, 0, ax * mul, ay * mul);

          stroke(255, 0, 0);
          line(0, 0, pxs2 * mul, pys2 * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, this.others[i].xspeed * mul, this.others[i].yspeed * mul);
          pop();
        }
      }
    }
  }
  
    collideVector() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let minDist = this.others[i].r + this.r;
      let distance = dist(this.cv.x, this.cv.y, this.others[i].cv.x, this.others[i].cv.y);

      if (distance < minDist) {
        // dv = others[i].cv - cv;
        let dv = p5.Vector.sub(this.others[i].cv, this.cv);
        dv.normalize();
        dv.mult(minDist);
        
        // targetV = this.cv +dv;
        let targetV = p5.Vector.add(this.cv, dv);

        // vV = targetV - others[i].cv , collision vector
        let vV = p5.Vector.sub(targetV, this.others[i].cv);
          
        // aV = vV * 0.05;
        let aV = p5.Vector.mult(vV, 0.05);
        
        // psv = sv;
        this.psv = this.sv.copy();
        
        // others[i].psv = others[i].sv;
        this.others[i].psv = this.others[i].sv.copy();
        
        // sv -= vV;
        this.sv.sub(aV);
        
        // others[i].sv += vV;
        this.others[i].sv.add(aV);
        
        if (cb6.checked() == true) { // Collision Friction
          if (this.sv.x > 0.01) {
            this.sv.x -= friction;
            
          } else if (this.sv.x < -0.01) {
            this.sv.x += friction;
          } else {
            this.sv.x = (random(2) - 1) * friction;
          }
          if (this.others[i].sv.x > 0.01) {
            this.others[i].sv.x -= friction;
            
          } else if (this.others[i].sv.x < -0.01) {
             this.others[i].sv.x += friction;
          } else {
            this.others[i].sv.x = (random(2) - 1) * friction;
          }

          if (this.sv.y > 0.01) {
            this.sv.y -= friction;
          } else if (this.sv.y < -0.01) {
            this.sv.y += friction;
          }

          if (this.others[i].sv.y > 0.01) {
            this.others[i].sv.y -= friction;
          } else if (this.others[i].sv.y < -0.01) {
              this.others[i].sv.y += friction;
          }
        }

        // Show distance line
        if (cb5.checked() == true) {
          stroke(random(255), random(255), random(255));
          line(this.cv.x, this.cv.y, this.others[i].cv.x, this.others[i].cv.y);
        }

        // Show Collision Vector: scale(mul)
        if (cb3.checked() == true) {
          push();
          translate(this.cv.x, this.cv.y);
          stroke(0, 255, 0);
          strokeWeight(4);
          line(0, 0, -aV.x * mul, -aV.y * mul);
          stroke(255, 0, 0);
          strokeWeight(3);
          line(0, 0, this.psv.x * mul, this.psv.x * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, this.sv.x * mul, this.sv.y * mul);

          pop();
          push();
          translate(this.others[i].cv.x, this.others[i].cv.y);

          stroke(0, 0, 255);
          strokeWeight(3);
          line(0, 0, -aV.x * mul, -aV.y * mul);

          stroke(255, 0, 0);
          line(0, 0, this.others[i].psv.x * mul, this.others[i].psv.y * mul);
          stroke(255, 0, 255);
          strokeWeight(2);
          line(0, 0, this.others[i].sv.x * mul, this.others[i].sv.y * mul);
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
    if (bLoop == true) {
      noLoop();
      bLoop = false;
    } else {
      loop();
      bLoop = true;
    }
  }

  if (key == "r") {
    redraw();
  }
}
