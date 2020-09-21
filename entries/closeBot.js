class CloseBot {
  /**
   * Draws the CloseBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color("pink"));
    c.ellipse(50, 50, 100, 100);
    c.stroke(color("CornflowerBlue"));
    c.fill(color("DeepPink"));
    c.ellipse(70, 50, 25, 30);
    c.fill(color("HotPink"));
    c.ellipse(50, 70, 30, 25);
    c.ellipse(30, 50, 25, 30);
    c.ellipse(50, 30, 30, 25);
  }

  /**
   * @param {SensorState} s 
   * @returns {number[]} - [ speed, turn ] 
   */
  run(s) {
    if (s.rightFlowerDistance < s.leftFlowerDistance) {
      return -0.4;
    } else if (s.rightFlowerDistance > s.leftFlowerDistance) {
      return 0.4;
    }
    return 0.1;
  }
};