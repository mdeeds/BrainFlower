class LearnBot {
  constructor() {
    this.brain = new Brain("LearnBot");
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

  /**
   * 
   * @returns {tf.Model} model 
   */
  getModel() {
    return this.brain.model;
  }

  getBrain() {
    return this.brain;
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    let input = s.asArray();
    return this.brain.infer(input)[0];
  }
};
