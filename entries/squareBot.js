class SquareBot {
  constructor() {
    this.frontLimit = 150;
    this.rightLimit = 300;

  }

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
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.distanceToWall < this.frontLimit) {
      return 1;
    } else if (s.rightDistanceToWall < this.rightLimit) {
      return -0.5;
    } else {
      return 0.05;
    }
  }
};
