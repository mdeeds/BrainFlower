/**
 * Matt's entry in the BrainFlower Game
 */
class MattBot {
  /**
   * 
   * @param {number} left 
   * @param {number} right 
   */
  constructor(left = -0.4, right = 0.4, hardTurn = -0.9) {
    this.left = left;
    this.right = right;
    this.hardTurn = hardTurn;
  }

  draw(c) {
    c.strokeWeight(10);
    c.stroke(color("PaleTurquoise"));
    c.fill(color("LightSkyBlue"));
    c.ellipse(50, 50, 90, 90);
    c.rect(75, 30, 20, 40);
  }

  /**
   * 
   * @param {SensorState} s 
   * @returns {number} - Turn rate [-1 to 1]
   */
  run(s) {
    if (s.distanceToWall < 71) {
      return this.hardTurn;
    }
    if (s.leftFlowers == 0 && s.rightFlowers == 0) {
      return this.hardTurn;
    }
    if (s.leftFlowers > s.rightFlowers) {
      return this.left;
    } else {
      return this.right;
    }
  }
}