class CircleBot {
  constructor(turn = -0.20, change_rate = 0.0001) {
    this.initial_turn = turn;
    this.change_rate = change_rate;
    this.turn = turn;
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
    c.stroke(color("Black"));
    c.fill(color("Khaki"));
    c.ellipse(80, 50, 20, 20);
    c.ellipse(80, 50, 15, 15);

    c.rect(40, 40, 20, 20);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    this.turn = this.turn + this.change_rate;
    return this.turn;
  }
};