class SquareBot {
  /**
   * Draws the SquareBot.
   * @param {Renderer} c 
   */
  draw(c) {
    c.strokeWeight(10);
    c.stroke(color("SlateBlue"));
    c.fill(color("Indigo"));
    c.rect(10, 20, 60, 60);
    c.rect(20, 10, 60, 60);
    c.rect(20, 30, 60, 60);
    c.rect(30, 20, 60, 60);
  }

  /**
   * @param {SensorState} s 
   */
  run(s) {
    if (s.distanceToWall < 150) {
      s.turn = -1;
    } else if (s.rightDistanceToWall < 300) {
      s.turn = 0.2
    } else {
      s.turn = -0.1;
    }
    s.speed = 1.0;
  }
};
