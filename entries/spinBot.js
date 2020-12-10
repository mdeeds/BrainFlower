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
    c.fill(color("White"));
    c.ellipse(50, 50, 95, 95);
    c.noFill();
    c.stroke(color("Red"));
    c.strokeWeight(3);
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 3) {
      let t = i;
      for (let r = 0; r < 50; r += 1) {
        c.line(
          50 + Math.cos(t + 0.0) * (r + 0), 50 + Math.sin(t + 0.0) * (r + 0),
          50 + Math.cos(t + 0.1) * (r + 1), 50 + Math.sin(t + 0.1) * (r + 1));
        t += 0.1
      }
    }

  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    return 1.0;
  }
};