class RudeBot {
  /**
   * Draws the RudeBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.noStroke();
    c.fill(color(20, 0, 30));
    c.ellipse(50, 50, 100, 100);
    c.stroke(color(255, 0, 0));
    c.strokeWeight(8);
    c.ellipse(60, 50, 80, 80);
    c.ellipse(65, 50, 60, 60);
  }

  /**
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    let turn = s.opponentAngle / 45;
    return Math.max(-1, Math.min(1, turn));
  }
};
