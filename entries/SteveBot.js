class SteveBot {
  /**
   * Draws the bot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color(240, 20, 34));
    c.ellipse(50, 50, 95, 95);
    c.stroke(color(0, 40, 0));
    c.fill(color(20, 255, 200));
    c.ellipse(70, 50, 20, 20);
    c.ellipse(60, 50, 15, 15);

    c.rect(40, 40, 20, 20);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.leftFlowers == 0 && s.rightFlowers == 0) {
      return 1.0;
    }
    if (s.leftFlowerDistance == s.rightFlowerDistance) {
      return 0.0;
    }
    if (s.leftFlowerDistance > s.rightFlowerDistance) {
      return -0.5;
    }
    else {
      return 0.5;
    }
  }
};