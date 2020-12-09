class KeyBot2 {
  constructor() {
    this.speed = 0;
    let body = document.getElementById('body');
    body.addEventListener('keydown', KeyBot2.prototype.handleKey.bind(this));
    body.addEventListener('keyup', KeyBot2.prototype.handleKey.bind(this));
    this.keyArrowUp = false;
    this.keyArrowRight = false;
    this.keyArrowLeft = false;
    this.keyArrowDown = false;
    this.desiredAngle = 0;
  }

  handleKey(e) {
    let desiredAngle = 0;
    if (e.type === 'keydown' || e.type === 'keyup') {
      if (e.code === 'ArrowRight') {
        this.keyArrowRight = (e.type === 'keydown');
      } else if (e.code === 'ArrowLeft') {
        this.keyArrowLeft = (e.type === 'keydown');
      } else if (e.code === 'ArrowUp') {
        this.keyArrowUp = (e.type === 'keydown');
      } else if (e.code === 'ArrowDown') {
        this.keyArrowDown = (e.type === 'keydown');
      }
    }
    let dx = (this.keyArrowRight ? 1 : 0) 
      + (this.keyArrowLeft ? -1 : 0);
    let dy = (this.keyArrowUp ? -1 : 0)
      + (this.keyArrowDown ? 1 : 0);
    if (dx == 0 && dy == 0) {
      this.speed = 0;
    } else {
      this.speed = 1;
      this.desiredAngle = Math.atan2(dy, dx) * 180 / Math.PI;
    }
  }

  draw(c) {
    c.stroke(color("PeachPuff"))
    c.strokeWeight(3);
    c.fill(color("Chocolate"));
    c.rect(80,10,10,10);
    c.rect(80,80,10,10);
    c.ellipse(50, 50, 80, 95);
  }

  /**
   * @param {SensorState} s
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    if (this.speed == 0) {
      return 0.0;
    } else {
      let da = subtractAngles(this.desiredAngle, s.myHeading) / 100; 
      return da;
    }
  }
}

function subtractAngles(a, b) {
  let d = a - b;
  if (d < -180) {
    d += 360;
  }
  if (d > 180) {
    d -= 360;
  }
  return d;
}
