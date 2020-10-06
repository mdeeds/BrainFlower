class KeyBot {
  constructor() {
    this.turn = 0;
    let body = document.getElementById('body');
    body.addEventListener('keydown', KeyBot.prototype.handleKey.bind(this));
    body.addEventListener('keyup', KeyBot.prototype.handleKey.bind(this));
  }

  handleKey(e) {
    if (e.type === 'keydown') {
      if (e.code === 'ArrowRight') {
        this.turn = 0.5;
      } else if (e.code === 'ArrowLeft') {
        this.turn = -0.5;
      } else if (e.code === 'ArrowUp') {
        this.speed = 1.0;
      }
    } else if (e.type === 'keyup') {
      if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
        this.turn = 0;
      } else if (e.code === 'ArrowUp') {
        this.speed = 0;
      }
    }
  }

  draw(c) {
    c.fill(color(128, 32, 255));
    c.ellipse(50, 50, 80, 95);
    c.rect(80, 10, 10, 10);
    c.rect(80, 80, 10, 10);
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    return this.turn;
  }
}