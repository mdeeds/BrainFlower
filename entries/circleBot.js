class CircleBot {
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
    return 0.15;
  }
};