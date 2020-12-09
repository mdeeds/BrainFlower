class SpinBot {
  constructor() {
  }

  reset() {
    this.turn = this.initial_turn;
  }
  /**
   * Draws the CircleBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color("Gold"));
    c.ellipse(50, 50, 95, 95);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    return 1.0;
  }
};