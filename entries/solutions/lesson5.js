/**
 * Matt's entry in the BrainFlower Game
 */
class MattBot {
  /**
   * 
   * @param {number} left 
   * @param {number} right 
   */
  constructor(left, right, hardTurn) {
    this.left = left || -0.2;
    this.right = right || 0.3;
    this.hardTurn = hardTurn || 1.0;
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
    if (s.leftFlowers == 0 && s.rightFlowers == 0) {
      return this.hardTurn;
    }
    if (s.rightFlowers > s.leftFlowers) {
      return this.right;
    } else {
      return this.left;
    }
  }
}