class LearnBot {
  constructor() {
    this.brain = new Brain("LearnBot");

    let body = document.getElementById('body');
    body.addEventListener('keydown', LearnBot.prototype.handleKey.bind(this));
    this.learning = false;

    this.referenceBot = new MattBot();
  }
  /**
   * Draws the LearnBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color("LightGreen"));
    c.stroke(color("PaleGray"));
    c.strokeWeight(8);
    c.ellipse(40, 50, 80, 80);
    c.ellipse(50, 40, 80, 80);
    c.ellipse(50, 60, 80, 80);
    c.ellipse(60, 50, 80, 80);
  }

  handleKey(e) {
    if (e.type === 'keydown') {
      if (e.code === 'KeyA') {
        this.learning = false;    
      } else if (e.code === 'KeyL') {
        this.learning = true;
      }
    }
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    let input = s.asArray();
    if (this.learning) {
      let referenceArray = this.referenceBot.run(s);
      this.brain.train(input, referenceArray);
      return referenceArray;
    } else {
      return this.brain.infer(input)[1];
    }  
  }
};
